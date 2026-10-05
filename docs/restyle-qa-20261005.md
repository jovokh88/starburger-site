# Five-dish restyle acceptance — 5 October 2026

Base commit: `edb80ed9d2172165f70ecddc66d024ebd5c87ec9`.

Integrated the supplied five-file restyle candidate, preserving native dialogs,
measured sticky toolbar spacing, three locales, existing venue photography and
the original package/lockfile. Replaced the old Pide/Kebab showcase with five
selected dishes. Kept the full menu on QRCHA and made Telegram general contact;
removed misleading per-dish order links. No cart, backend or new service.

## Content and images

QRCHA rechecked in Chrome at 15:38:06–15:38:19 UTC on 5 October 2026:

| Item | Variant | UZS | Source |
| --- | --- | ---: | --- |
| Star Burger | Star Burger | 66 000 | https://starburger.qrcha.uz/item/419 |
| Pizza Peperoni | 30 cm | 80 000 | https://starburger.qrcha.uz/item/408 |
| Lavash Dürüm | Oddiy | 39 000 | https://starburger.qrcha.uz/item/562 |
| Hot-dog | Oddiy | 25 000 | https://starburger.qrcha.uz/item/565 |
| Tavuk Kanat | Tavuk Kanat | 52 900 | https://starburger.qrcha.uz/item/467 |

The five named originals were supplied by the user and visually inspected here.
All are 8192×5464 with EXIF orientation 8 (displayed 5464×8192). Their original
files remain unchanged outside the repository. Auto-oriented square crops were
exported separately as 1440×1440 WebP, approximately 181–283 KB each. No generated
food, printed prices or invented portion weights. Variant mapping follows the
user's named upload context; pizza diameter cannot be measured from pixels.

The supplied package was already extracted. All 64 SHA256SUMS entries matched;
the patch applied cleanly to the manifest's exact base. The ZIP itself was not
present, so its container hash/CRC was not independently verified. Complete
extracted-file checksums and patch/base validation cover the code actually used.

## Verification

- Native lint: `node node_modules/eslint/bin/eslint.js .` — passed.
- Native production build: `node node_modules/next/dist/bin/next build` — passed,
  Next 16.3.3, original dependency versions and lockfile.
- Existing `scripts/visual-qa.mjs`: 21 Chromium/WebKit configurations, no failures.
- Updated `scripts/restyle-qa.mjs`: 42 configurations, no failures. Independent
  five-item name/price fixtures, Chromium 360/390/430/768/1024/1440 and WebKit 390,
  all locales, 100%/200% text, images, clipping, targets, reduced motion, navigation,
  dialogs, Escape/backdrop, focus cycling and toolbar height reservation.
- Additional checks: 15 locale/viewport cases, all five card/dialog name, price,
  photo and accessible-label mappings, Enter/Space, focus restoration, scroll-lock
  cleanup, 390×480 and 844×390 short/landscape cases, locale navigation and history.
- SEO: parsed DOM head and Restaurant JSON-LD per locale; one canonical,
  reciprocal uz/ru/en/x-default links, HTML language, localized metadata and OG,
  correct production image URL, phone and schema URL. Robots/sitemap served.
- Actual Chrome browser zoom: locally scoped extension used `chrome.tabs.setZoom`
  and `getZoom(2)`; viewport 1422×904 → 711×452, DPR 1 → 2 in all three locales.
  No CSS zoom/deviceScaleFactor substitution. No horizontal overflow, short-screen
  toolbar in document flow, dialog close reachable. Screenshots captured through
  CDP (Playwright's screenshot viewport adjustment interferes with browser zoom).
- Initial test failures were resolved: WebKit's default tabbing skipped links;
  dialog now cycles visible controls explicitly. Tests now wait for React close
  cleanup and browser history focus restoration before the next keyboard action.

## Performance scope

Local production `/uz`, Chrome CDP and PerformanceObserver, cache disabled:

| Viewport | Network / CPU | LCP | FCP | CLS | Resource transfer |
| --- | --- | ---: | ---: | ---: | ---: |
| 1440×900 | 20 ms, 20 Mbps, 1× CPU | 200 ms | 200 ms | 0 | 433,250 B |
| 390×844 | 150 ms, 1.6 Mbps, 4× CPU | 788 ms | 772 ms | 0 | 290,270 B |

These are single laboratory observations, not Lighthouse scores or real-user
Core Web Vitals. The six venue photos remain real source assets; the gallery now
uses three equal desktop columns instead of enlarging small responsive variants
across two columns, and one mobile column for readable rooms/facade.

## OPEN items and resolution

The restyle runner honestly retains OPEN for its keyboard-shortcut zoom attempt;
the separate measured browser-zoom test above resolves the required Chromium
zoom gate. WebKit browser zoom, physical iOS/Android devices, physical notch
safe areas and manual screen-reader output are not tested. These are non-critical
limits here: full Chromium acceptance, WebKit mobile emulation, real Chrome zoom,
short-screen behavior and simulated safe-area reservation are covered. No WCAG
certification or physical-device claim. Photo recognition/crop OPEN from the
automated runner is resolved by manual original/optimized/screenshot inspection.
External destination URLs are checked; no order, call, message or booking sent.

Evidence is retained in the executor's `evidence/` directory: original and crop
hashes, before screenshots, `acceptance/`, `deep/`, `zoom.json` and `performance.json`.
Deployment identity and live verification are recorded separately after release.
