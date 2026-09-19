/**
 * Generates the Flat Monkey Dark README banners, a light and a dark 1600x500
 * pair: the original MediaMonkey logo on the left, embedded verbatim and only
 * recoloured per theme, with the wordmark and the claim beside it.
 *
 * The wordmark uses Bree Serif and the claim Lato (both OFL), fetched from the
 * google/fonts mirror on jsDelivr into the OS temp dir and not committed. Text
 * is converted to SVG paths with opentype.js so the SVG is self-contained.
 *
 * Deps: `npm i -g @resvg/resvg-js opentype.js`.
 * Run:  node .github/assets/gen-banner.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const require = createRequire(import.meta.url);
const gRoot = execSync("npm root -g").toString().trim();
const { Resvg } = require(`${gRoot}/@resvg/resvg-js`);
const opentype = require(`${gRoot}/opentype.js`);

const __dir = dirname(fileURLToPath(import.meta.url));

const NAME = "Flat Monkey Dark";
const CLAIM = "Play it. Tag it. In the dark."; // no "w", which opentype.js draws wrong in Lato
const LEFT_MARGIN = 165;
const THEMES = [
  // logo = a dark accent on the white banner (readable), the #FFE000 sunflower
  // accent on the dark banner (matches the skin's dark-mode look).
  { suf: "",      bg: "#ffffff", name: "#1f2328", claim: "#5a5d5e", logo: "#0f62fe" },
  { suf: "-dark", bg: "#0d1117", name: "#e6edf3", claim: "#9aa4ad", logo: "#FFE000" },
];
const W = 1600, H = 500;
const LOGO_VB_W = 245.76, LOGO_VB_H = 225.43; // mediamonkey.svg viewBox
let nameSize = 120, claimSize = 40, gap = 56, LH = 367;
const maxGroupW = W - 245; // logo left-anchored at x=165, so keep >=80px right margin (165+80)

// Shaping glyph by glyph with manual pair kerning bypasses the GSUB feature engine
// and its ccmp NaN surprises, at no visual cost for Latin.
function shapeRun(font, text, size) {
  const scale = size / font.unitsPerEm;
  const run = [];
  let x = 0, prev = null;
  for (const ch of text) {
    const g = font.charToGlyph(ch);
    if (prev) {
      const k = font.getKerningValue(prev, g) * scale; // some fonts return NaN for pairs
      if (Number.isFinite(k)) x += k;
    }
    run.push({ g, x });
    const aw = g.advanceWidth * scale;
    x += Number.isFinite(aw) ? aw : size * 0.5;
    prev = g;
  }
  return { run, width: x };
}
const runWidth = (f, t, s) => shapeRun(f, t, s).width;
function runPathData(font, text, x, y, size) {
  let d = "";
  for (const { g, x: gx } of shapeRun(font, text, size).run) {
    // Integer positions, because opentype.js can emit NaN path commands for some
    // TrueType glyphs at fractional origins; any NaN left is skipped.
    const pd = g.getPath(Math.round(x + gx), Math.round(y), size).toPathData(2);
    if (!pd.includes("NaN")) d += pd;
  }
  return d;
}

function parseFont(buf) {
  return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
}
async function loadRemoteFont(url, cacheName) {
  const path = join(tmpdir(), `mmfmd-${cacheName}.ttf`);
  if (!existsSync(path)) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`font fetch ${cacheName}: ${res.status}`);
    writeFileSync(path, Buffer.from(await res.arrayBuffer()));
  }
  return parseFont(readFileSync(path));
}

const nameFont = await loadRemoteFont(
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/breeserif/BreeSerif-Regular.ttf",
  "BreeSerif-Regular",
);
const claimFont = await loadRemoteFont(
  "https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/lato/Lato-Regular.ttf",
  "Lato-Regular",
);

// The logo and text group shrinks to fit the banner width.
function layout() {
  const LW = LH * (LOGO_VB_W / LOGO_VB_H);
  const nameW = runWidth(nameFont, NAME, nameSize);
  const claimW = runWidth(claimFont, CLAIM, claimSize);
  const textW = Math.max(nameW, claimW);
  return { LW, nameW, claimW, textW, groupW: LW + gap + textW };
}
let L = layout();
if (L.groupW > maxGroupW) {
  const s = maxGroupW / L.groupW;
  nameSize *= s; claimSize *= s; gap *= s; LH *= s;
  L = layout();
}

const startX = LEFT_MARGIN;
const LX = startX, LY = (H - LH) / 2;
const textX = startX + L.LW + gap;

const em = (f, s) => s / f.unitsPerEm;
const nameAsc = nameFont.ascender * em(nameFont, nameSize);
const nameDesc = -nameFont.descender * em(nameFont, nameSize);
const claimAsc = claimFont.ascender * em(claimFont, claimSize);
const lineGap = 10; // claim pulled close to the name (banner standard)
const blockH = nameAsc + nameDesc + lineGap + claimAsc;
const nameBaseline = H / 2 - blockH / 2 + nameAsc;
const claimBaseline = nameBaseline + nameDesc + lineGap + claimAsc;

const namePath = runPathData(nameFont, NAME, textX, nameBaseline, nameSize);
const claimPath = runPathData(claimFont, CLAIM, textX, claimBaseline, claimSize);

// Embed the MediaMonkey logo verbatim; only the outer <svg> tag is re-attributed
// for positioning (the artwork inside is untouched).
let logo = readFileSync(join(__dir, "mediamonkey-logo.svg"), "utf8")
  .replace(/<\?xml[^>]*\?>\s*/, "")
  .replace(/<!--[\s\S]*?-->\s*/, "");
logo = logo.replace(
  /<svg[\s\S]*?>/,
  `<svg x="${LX.toFixed(1)}" y="${LY.toFixed(1)}" width="${L.LW.toFixed(1)}" height="${LH.toFixed(1)}" viewBox="0 0 ${LOGO_VB_W} ${LOGO_VB_H}" xmlns="http://www.w3.org/2000/svg">`,
);

for (const t of THEMES) {
  const tlogo = logo.replaceAll("#FFE000", t.logo); // recolour the monkey per theme
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Flat Monkey Dark">
  <rect width="${W}" height="${H}" fill="${t.bg}"/>
  ${tlogo}
  <path d="${namePath}" fill="${t.name}"/>
  <path d="${claimPath}" fill="${t.claim}"/>
</svg>
`;
  writeFileSync(join(__dir, `flat-monkey-dark-banner${t.suf}.svg`), svg);
  const png = new Resvg(svg, { fitTo: { mode: "width", value: W }, background: t.bg }).render().asPng();
  writeFileSync(join(__dir, `flat-monkey-dark-banner${t.suf}.png`), png);
}
console.log(`wrote banner + dark (nameSize ${nameSize.toFixed(1)}, gap ${gap.toFixed(0)}, logo #FFE000)`);
