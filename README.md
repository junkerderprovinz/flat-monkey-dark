<a href="https://www.mediamonkey.com">
  <img src="https://raw.githubusercontent.com/junkerderprovinz/mm-flat-monkey-dark/main/.github/assets/mm-flat-monkey-dark-banner.png" alt="Flat Monkey Dark" width="100%">
</a>

<p align="center">
  <a href="https://github.com/junkerderprovinz/mm-flat-monkey-dark/releases/latest"><img src="https://img.shields.io/github/v/release/junkerderprovinz/mm-flat-monkey-dark?style=for-the-badge&logo=github&logoColor=white&label=Release&color=1d99f3" alt="Release" height="36"></a>&nbsp;
  <a href="https://github.com/junkerderprovinz/mm-flat-monkey-dark/releases"><img src="https://img.shields.io/github/downloads/junkerderprovinz/mm-flat-monkey-dark/total?style=for-the-badge&logo=github&logoColor=white&label=Downloads&color=2ea043" alt="Downloads" height="36"></a>&nbsp;
  <a href="https://www.mediamonkey.com"><img src="https://img.shields.io/badge/MediaMonkey-5-fb8c00?style=for-the-badge&logoColor=white" alt="MediaMonkey 5" height="36"></a>&nbsp;
  <img src="https://img.shields.io/badge/Theme-Dark%20%C2%B7%20IBM%20Carbon-8a3ffc?style=for-the-badge" alt="Dark IBM Carbon theme" height="36">&nbsp;
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-Ventis%20Reciprocal-eab308?style=for-the-badge&logo=opensourceinitiative&logoColor=white" alt="License" height="36"></a>
</p>

<p align="center">
An unofficial dark reshell of MediaMonkey 5's <b>Flat Monkey</b> skin in the IBM Carbon greyscale palette, with a freely selectable accent colour in the MediaMonkey GUI. Monochrome everywhere, one splash of colour where you want it.
</p>

<p align="center">
  <a href="https://buymeacoffee.com/junkerderprovinz">
    <img src=".github/assets/button-buy-me-a-coffee.svg" alt="Buy me a coffee" width="220">
  </a>
</p>

<p align="center"><sub>Unofficial derivative. Not affiliated with, endorsed by, or supported by Ventis Media, Inc. See <a href="NOTICE">NOTICE</a> and <a href="LICENSE">LICENSE</a>.</sub></p>

<br>

## Table of Contents

1. [Overview](#1-overview)
2. [Install](#2-install)
3. [Change the accent colour](#3-change-the-accent-colour)
4. [What changed vs Flat Monkey](#4-what-changed-vs-flat-monkey)
5. [Build from source](#5-build-from-source)
6. [Credits & licence](#6-credits--licence)
7. [Support this project](#7-support-this-project)

<br>

## 1. Overview

**Flat Monkey Dark** takes MediaMonkey 5's bundled *Flat Monkey* skin and re-shells
it in the [IBM Carbon](https://carbondesignsystem.com/) greyscale palette — the same
monochrome dark look used across the other junkerderprovinz projects. The whole UI
is neutral grey; the single splash of colour is an accent you pick yourself.

**What's included**

- **Dark-only IBM Carbon shell** — window `#161616`, panels `#262626`, borders
  `#393939`, selection `#525252`, text `#f4f4f4`.
- **Free accent colour picker** in *Tools > Options > Skin* (default sunflower
  `#FFE000`), with a built-in readability guard so an unreadable choice is blocked.
- **Accent-tinted selection** — the selected track/file row is highlighted in your
  accent colour instead of grey, consistently (no grey-then-colour flicker on hover).
- **Size option** — Small / Normal / Large.

<br>

## 2. Install

1. Download `Flat Monkey Dark.mmip` from the [latest release](https://github.com/junkerderprovinz/mm-flat-monkey-dark/releases/latest).
2. In MediaMonkey: **Tools > Add-ons > Add…** and pick the file.
3. **Tools > Options > Layout / Skin** and select **Flat Monkey Dark**.

<br>

## 3. Change the accent colour

Open **Tools > Options > Skin > Accent color** — it's a real colour picker, so any
colour works. Handy swatches to paste in:

| Colour | Hex | Colour | Hex |
|---|---|---|---|
| Sunflower (default) | `#FFE000` | Rose | `#ea005e` |
| Orange | `#fb8c00` | Cyan | `#00b7c3` |
| Blue | `#218ce3` | Violet | `#b146c2` |
| Yellow | `#ffb900` | Red | `#ff4343` |
| Green | `#00cc6a` | | |

The accent drives the player highlight, now-playing track, progress/volume, sliders,
hotlinks and the selected-row tint. Everything else stays Carbon grey.

<br>

## 4. What changed vs Flat Monkey

- Dark greys swapped for the IBM Carbon ramp; the light theme variants removed
  (dark-only).
- The old fixed "Theme" radio (dark/light × orange/blue) replaced by a single free
  **Accent color** picker.
- Selected track/file rows now use an accent tint instead of grey.
- Everything else (layout, icons, fonts, behaviour) is Flat Monkey unchanged.

<br>

## 5. Build from source

The skin lives in `Flat Monkey Dark/`. Helpers:

- `build/package.ps1` → builds `dist/Flat Monkey Dark.mmip` (a ZIP with the payload
  at the archive root and forward-slash entries, as MediaMonkey expects).
- `build/make-thumb.ps1` → regenerates the skin thumbnail.
- `.github/assets/gen-banner.mjs` → regenerates the README banner (Node; needs
  `npm i -g @resvg/resvg-js opentype.js`).

For quick testing, drop the `Flat Monkey Dark/` folder into the MediaMonkey `skins`
directory and re-select the skin — the LESS recompiles on selection.

<br>

## 6. Credits & licence

Based on **Flat Monkey** © Ventis Media, Inc., modified under the
[Ventis Limited Reciprocal License](LICENSE), which explicitly permits derivative
skins. Bundled fonts: Open Sans (SIL Open Font License). The MediaMonkey name and
logo are trademarks of Ventis Media, Inc., used here nominatively. See [NOTICE](NOTICE).

<br>

## 7. Support this project

If this skin makes your MediaMonkey nicer to look at, consider buying me a coffee:

<p align="center">
  <a href="https://buymeacoffee.com/junkerderprovinz">
    <img src=".github/assets/button-buy-me-a-coffee.svg" alt="Buy me a coffee" width="220">
  </a>
</p>

<!-- build note: rendered check -->
