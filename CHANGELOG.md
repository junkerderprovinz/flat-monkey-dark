# Changelog

All notable changes to this project are documented here.
This project adheres to three-digit Semantic Versioning (vX.Y.Z).

## v1.1.0 — 2026-07-03

Consolidated stable release. Supersedes the iterative v1.0.0–v1.0.13 development
releases.

### Added
- **Dark-only IBM Carbon greyscale shell** — window `#161616`, panels `#262626`,
  borders `#393939`, text `#f4f4f4`. The light theme variants are removed.
- **Free accent colour picker** in *Tools > Options > Skin* (default sunflower
  `#FFE000`), with a built-in readability guard. The accent drives the player
  highlight, now-playing track, progress/volume, sliders, hotlinks and the selection.
- **Uniform accent selection** — selected rows use the full accent colour in every
  pane (track lists, now-playing list, playlist sidebar), in both focus states, with
  no grey flash on hover.
- **Auto-contrast foreground** — text, rating stars and icons on accent surfaces
  switch automatically: dark on light accents, light on dark accents (LESS
  `contrast()`), so any picked colour stays readable.
- **Seek waveform in the exact accent colour** (full strength, texture preserved).
- **Square title bars and panels** (no rounded list headers/panels).
- **Hidden breadcrumb path bar** for a cleaner main window.
- **Size option** (Small / Normal / Large).

### Fixed (vs. the original Flat Monkey)
- Selection remains visible and readable when a pane loses focus — Flat Monkey's
  "less prominent" tree-selection exception hid the selected row on unfocused trees;
  it is removed.

## v1.0.0 – v1.0.13 — 2026-07-01 … 2026-07-03

Iterative development releases, consolidated into v1.1.0.
