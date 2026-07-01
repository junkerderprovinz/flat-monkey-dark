# Flat Monkey Dark

An unofficial dark reshell of MediaMonkey 5's **Flat Monkey** skin in the IBM
Carbon greyscale palette, with a **freely selectable accent colour** in the
MediaMonkey GUI. Monochrome everywhere, one splash of colour where you want it.

> Unofficial derivative. Not affiliated with, endorsed by, or supported by
> Ventis Media, Inc. See [NOTICE](NOTICE) and [LICENSE](LICENSE).

## 1. Features

- Dark-only IBM Carbon greyscale (window `#161616`, panels `#262626`,
  borders `#393939`, selection `#525252`, text `#f4f4f4`).
- Free **Accent color** picker in Tools > Options > Skin (default sunflower
  `#FFE000`), with a built-in readability guard.
- Selected track/file rows highlighted in your accent colour.
- Adjustable UI size (Small / Normal / Large).

## 2. Install

1. Download `Flat Monkey Dark.mmip` from the latest [release](../../releases/latest).
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
`build/make-thumb.ps1` regenerates the thumbnail. For quick testing, drop the
`Flat Monkey Dark/` folder into the MediaMonkey `skins` directory and re-select
the skin (the LESS recompiles on selection).

## 5. Credits & licence

Based on **Flat Monkey** (c) Ventis Media, Inc., modified under the Ventis
Limited Reciprocal License ([LICENSE](LICENSE)). Fonts: Open Sans (OFL). See
[NOTICE](NOTICE).
