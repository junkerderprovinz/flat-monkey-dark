/**
 * Generates the Flat Monkey Dark README banner (house banner convention):
 *   mm-flat-monkey-dark-banner.svg / .png : white 1600x500 - the original
 *   MediaMonkey logo (embedded verbatim) on the left, the wordmark
 *   "Flat Monkey Dark" + a cheeky claim below.
 *
 * The wordmark uses Bree Serif and the claim uses Lato (both OFL house fonts),
 * fetched at runtime from the google/fonts mirror on jsDelivr, cached in the OS temp
 * dir, and never committed. Text is converted to SVG paths (opentype.js) so the
 * SVG is self-contained. The logo is embedded verbatim (never rebuilt).
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

// ---- content + styling -----------------------------------------------------
const NAME = "Flat Monkey Dark";
const CLAIM = "Play it. Tag it. In the dark."; // cheeky, no "w" (Lato "w" opentype.js trap)
const NAME_FILL = "#161616"; // Carbon dark - the skin's signature
const CLAIM_FILL = "#5a5d5e"; // house claim grey
const W = 1600, H = 500;
const LOGO_VB_W = 245.76, LOGO_VB_H = 225.43; // mediamonkey.svg viewBox
let nameSize = 120, claimSize = 40, gap = 56, LH = 300;
const maxGroupW = W - 160; // 80px margin each side
// ---------------------------------------------------------------------------

// Shape glyph-by-glyph (charToGlyph + manual pair kerning) - bypasses the GSUB
// feature engine entirely (no ccmp/NaN surprises) with no visual loss for Latin.
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
    // Integer positions: opentype.js can emit NaN path commands for some TrueType
    // glyphs at fractional origins. Round, and skip any residual NaN defensively.
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

// ---- auto-fit the group to the banner width --------------------------------
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

const startX = (W - L.groupW) / 2;
const LX = startX, LY = (H - LH) / 2;
const textX = startX + L.LW + gap;

const em = (f, s) => s / f.unitsPerEm;
const nameAsc = nameFont.ascender * em(nameFont, nameSize);
const nameDesc = -nameFont.descender * em(nameFont, nameSize);
const claimAsc = claimFont.ascender * em(claimFont, claimSize);
const lineGap = nameSize * 0.18;
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

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Flat Monkey Dark">
  <rect width="${W}" height="${H}" fill="#ffffff"/>
  ${logo}
  <path d="${namePath}" fill="${NAME_FILL}"/>
  <path d="${claimPath}" fill="${CLAIM_FILL}"/>
</svg>
`;
writeFileSync(join(__dir, "mm-flat-monkey-dark-banner.svg"), svg);

const png = new Resvg(svg, { fitTo: { mode: "width", value: W }, background: "white" }).render().asPng();
writeFileSync(join(__dir, "mm-flat-monkey-dark-banner.png"), png);
console.log(`wrote banner (name ${Math.round(L.nameW)}px, claim ${Math.round(L.claimW)}px, group ${Math.round(L.groupW)}px, nameSize ${nameSize.toFixed(1)})`);
