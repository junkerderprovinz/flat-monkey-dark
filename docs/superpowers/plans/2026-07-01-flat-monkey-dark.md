# Flat Monkey Dark Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-only MediaMonkey 5 skin derived from the bundled Flat Monkey skin, re-shelled in the IBM Carbon greyscale palette with a free, GUI-selectable accent colour (default sunflower #FFE000) and accent-tinted track-list selection.

**Architecture:** Copy the Flat Monkey skin payload verbatim, then surgically edit `info.json` (dark-only + `color` picker) and a handful of LESS files to swap Flat Monkey's dark greys for Carbon greys. Most LESS files are variable-based and inherit the change automatically; only 5 files carry hardcoded literals. A PowerShell script zips the payload contents into an installable `.mmip`. There is no automated test harness (MediaMonkey compiles LESS at runtime against app-internal base variables), so verification is grep-based invariant checks plus a manual install-and-look step by the user.

**Tech Stack:** MediaMonkey 5 skin format (LESS + JSON + HTML), PowerShell packaging, Git.

## Global Constraints

- Skin GUI title/id: `Flat Monkey Dark`; version `v1.0.0` (three-digit SemVer).
- Palette (IBM Carbon): window `#161616`, panel `#262626`, border/header/divider `#393939`, selection `#525252`, muted grey `#8d8d8d`, subtle grey `#6f6f6f`, text `#f4f4f4`. Accent default `#FFE000`.
- Accent is the ONLY colour; everything else monochrome. Accent stays wired as Flat Monkey has it, PLUS the track/file-list selected row gets an accent tint.
- Dark-only: no light variants. `@darkTheme` stays `true` (its default in `skin_base_add.less` line 14); the Flat Monkey "Theme" radio is removed so nothing sets it false.
- Error/warning stay accent-driven (Flat Monkey's current behaviour) — do NOT introduce functional colours.
- Licensing: Ventis Limited Reciprocal License; retain Ventis attribution; ship source + license; free; no trademark/endorsement claims. README carries an "unofficial, not affiliated with Ventis Media" disclaimer.
- NOT an Unraid container: no ASCII banner, no badges, no CA feed, no Docker Hub, no CI. General repo rules apply (commit+push+changelog, vault mirror, README current, no AI attribution, exact paths in chat, no real personal data).
- Payload lives in repo folder `Flat Monkey Dark/`; the `.mmip` is a ZIP of that folder's CONTENTS at the archive root (NO wrapping folder — verified against the original `Flat Monkey.zip`).
- Source to copy from: `C:\Program Files (x86)\MediaMonkey\skins\Flat Monkey.zip` (already extracted to the scratchpad at `…\scratchpad\Flat Monkey`).

---

### Task 1: Scaffold repo skeleton + copy skin payload

**Files:**
- Create: `Flat Monkey Dark/` (payload, copied verbatim from the extracted Flat Monkey source)
- Create: `LICENSE`, `NOTICE`, `.gitattributes`
- Repo already has: `.gitignore`, `docs/…design.md`, `docs/superpowers/plans/…` (this file)

**Interfaces:**
- Produces: the untouched skin payload under `Flat Monkey Dark/` (info.json, player.html, templates_add.js, thumb.png, controls/, layouts/, skin/) that later tasks edit in place.

- [ ] **Step 1: Copy the extracted Flat Monkey payload into the repo**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
$src  = "C:\Users\JUNKER~1\AppData\Local\Temp\claude\d--nextcloud-it-github\fa57ab3e-79c8-43f2-842d-d8cf6aad25ba\scratchpad\Flat Monkey"
$dst  = Join-Path $repo "Flat Monkey Dark"
New-Item -ItemType Directory -Force -Path $dst | Out-Null
Copy-Item -Path (Join-Path $src '*') -Destination $dst -Recurse -Force
```

- [ ] **Step 2: Verify the payload structure**

Run:
```powershell
Get-ChildItem "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\Flat Monkey Dark" | Select-Object Name
```
Expected: `controls`, `layouts`, `skin`, `info.json`, `player.html`, `templates_add.js`, `thumb.png`.

- [ ] **Step 3: Add `.gitattributes` (keep LESS/JSON/JS as LF for clean diffs)**

Create `.gitattributes`:
```gitattributes
* text=auto
*.less text eol=lf
*.json text eol=lf
*.js   text eol=lf
*.html text eol=lf
*.png  binary
*.ttf  binary
*.svg  text eol=lf
```

- [ ] **Step 4: Fetch the license verbatim into `LICENSE`**

Run:
```powershell
Invoke-WebRequest -Uri "https://www.mediamonkey.com/sw/mmw/5/Ventis_limited_reciprocal_license.txt" `
  -OutFile "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\LICENSE"
```
Expected: `LICENSE` exists and contains the Ventis Limited Reciprocal License text. If the download is blocked, paste the license text manually from the URL.

- [ ] **Step 5: Write `NOTICE`**

Create `NOTICE`:
```text
Flat Monkey Dark
================

This is an unofficial derivative work. It is not affiliated with, endorsed by,
or supported by Ventis Media, Inc.

Based on the "Flat Monkey" skin (c) Ventis Media, Inc., distributed with
MediaMonkey 5, used and modified under the Ventis Limited Reciprocal License
(see LICENSE). All original copyright and attribution notices are retained.

Bundled fonts: Open Sans, (c) The Open Sans Project Authors, licensed under the
SIL Open Font License 1.1 (see Flat Monkey Dark/skin/fonts/OFL.txt).

"MediaMonkey", "Flat Monkey" and related marks are trademarks of Ventis Media,
Inc. and are used here nominatively to describe compatibility only.
```

- [ ] **Step 6: Commit**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "chore: scaffold repo and copy Flat Monkey payload"
```

---

### Task 2: Transform `info.json` (dark-only, free accent picker, rename)

**Files:**
- Modify: `Flat Monkey Dark/info.json` (full rewrite)

**Interfaces:**
- Consumes: the `color` skin-option type (native `ColorPicker`, verified in the app's `helpers\skinConfig.js`) which binds one LESS variable and supports `visibilityCheck`.
- Produces: `@materialColor` set by the GUI colour picker; `@baseFontSize` by the Size dropdown. The Theme radio is gone, so `@darkTheme` keeps its `true` default from `skin_base_add.less`.

- [ ] **Step 1: Overwrite `info.json`**

```json
{
    "title": "Flat Monkey Dark",
    "id": "Flat Monkey Dark",
    "description": "Dark IBM-Carbon reshell of Flat Monkey with a free accent colour picker.",
    "version": "1.0.0",
    "type": "skin",
    "author": "junkerderprovinz (derivative of Flat Monkey by Ventis Media, Inc.)",
    "icon": "thumb.png",
    "skin_options": [
        {
            "type": "color",
            "title": "Accent color",
            "variable": "@materialColor",
            "default": "#FFE000",
            "visibilityCheck": "#161616"
        },
        {
            "type": "dropdown",
            "title": "Size",
            "variable": "@baseFontSize",
            "default": "13px",
            "options": { "12px": "Small", "13px": "Normal", "15px": "Large" }
        }
    ]
}
```

- [ ] **Step 2: Verify JSON is valid and has the color option**

Run:
```powershell
$j = Get-Content "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\Flat Monkey Dark\info.json" -Raw | ConvertFrom-Json
"$($j.id) | opts=$($j.skin_options.Count) | type0=$($j.skin_options[0].type) | var0=$($j.skin_options[0].variable)"
```
Expected: `Flat Monkey Dark | opts=2 | type0=color | var0=@materialColor`

- [ ] **Step 3: Commit**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "feat: dark-only info.json with free accent colour picker"
```

---

### Task 3: Carbon palette in `skin/skin_base_add.less`

**Files:**
- Modify: `Flat Monkey Dark/skin/skin_base_add.less`

**Interfaces:**
- Produces: the Carbon values for `@baseColor`, `@secondaryColor`, `@tertiaryColor`, `@selectedColor`, `@contrastColor`, `@borderColor`, `@textColor`, `@tooltipBgColor`, `@playerColor`, `@dividerColor`, `@invertedSecondaryColor`, and the `@materialColor` default — consumed by every downstream LESS file via variable references.

Apply these 13 exact replacements (each is a full-line replacement; the light branch of any `if((@darkTheme), …)` is left untouched — it is dead code under dark-only but harmless).

- [ ] **Step 1: `@baseColor` (line 3)**
Replace `@baseColor: if((@darkTheme), #3b3b3b, #efefef);`
with     `@baseColor: if((@darkTheme), #161616, #efefef);`

- [ ] **Step 2: `@materialColor` default (line 6)** — accent default (overridden live by the GUI picker)
Replace `@materialColor: #218ce3; //#76b9ed; // #fb8c00; // PRIMARY COLOR`
with     `@materialColor: #FFE000; // sunflower default; overridden by the Accent color picker`

- [ ] **Step 3: `@dividerColor` (line 13)**
Replace `@dividerColor: #BDBDBD; // DIVIDER COLOR`
with     `@dividerColor: #393939; // DIVIDER COLOR`

- [ ] **Step 4: `@textColor` (line 17)**
Replace `@textColor: if((@darkTheme), white, #191919);`
with     `@textColor: if((@darkTheme), #f4f4f4, #191919);`

- [ ] **Step 5: `@tooltipBgColor` (line 25)**
Replace `@tooltipBgColor: if((@darkTheme), #101010, white /*#f0f0f0*/);`
with     `@tooltipBgColor: if((@darkTheme), #262626, white /*#f0f0f0*/);`

- [ ] **Step 6: `@playerColor` (line 27)**
Replace `@playerColor: if((@darkTheme), #3b3b3b, #d7d7d7);`
with     `@playerColor: if((@darkTheme), #161616, #d7d7d7);`

- [ ] **Step 7: `@playerVolume` (line 30)**
Replace `@playerVolume: if((@darkTheme), white, black);`
with     `@playerVolume: if((@darkTheme), #f4f4f4, black);`

- [ ] **Step 8: `@secondaryColor` (line 33)**
Replace `@secondaryColor: if((@darkTheme), #2b2b2b, #ffffff);`
with     `@secondaryColor: if((@darkTheme), #262626, #ffffff);`

- [ ] **Step 9: `@tertiaryColor` (line 34)**
Replace `@tertiaryColor: if((@darkTheme), #333333, #e7e7e7);`
with     `@tertiaryColor: if((@darkTheme), #393939, #e7e7e7);`

- [ ] **Step 10: `@contrastColor` (line 44)**
Replace `@contrastColor: #b8b8b8;`
with     `@contrastColor: #8d8d8d;`

- [ ] **Step 11: `@borderColor` (line 46)** — subtle Carbon border instead of the light contrast grey
Replace `@borderColor: if((@darkTheme), @contrastColor, #d5d5d5);`
with     `@borderColor: if((@darkTheme), #393939, #d5d5d5);`

- [ ] **Step 12: `@selectedColor` (line 47)**
Replace `@selectedColor: if((@darkTheme), #646464, #d9d9d9);`
with     `@selectedColor: if((@darkTheme), #525252, #d9d9d9);`

- [ ] **Step 13: `@invertedSecondaryColor` (line 54)**
Replace `@invertedSecondaryColor: #b0b0b0;`
with     `@invertedSecondaryColor: #8d8d8d;`

- [ ] **Step 14: Verify no old dark literals remain and Carbon values are present**

Run:
```powershell
$f = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\Flat Monkey Dark\skin\skin_base_add.less"
rg -n "#3b3b3b|#2b2b2b|#333333|#646464|#b8b8b8|#b0b0b0|#BDBDBD|#101010|#218ce3" $f
```
Expected: NO matches (all old dark greys/accent replaced).

Run:
```powershell
rg -n "#161616|#262626|#393939|#525252|#8d8d8d|#f4f4f4|#FFE000" $f
```
Expected: matches present for each Carbon value.

- [ ] **Step 15: Commit**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "feat: IBM Carbon dark palette in skin_base_add.less"
```

---

### Task 4: Accent-tinted selection in `skin/skin_listview_add.less`

**Files:**
- Modify: `Flat Monkey Dark/skin/skin_listview_add.less`

**Interfaces:**
- Consumes: `@materialColor` (accent), `@textColor` from Task 3.
- Produces: track/file-list selected rows rendered with an accent tint; the left nav tree (`[data-control-class=MediaTree]`) stays subtle because its more-specific rule (already in this file, ~line 118, `background-color: inherit`) wins.

- [ ] **Step 1: Add the accent background to the selected-item block**

Find the existing block (around line 82):
```less
.lvItem[data-selected], div:focus .lvItem[data-selected], .lvItem[data-selected], div:focus .lvItem[data-selected] .lvInlineIcon  {
    color: @textColor;
    fill: @textColor;
```
Replace it with (adds one declaration):
```less
.lvItem[data-selected], div:focus .lvItem[data-selected], .lvItem[data-selected], div:focus .lvItem[data-selected] .lvInlineIcon  {
    color: @textColor;
    fill: @textColor;
    background-color: fade(@materialColor, 28%); /* Flat Monkey Dark: accent-tinted list selection */
```

- [ ] **Step 2: Verify the accent tint is present and the MediaTree override still follows it**

Run:
```powershell
$f = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\Flat Monkey Dark\skin\skin_listview_add.less"
rg -n "fade\(@materialColor, 28%\)" $f
rg -n "data-control-class=MediaTree" $f
```
Expected: the `fade(@materialColor, 28%)` line matches, and the MediaTree rule still exists at a LATER line number than the fade line.

- [ ] **Step 3: Commit**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "feat: accent-tinted selection in track/file list"
```

---

### Task 5: Remaining hardcoded literals (button, player, scrollbar)

**Files:**
- Modify: `Flat Monkey Dark/skin/skin_button_add.less`
- Modify: `Flat Monkey Dark/skin/skin_player_add.less`
- Modify: `Flat Monkey Dark/skin/skin_scrollbar.less`

**Interfaces:** none produced/consumed beyond the palette from Task 3.

- [ ] **Step 1: `skin_button_add.less` line 63** — disabled toolbutton fill
Replace `    fill: if((@darkTheme), white, black);`
with     `    fill: if((@darkTheme), #f4f4f4, black);`

- [ ] **Step 2: `skin_player_add.less` lines 126-127** — unchecked player button
Replace
```less
        fill: if(@darkTheme, white, black);
        color: if(@darkTheme, white, black);
```
with
```less
        fill: if(@darkTheme, #f4f4f4, black);
        color: if(@darkTheme, #f4f4f4, black);
```

- [ ] **Step 3: `skin_player_add.less` lines 139-140** — mini player button hover
Replace
```less
        fill: if(@darkTheme, white, black);
        color: if(@darkTheme, white, black);
```
with
```less
        fill: if(@darkTheme, #f4f4f4, black);
        color: if(@darkTheme, #f4f4f4, black);
```

- [ ] **Step 4: `skin_player_add.less` line 150** — video container frame (subtle Carbon frame instead of invisible black)
Replace `    border: 4px solid black;`
with     `    border: 4px solid #393939;`

- [ ] **Step 5: `skin_scrollbar.less` line 37** — visible scrollbar thumb
Replace `    background: #ababab;`
with     `    background: #6f6f6f;`

- [ ] **Step 6: Verify no stray light literals remain in these three files**

Run:
```powershell
$sk = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\Flat Monkey Dark\skin"
rg -n "#ababab" "$sk\skin_scrollbar.less"
rg -n ", white, black\)|solid black" "$sk\skin_player_add.less"
rg -n "\(@darkTheme\), white," "$sk\skin_button_add.less"
```
Expected: NO matches for any of the three (all replaced).

- [ ] **Step 7: Commit**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "fix: replace remaining hardcoded light literals with Carbon values"
```

---

### Task 6: Dark thumbnail `thumb.png`

**Files:**
- Modify: `Flat Monkey Dark/thumb.png` (replace)
- Create (temp): `build/thumb.svg` (source for rendering)

**Interfaces:** none. The thumbnail is what MediaMonkey shows in Options > Skin.

- [ ] **Step 1: Read the original thumbnail dimensions**

Run:
```powershell
Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile("d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\Flat Monkey Dark\thumb.png")
"$($img.Width)x$($img.Height)"; $img.Dispose()
```
Expected: prints WxH (e.g. `290x180`). Use these exact dimensions below.

- [ ] **Step 2: Create `build/thumb.svg` at those dimensions** (Carbon greyscale mock with a yellow accent bar). Substitute `WIDTH`/`HEIGHT` with the values from Step 1:

```svg
<svg xmlns="http://www.w3.org/2000/svg" width="WIDTH" height="HEIGHT" viewBox="0 0 WIDTH HEIGHT">
  <rect width="WIDTH" height="HEIGHT" fill="#161616"/>
  <rect x="0" y="0" width="WIDTH" height="18%" fill="#262626"/>
  <rect x="6%" y="30%" width="26%" height="58%" fill="#262626"/>
  <rect x="38%" y="30%" width="56%" height="10%" fill="#525252" opacity="0.55"/>
  <rect x="38%" y="44%" width="56%" height="8%" fill="#FFE000" opacity="0.28"/>
  <rect x="38%" y="56%" width="56%" height="8%" fill="#262626"/>
  <rect x="38%" y="68%" width="56%" height="8%" fill="#262626"/>
  <circle cx="10%" cy="9%" r="4%" fill="#FFE000"/>
</svg>
```

- [ ] **Step 3: Render the SVG to PNG via headless Chromium**

Run (adjust the Chrome/Edge path if needed; Windows ships `msedge`):
```powershell
$svg = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\build\thumb.svg"
$png = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\Flat Monkey Dark\thumb.png"
& "$env:ProgramFiles (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu `
  --screenshot="$png" --window-size=WIDTH,HEIGHT --default-background-color=00000000 "file:///$($svg -replace '\\','/')"
```
Expected: `thumb.png` regenerated at WIDTHxHEIGHT. If Chromium is unavailable, this task may be deferred to v1.0.1 (the skin still works with the original thumbnail).

- [ ] **Step 4: Commit**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "feat: dark Carbon thumbnail with accent"
```

---

### Task 7: Packaging script `build/package.ps1` + build the `.mmip`

**Files:**
- Create: `build/package.ps1`

**Interfaces:**
- Produces: `dist/Flat Monkey Dark.mmip` (a ZIP whose ROOT contains info.json, skin/, layouts/, controls/, … — no wrapping folder).

- [ ] **Step 1: Write `build/package.ps1`**

```powershell
# Packages the skin payload into an installable MediaMonkey .mmip (a ZIP with the
# skin files at the archive root — no wrapping folder).
$ErrorActionPreference = "Stop"
$root    = Split-Path -Parent $PSScriptRoot
$payload = Join-Path $root "Flat Monkey Dark"
$distDir = Join-Path $root "dist"
$zip     = Join-Path $distDir "Flat Monkey Dark.zip"
$mmip    = Join-Path $distDir "Flat Monkey Dark.mmip"

New-Item -ItemType Directory -Force -Path $distDir | Out-Null
if (Test-Path $zip)  { Remove-Item $zip  -Force }
if (Test-Path $mmip) { Remove-Item $mmip -Force }

# Compress the CONTENTS of the payload folder (root-level entries), not the folder itself.
Compress-Archive -Path (Join-Path $payload '*') -DestinationPath $zip -Force
Rename-Item -Path $zip -NewName "Flat Monkey Dark.mmip"
Write-Host "Built $mmip"
```

- [ ] **Step 2: Build and verify the archive root has no wrapping folder**

Run:
```powershell
powershell -ExecutionPolicy Bypass -File "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\build\package.ps1"
Add-Type -AssemblyName System.IO.Compression.FileSystem
$z = [System.IO.Compression.ZipFile]::OpenRead("d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\dist\Flat Monkey Dark.mmip")
$z.Entries | Select-Object -First 5 | ForEach-Object { $_.FullName }; $z.Dispose()
```
Expected: top entries are `controls/`, `info.json`, `layouts/`, `skin/`, … (NOT `Flat Monkey Dark/…`).

- [ ] **Step 3: Commit the script (dist/ is gitignored)**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "build: add .mmip packaging script"
```

---

### Task 8: README + swatch palette + finalize docs

**Files:**
- Create: `README.md`
- Create: `CHANGELOG.md`

**Interfaces:** none.

- [ ] **Step 1: Write `README.md`** (numbered sections; no container-style banner/badges)

```markdown
# Flat Monkey Dark

An unofficial dark reshell of MediaMonkey 5's **Flat Monkey** skin in the IBM
Carbon greyscale palette, with a **freely selectable accent colour** in the
MediaMonkey GUI. Monochrome everywhere, one splash of colour where you want it.

> Unofficial derivative. Not affiliated with, endorsed by, or supported by
> Ventis Media, Inc. See `NOTICE` and `LICENSE`.

## 1. Features

- Dark-only IBM Carbon greyscale (window `#161616`, panels `#262626`,
  borders `#393939`, selection `#525252`, text `#f4f4f4`).
- Free **Accent color** picker in Tools > Options > Skin (default sunflower
  `#FFE000`), with a readability guard.
- Selected track/file rows highlighted in your accent colour.
- Adjustable UI size (Small / Normal / Large).

## 2. Install

1. Download `Flat Monkey Dark.mmip` from the latest release.
2. In MediaMonkey: **Tools > Add-ons > Add** and pick the file.
3. **Tools > Options > Layout / Skin** and select **Flat Monkey Dark**.

## 3. Change the accent colour

**Tools > Options > Skin > Accent color** opens a colour picker — pick anything.
Handy swatches to paste in:

| Colour | Hex | Colour | Hex |
|---|---|---|---|
| Sunflower (default) | `#FFE000` | Rose | `#ea005e` |
| Orange | `#fb8c00` | Cyan | `#00b7c3` |
| Blue | `#218ce3` | Violet | `#b146c2` |
| Yellow | `#ffb900` | Red | `#ff4343` |
| Green | `#00cc6a` | | |

## 4. Build from source

Run `build/package.ps1` (PowerShell) to produce `dist/Flat Monkey Dark.mmip`.
For quick testing, drop the extracted `Flat Monkey Dark/` folder into the
MediaMonkey `skins` directory and re-select the skin (LESS recompiles).

## 5. Credits & licence

Based on **Flat Monkey** (c) Ventis Media, Inc., modified under the Ventis
Limited Reciprocal License (`LICENSE`). Fonts: Open Sans (OFL). See `NOTICE`.
```

- [ ] **Step 2: Write `CHANGELOG.md`**

```markdown
# Changelog

All notable changes to this project are documented here.
This project adheres to three-digit Semantic Versioning (vX.Y.Z).

## v1.0.0 — 2026-07-01

### Added
- Initial release: dark-only IBM Carbon reshell of MediaMonkey 5's Flat Monkey.
- Free **Accent color** picker in the MediaMonkey GUI (default sunflower `#FFE000`)
  with a readability guard.
- Accent-tinted selection for track/file lists.
- Size option (Small / Normal / Large).
```

- [ ] **Step 3: Commit**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo add -A
git -C $repo commit -m "docs: add README and CHANGELOG"
```

---

### Task 9: User install-and-look checkpoint (manual, in MediaMonkey 5)

**No code.** The skin cannot be visually verified programmatically — MediaMonkey
compiles the LESS at runtime against app-internal base variables. Hand the built
`dist/Flat Monkey Dark.mmip` to the user with this checklist:

- [ ] Install the `.mmip`, select **Flat Monkey Dark**.
- [ ] Main window, panels, menus, dialogs and player read as Carbon greyscale
      (no light patches, no leftover blue accent).
- [ ] Tools > Options > Skin shows the **Accent color** picker; changing it
      updates the accent live (player highlight, now-playing text, progress /
      volume, sliders, hotlinks) and the **selected track row** shows the tint.
- [ ] The left navigation tree selection stays subtle grey (not accent-filled).
- [ ] Size dropdown still switches Small / Normal / Large.

Fix any issue the user reports (most likely a stray hardcoded colour in a file
the audit marked clean, or a selector-specificity tweak for the selection tint)
before Task 10. Iterate: edit → re-run `build/package.ps1` → user re-tests.

---

### Task 10: Publish (external) — GitHub repo, push, v1.0.0 release, vault mirror

**Only after the user confirms Task 9 looks right.** This is the external-publishing
step.

- [ ] **Step 1: Create the public GitHub repo and push**

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
gh repo create junkerderprovinz/mediamonkey-flat-monkey-dark --public `
  --description "Dark IBM-Carbon reshell of MediaMonkey 5's Flat Monkey with a free accent colour picker." `
  --source $repo --remote origin
git -C $repo push -u origin main
```

- [ ] **Step 2: Build the release artifact and tag v1.0.0**

```powershell
powershell -ExecutionPolicy Bypass -File "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\build\package.ps1"
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
git -C $repo tag v1.0.0
git -C $repo push origin v1.0.0
```

- [ ] **Step 3: Create the GitHub release** (title = `v1.0.0` only; body = full changelog text; attach the `.mmip`)

```powershell
$repo = "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark"
gh release create v1.0.0 "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\dist\Flat Monkey Dark.mmip" `
  --repo junkerderprovinz/mediamonkey-flat-monkey-dark `
  --title "v1.0.0" `
  --notes-file "d:\nextcloud\it\github\mediamonkey-flat-monkey-dark\CHANGELOG.md"
```

- [ ] **Step 4: Mirror to the Obsidian vault** (per conventions)
  - Create project note `02 Projekte/Coding/MediaMonkey Flat Monkey Dark/MediaMonkey Flat Monkey Dark.md` (active project; PascalCase-ish per vault naming) with a dated changelog entry.
  - Report both changelogs (repo + vault breadcrumb) in chat.

- [ ] **Step 5: Present the two changelogs in chat** with exact paths (repo link + vault breadcrumb).

---

## Self-Review

**Spec coverage:**
- Public repo + credit → Tasks 1 (LICENSE/NOTICE), 8 (README disclaimer), 10 (public repo). ✓
- Free accent picker in GUI, default #FFE000 → Task 2. ✓
- Dark-only Carbon shell → Tasks 3, 5. ✓
- Accent-tinted list selection → Task 4. ✓
- Error/warning stay on accent → guaranteed by NOT touching them (Task 3 leaves `@warningColor`/`@errorColor` accent-derived). ✓
- Packaging (.mmip, no wrapper folder) → Task 7. ✓
- SemVer v1.0.0, changelog, vault mirror, no container machinery → Tasks 8, 10 + Global Constraints. ✓
- Thumbnail → Task 6. ✓

**Placeholder scan:** No TBD/TODO; every LESS edit shows exact before/after; thumbnail uses WIDTH/HEIGHT tokens explicitly resolved in Task 6 Step 1. ✓

**Type/name consistency:** `@materialColor` is the single accent variable across info.json (Task 2), base LESS default (Task 3 Step 2), and the selection tint (Task 4) — consistent. Payload folder `Flat Monkey Dark/` and archive-root packaging consistent across Tasks 1, 7, 10. ✓
