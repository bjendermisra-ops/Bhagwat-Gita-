# Bhagavad Gita — Daily Wisdom (web edition 12)

Static, mobile-first reader and verse card studio. Deploy the repository root to Vercel or any HTTPS static host. There is no build command or runtime API key.

## Included

- Custom editorial maximalist interface: lilac/lime/coral cover, print-style artwork gallery, bold chapter index and floating navigation. The reader keeps a quiet high-contrast surface, adjustable type and focus mode. Light/dark appearance throughout.
- All-chapter Sanskrit/transliteration/translation/commentary search, Roman-Hindi aliases, Devanagari digits, chapter.verse lookup and chapter filters.
- Deterministic daily verse using Asia/Kolkata date. Schedules the next midnight while open, with a 30-second safety check and an immediate check on resume; no background notification claim.
- Bookmarks, personal reflections, collections, reading progress, chapter journey, recall mode, language comparison and JSON backup/merge restore.
- Eight local image assets, three compositions (24 combinations), three export ratios, automatic text sizing and numbered overflow cards.
- Self-hosted fonts, JPEG exports, Web Share fallback and the existing AndroidShare image/text bridge.
- Service worker caches reading shell and data; settings can save all eight artwork assets. Offline browser use requires an initial successful online load and supported HTTPS service workers.

## Run locally

```
python3 -m http.server 8765
```

Open http://localhost:8765 . Do not open index.html directly using file://; data loading and service workers require HTTP(S). Copy index.html together with assets/, data/gita-v2.json, sw.js, manifest.webmanifest and logo.png.

## Data

Original chapter files are preserved. `python3 tests/build_data.py` regenerates the consolidated data from them with documented field repairs. See CONTENT_AUDIT.md for missing entries and reference corrections. The app never invents missing verses or attributes the existing commentary to Srila Prabhupada.

## Tests

Install Playwright in your development environment and its Chromium browser, then run `node tests/smoke.cjs` while the local server is running. Optional CHROMIUM_PATH selects an installed binary. Tests cover verse lookup, search aliases, midnight IST rollover, unique daily sequence, persistence, export pagination, narrow layouts and offline reload.

## Android / Sketchware boundary

This commit updates the web application only. The existing SWB still controls splash, connectivity, native sharing and ads. Its existing network check can blank the WebView when offline even though browser offline support works. Native lifecycle fixes, ads management, backup file handling and FCM remain for the separate SWB upgrade.

- Existing `AndroidShare.shareText`, `downloadImage`, `shareImageToWhatsApp` calls are preserved, with JPEG output matching the current bridge.
- `window.app.handleBack()` returns whether it handled a modal, focus mode or internal screen; updated Android code can call it before showing its exit dialog.
- No automatic fullscreen ad calls were added to reading or sharing flows. Native ad callbacks remain callable for compatibility.
- Local notes/bookmarks persist on the same origin. Existing bookmark and last-verse keys are migrated; original keys are retained.

## Assets

See ASSET_CREDITS.md for image provenance and font licenses. All shipped image/font requests are same-origin.
