# Changelog

All notable changes to this project are documented here.
This project adheres to three-digit Semantic Versioning (vX.Y.Z).

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
