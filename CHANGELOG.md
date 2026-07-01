# Changelog

All notable changes to this project are documented here.
This project adheres to three-digit Semantic Versioning (vX.Y.Z).

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
