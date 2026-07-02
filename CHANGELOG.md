# Changelog

All notable changes to this project are documented here.
This project adheres to three-digit Semantic Versioning (vX.Y.Z).

## v1.0.12 — 2026-07-02

### Changed
- Hid the breadcrumb/path bar in the main window (experimental, on request) so the list
  column header lines up with the now-playing header.

## v1.0.11 — 2026-07-02

### Fixed
- Selected-row icons now adapt to the accent (dark on light accents, light on dark), just
  like the text — the glyph paths are coloured directly, skipping the icons' transparent
  bounding box so they never fill into a square.

## v1.0.10 — 2026-07-02

### Fixed
- Reverted the over-aggressive subtle tree selection from v1.0.9 (it removed the sidebar
  highlight and washed the text out). The playlist sidebar is back to the normal accent
  selection — visible highlight + readable text. Only the main navigation tree stays
  subtle (its FlatMonkey original), and no icon is force-filled, so nothing squares.

## v1.0.9 — 2026-07-02

### Changed
- The playlist sidebar / navigation trees now use a **subtle** selection (their own dark
  background + light accent text) instead of the bright content accent — the correct
  treatment for navigation. This also fixes the sidebar icon: it stays a clean glyph and
  never fills into a square, without recolouring it.

### Reverted
- The experimental list-header nudge (`margin-top`) — it had no visual effect (the header
  isn't positioned by margin).

## v1.0.8 — 2026-07-02

### Changed
- Nudged the list column header up (`margin-top: -6px`) to line up with the now-playing
  panel header (experimental / calibratable).

## v1.0.7 — 2026-07-02

### Fixed
- The selected playlist icon is coloured instead of turning into a solid square — the
  fill now targets only the glyph path, skipping the Material icons' full-size
  `fill="none"` bounding box (which is what filled into a square).

## v1.0.6 — 2026-07-02

### Fixed
- The selected playlist's icon now switches to auto-contrast too (it stayed light and
  vanished on a bright accent).
- All list/panel title bars are square now — the list header and main-view panels were
  rounded (`7px`); buttons stay rounded.

## v1.0.5 — 2026-07-02

### Fixed
- The currently-playing track and the playlist sidebar are now readable when selected —
  every text element (not just `<label>`) flips to auto-contrast, overriding the base
  now-playing accent-text rule.
- Rating stars stay auto-contrast on hover / when changing a rating on a selected row
  (they turned near-white before).

## v1.0.4 — 2026-07-02

### Fixed
- Selecting a row no longer turns rating stars and inline icons into solid squares —
  the over-broad `*` rule was replaced with targeted label/star selectors.
- Waveform: the played portion is semi-transparent again so the waveform texture stays
  visible (v1.0.3's full opacity covered it), still in the full accent colour.

## v1.0.3 — 2026-07-02

### Fixed
- **Waveform** was drawn at 50% opacity by the base skin, washing the accent out — it
  now shows at full strength, matching the picked accent.
- **Selection text** is now forced (via `!important`, covering every child element) so
  rating stars and the now-playing list text also flip to readable auto-contrast text.

## v1.0.2 — 2026-07-02

### Fixed
- Rating stars and the now-playing list text now follow the auto-contrast rule too —
  readable on a bright accent selection (they kept a fixed light colour before).
- The seek **waveform** now uses the exact accent colour (was a lightened shade).

## v1.0.1 — 2026-07-02

### Changed
- Selected track/file rows now use the **full** accent colour (was a darker tint), so
  the highlight matches the colour you picked.
- **Auto-contrast text**: text and icons on accent surfaces (selection, buttons) switch
  to dark on light accents and light on dark accents, via LESS `contrast()` — no more
  unreadable text on bright accents like `#FFE000`.

## v1.0.0 — 2026-07-02

### Added
- Initial release: dark-only IBM Carbon reshell of MediaMonkey 5's Flat Monkey.
- Free **Accent color** picker in the MediaMonkey GUI (default sunflower `#FFE000`)
  with a readability guard.
- Accent-tinted selection for track/file lists.
- Size option (Small / Normal / Large).
