# Star Burger site refresh — 17 October 2026

## Changes

- Food-led home page using the existing real Star Burger photograph and a clearer menu action.
- Manrope variable font hosted with the site, including its SIL Open Font License.
- Compact dish grid with a direct full-menu tile; cards and gallery reflow when enlarged text needs more room.
- Restaurant branding and opening hours in the atmosphere section.
- Google and Yandex map choices, Telegram contact, and a map shortcut in the mobile toolbar.
- Uzbek, Russian, and English copy for every new action.

Base commit: `45a596e99d00ef1b3fa3948e6e596fdd6c3fb3da`.

## Local validation

- `npm run lint`: passed.
- `npm run build -- --webpack`: passed, including TypeScript and eight prerendered routes.
- 30 Chromium cases: UZ/RU/EN × 320/390/768/1024/1440 CSS pixels × 100%/200% root text size.
- 6 WebKit cases: UZ/RU/EN × 390 CSS pixels × 100%/200% root text size.
- All 36 final cases passed with no recorded page errors, missing images, clipped text, undersized controls, or horizontal page overflow.
- The existing runner checked native photo dialogs for all five dishes, keyboard focus, Escape, close button, backdrop dismissal, focus restoration, mobile navigation, anchor history/Back, reduced motion, and measured bottom-toolbar space.
- Checked existing menu/contact/review link destinations and unchanged dish names/prices. External orders, calls, and messages were not submitted.
- Final screenshots of desktop UZ and mobile UZ/RU plus tablet EN were inspected.

The first pass found long gallery captions overflowing at 320 pixels with 200% text. Intrinsic grid reflow and wrapping fixed this; the full matrix above was rerun against the final files.

## Reproduction

Dependencies for browser checks are isolated from the application lockfile. Playwright 1.51.1 was used with Chromium 134 and WebKit 18.4. The project dependency files were not changed.

```bash
npm ci --no-audit --no-fund
npm run lint
npm run build -- --webpack
npm run start -- --hostname 127.0.0.1
# In a second terminal, point QA_TOOLS_DIR at an isolated Playwright installation:
QA_TOOLS_DIR=/path/to/browser-tools QA_ENGINES=chromium QA_WIDTHS=320,390,768,1024,1440 QA_TEXT=100,200 node scripts/restyle-qa.mjs
QA_TOOLS_DIR=/path/to/browser-tools QA_ENGINES=webkit QA_WIDTHS=390 QA_TEXT=100,200 node scripts/restyle-qa.mjs
```

## Scope and limits

This record covers the local Next.js production build. Turbopack could not bind its helper port in the execution sandbox, so the local test used the supported Webpack build flag. The normal project build command remains `next build`; Vercel performs its own build from the release commit.

The 200% cases enlarge root text; they are not a claim of measured browser zoom. Physical-device safe areas and manual screen-reader use were not tested. Existing listed prices were preserved; the live QRCHA price list was not independently verified during this change.

## Runtime source fingerprints

| File | SHA-256 |
| --- | --- |
| `components/home-page.tsx` | `b1e583becf1c7a8fdd316fc66fbc938643171b4a8c39b394983b1b6349d2bec0` |
| `lib/premium-ui.ts` | `bf7091c42b2aa598f8025642cbd9b3b4052196596dd5a82ca78354c4a1741591` |
| `app/restyle.css` | `ff82c0d5d0909e315ee103fdf3e5af4cfa8542705a1a9e440cc07e9cbbfe2d8a` |
| `app/globals.css` | `de200222e53214faf6e35266c4df3802a49b04bb77898200dc62f18440f95345` |
| `app/visual-refinements.css` | `32ca05e11c2354c08324f35e96d8c42e0b88fb281473f9f0f22510a9def1bbca` |
| `lib/site-data.ts` | `358af8938de0a7dae2c46efbace3acb920a1bfd81f3c87af2ea1ec559482d701` |
| `lib/site-config.ts` | `ef7d13df678719cd8573b47b88c300463e2316c4d05d573512d7c14635aacff1` |
| `package-lock.json` | `1c3175db01e68604e0504cdcbeaa48feeb172e170ae7df70cff31b937f2c6d48` |
| `public/fonts/manrope-variable.woff` | `2ff2d8481327e9c1dcc3d91a5d7b6519c3bcf12a21d38bec0603fd2ca5b57528` |
