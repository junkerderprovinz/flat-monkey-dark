# Flat Monkey Dark — Design / Spec

**Date:** 2026-07-01
**Repo:** `mediamonkey-flat-monkey-dark` (GitHub: junkerderprovinz, public)
**Skin title (in MediaMonkey GUI):** `Flat Monkey Dark`
**Version:** v1.0.0

## 1. Goal

A dark-only MediaMonkey 5 skin derived from the bundled **Flat Monkey** skin
(© Ventis Media, Inc.), re-shelled in the house **IBM Carbon** greyscale palette
(the same palette used for Krusader) and giving the user a **freely selectable
accent colour** in the MediaMonkey GUI. The accent's default is a sunflower
yellow. The single visible splash of colour is the accent; everything else is
monochrome Carbon grey.

## 2. Source & licensing

- **Base:** `C:\Program Files (x86)\MediaMonkey\skins\Flat Monkey.zip`
  (MediaMonkey 5 bundled skin, author "Ventis Media, Inc.", version 1.0.0).
- **License:** the MediaMonkey skin code is covered by the **Ventis Limited
  Reciprocal License**
  (<https://www.mediamonkey.com/sw/mmw/5/Ventis_limited_reciprocal_license.txt>),
  which **explicitly permits creating and distributing derivative works**,
  subject to:
  - distribute the source alongside a copy of the license (a skin *is* source — fine),
  - retain all existing copyright / attribution notices,
  - the derivative must run on a Ventis product (MediaMonkey — fine),
  - no paywalled functionality (it's free — fine),
  - no use of Ventis names/logos/trademarks as endorsement.
- **Repo obligations:** `LICENSE` = full VLRL text; `NOTICE` credits
  "*Flat Monkey* © Ventis Media, Inc." as the base and OpenSans (OFL) for fonts;
  README carries an "unofficial, not affiliated with Ventis Media" disclaimer.
- **Fonts:** OpenSans is bundled under the OFL — redistributable. No commercial
  assets involved.

## 3. Scope decisions (locked)

| # | Decision | Choice |
|---|----------|--------|
| 1 | Repo visibility | **Public**, with credit |
| 2 | Accent scope | Accent stays as Flat Monkey uses it now; **selected row in the track/file list gets the accent** instead of grey |
| 3 | Light variants | **Dropped** — dark-only |
| 4 | Accent control in GUI | **Free colour picker** (`skin_options` `type: color`), default **#FFE000** |
| 5 | Error/Warning colours | **Stay on the accent** (Flat Monkey's current behaviour) |

## 4. Accent selector (the "Bonus")

MediaMonkey 5 `skin_options` supports three control types (verified in the app
source `helpers\skinConfig.js`): `radio`, `dropdown`, `color`. The `color` type
renders a native `ColorPicker` bound to one LESS variable and supports an
optional `visibilityCheck` that blocks unreadable choices. Real example:
Monkey Groove uses `{ "type": "color", "variable": "@warningColor", ... }`.

Constraint: one control writes exactly one LESS variable, and if two controls
target the same variable the later one always wins — so a preset `radio` and a
free `color` picker on `@materialColor` cannot coexist. We therefore ship **one
free colour picker** (strictly more powerful than a preset list) and keep the
curated swatches in the README for copy-paste.

Final `info.json` `skin_options`:

```json
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
```

- The old Flat Monkey "Theme" radio (dark/light × orange/blue) is **removed**;
  `@darkTheme` is hardcoded `true` in `skin_base_add.less`.
- Setting `@materialColor` cascades correctly: the base LESS derives
  `@materialLightColor`, `@accentColor`, `@hotlinkColor`, `@playerHighlight`,
  `@warningColor`, `@errorColor`, etc. from it.
- `visibilityCheck: "#161616"` prevents an accent that would vanish on the dark
  background.

**README swatch palette** (paste into the picker):
Sunflower `#FFE000` (default) · Orange `#fb8c00` · Blue `#218ce3` ·
Yellow `#ffb900` · Green `#00cc6a` · Rose `#ea005e` · Cyan `#00b7c3` ·
Violet `#b146c2` · Red `#ff4343`.

## 5. Colour mapping — Flat Monkey dark → IBM Carbon

Applied in `skin/skin_base_add.less` (dark branch of each `if((@darkTheme), …)`,
or as the plain value now that light is gone):

| LESS variable | Flat Monkey (dark) | → Carbon | Role |
|---|---|---|---|
| `@baseColor` | `#3b3b3b` | **`#161616`** | window background |
| `@secondaryColor` | `#2b2b2b` | **`#262626`** | panels / sidebar / toolbar |
| `@tertiaryColor` | `#333333` | **`#393939`** | borders / headers |
| `@selectedColor` | `#646464` | **`#525252`** | selection (general chrome) |
| `@contrastColor` | `#b8b8b8` | **`#8d8d8d`** | muted borders/icons |
| `@textColor` (dark) | `white` | **`#f4f4f4`** | text |
| `@invertedSecondaryColor` | `#b0b0b0` | **`#8d8d8d`** | secondary text |
| `@tooltipBgColor` | `#101010` | **`#262626`** | tooltips |
| `@playerColor` | `#3b3b3b` | **`#161616`** | player bar |
| `@dividerColor` | `#BDBDBD` | **`#393939`** | dividers |
| `@materialColor` (accent) | `#218ce3` | **`#FFE000`** (user-set) | accent |

Carbon reference ramp (for anything else encountered): `#161616` `#1e1e1e`
`#262626` `#393939` `#525252` `#6f6f6f` `#8d8d8d` `#f4f4f4`; functional
(unused by choice) error `#fa4d56` / warning `#f1c21b`.

## 6. Track/file list — selected row in accent

Override in `skin/skin_listview_add.less` so the selected row uses an accent
tint (readable text kept):

```less
.lvItem[data-selected] {
    background-color: fade(@materialColor, 28%);
    color: @textColor;
    fill: @textColor;
}
```

- Only the track/file listview changes; other selections (trees, dialogs) stay
  Carbon grey `#525252`.
- A faded tint (not solid accent) keeps `#f4f4f4` text readable for any accent
  the user picks, including light ones.

## 7. File-by-file work

The colour hub is `skin/skin_base_add.less`; most variables cascade from there.
But every `*_add.less` (and the `layouts/Touch/skin/*` copies) must be audited
for **hardcoded** greys/whites that bypass the variables:

- `skin/`: `skin_base_add.less` (main mapping + `@darkTheme:true`),
  `skin_listview_add.less` (selection accent), plus audit
  `skin_button_add`, `skin_menu_add`, `skin_navigation_add`, `skin_player_add`,
  `skin_progressbar_add`, `skin_scrollbar`, `skin_slider_add`, `skin_tabs_add`,
  `skin_toastmessage_add`, `skin_treeview_add`, `skin_dropdown_add`,
  `skin_checkbox_add`, `skin_controls_add`, `skin_layout_add`,
  `skin_mainwindow_add`, `skin_window_base_add`, `skin_icons_add`.
- `layouts/Touch/skin/`: `skin_base_add`, `skin_checkbox_add`,
  `skin_listview_add`, `skin_menu_add`, `skin_treeview_add`.
- Unchanged (copied verbatim): `player.html`, `templates_add.js`,
  `controls/taskscontroller_add.js`, `skin/fonts/*`, `skin/icon/*.svg`.
- `info.json`: title/id `Flat Monkey Dark`, description, version `1.0.0`,
  new `skin_options`, author credits derivative + retains Ventis attribution.
- `thumb.png`: new dark thumbnail (accent-yellow highlight on Carbon grey).

## 8. Repo structure

```
mediamonkey-flat-monkey-dark/
├─ Flat Monkey Dark/          # skin package payload (zipped verbatim into the .mmip)
│  ├─ info.json
│  ├─ player.html
│  ├─ templates_add.js
│  ├─ thumb.png
│  ├─ controls/taskscontroller_add.js
│  ├─ layouts/Touch/skin/*.less
│  └─ skin/
│     ├─ *_add.less  +  skin_scrollbar.less
│     ├─ fonts/OpenSans-*.ttf  +  OFL.txt
│     └─ icon/*.svg
├─ build/package.ps1          # zip "Flat Monkey Dark/" → dist/Flat Monkey Dark.mmip
├─ dist/                      # built .mmip (gitignored or released)
├─ docs/2026-07-01-flat-monkey-dark-design.md
├─ README.md                  # desc, screenshots, install, accent howto, swatches, credit/disclaimer
├─ LICENSE                    # Ventis Limited Reciprocal License
├─ NOTICE                     # attribution (Flat Monkey © Ventis Media; OpenSans OFL)
├─ CHANGELOG.md
└─ .gitignore
```

- The `.mmip` is a plain ZIP whose root contains the `Flat Monkey Dark/` folder
  (mirrors how `Flat Monkey.zip` is built). Install via Tools > Addons > Add,
  or drop the extracted folder into the MediaMonkey `skins` directory for
  quick testing (restart / re-select the skin recompiles the LESS).

## 9. Conventions that apply / don't

- **Apply:** three-digit SemVer (`v1.0.0`); commit + push + changelog; mirror to
  the Obsidian vault with a dated changelog (project note under
  `02 Projekte/Coding/`, active project); README kept current; no AI attribution;
  exact paths reported in chat; real values only (no personal data).
- **Do NOT apply:** Unraid/own-image container machinery — no ASCII banner, no
  badges, no CA feed / `unraid-apps` entry, no Docker Hub mirror, no CI boot
  smoke-test. This is a desktop-app skin, not a container.

## 10. Validation (manual, in MediaMonkey 5)

1. Package the `.mmip`, install it, select "Flat Monkey Dark".
2. Verify Carbon greyscale across main window, panels, menus, dialogs, player.
3. Tools > Options > Skin: confirm the **Accent color** picker appears; change
   it and confirm the accent updates live (player highlight, now-playing,
   progress/volume, sliders, hotlinks) and that the **selected track row** shows
   the accent tint.
4. Confirm the Size dropdown still works.
5. Confirm no light-mode remnants and no unreadable/hardcoded light patches.
```
