/** Additive checks for the existing scripts/visual-qa.mjs.
 * Run against the locally built Next server only. Never point this at production.
 * Test dependencies remain isolated in QA_TOOLS_DIR, as in the existing workflow.
 */
import { createRequire } from 'node:module'
import fs from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:3000'
const url = new URL(origin)
if (url.protocol !== 'http:' || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
  throw new Error('Only an isolated local HTTP server is allowed; no production/external tests.')
}
if (!process.env.QA_TOOLS_DIR) throw new Error('Set QA_TOOLS_DIR to the existing isolated Playwright tools directory.')
const require = createRequire(path.join(process.env.QA_TOOLS_DIR, 'package.json'))
const playwright = require('playwright')
const requestedEngines = (process.env.QA_ENGINES || 'chromium,webkit').split(',')
if (requestedEngines.some(engine => !['chromium', 'webkit'].includes(engine))) throw new Error('QA_ENGINES must contain chromium and/or webkit.')
const output = process.env.QA_REPORT_DIR || 'qa-report/restyle'
await fs.mkdir(output, { recursive: true })
const report = { scope: 'local Next production build', startedAt: new Date().toISOString(), results: [], failures: [], open: [], sourceSha256: {} }
for (const file of ['components/home-page.tsx', 'lib/premium-ui.ts', 'app/restyle.css', 'app/globals.css', 'app/visual-refinements.css', 'lib/site-data.ts', 'lib/site-config.ts', 'package-lock.json']) {
  report.sourceSha256[file] = crypto.createHash('sha256').update(await fs.readFile(file)).digest('hex')
}
const save = () => fs.writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
const verify = (condition, message) => { if (!condition) report.failures.push(message) }
const labels = { uz: ['Taomlar', 'To‘liq menyu'], ru: ['Блюда', 'Полное меню'], en: ['Dishes', 'Full menu'] }
const prices = ['66 000 UZS', '80 000 UZS', '39 000 UZS', '25 000 UZS', '52 900 UZS']
const names = ['Star Burger', 'Pizza Peperoni (30 cm)', 'Lavash Dürüm (Oddiy)', 'Hot-dog (Oddiy)', 'Tavuk Kanat']
const destinations = {
  menu: 'https://starburger.qrcha.uz', telegram: 'https://t.me/starburger_uz', tel: 'tel:+998955033333',
  instagram: 'https://instagram.com/starburger_uz',
  googleReviews: 'https://search.google.com/local/reviews?placeid=ChIJTznuqjWVsjgRX5cjyVgw9kM',
  yandexReviews: 'https://yandex.com/maps/org/star_burger/205284545149/reviews/',
  directions: "https://www.google.com/maps/search/?api=1&query=Star+Burger%2C+Qodirjon+Inomov+ko%27chasi+73%2C+Jizzax"
}

function inspect() {
  const visible = element => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden'
  const box = element => { const rect = element.getBoundingClientRect(); return { x: rect.x, y: rect.y, width: rect.width, height: rect.height, right: rect.right, bottom: rect.bottom } }
  const controls = [...document.querySelectorAll('a,button')].filter(visible).map(element => ({ name: element.getAttribute('aria-label') || element.textContent.trim(), ...box(element) }))
  const clipped = [...document.querySelectorAll('h1,h2,h3,p,.card-copy,.langs,.nav-controls,figcaption,a,button')]
    .filter(visible).filter(element => !element.classList.contains('skip-link'))
    .map(element => ({ text: element.textContent.trim().slice(0,100), ...box(element), client: element.clientWidth, scroll: element.scrollWidth }))
    .filter(element => element.x < -1 || element.right > innerWidth + 1 || element.scroll > element.client + 1)
  const panel = document.querySelector('.mobile-actions')
  const photo = document.querySelector('.hero-photo')
  return {
    width: innerWidth, height: innerHeight, scrollWidth: document.documentElement.scrollWidth, lang: document.documentElement.lang,
    clipped, smallControls: controls.filter(control => control.width < 43.5 || control.height < 43.5), controls,
    panelPosition: getComputedStyle(panel).position, panelHeight: box(panel).height, bodyPadding: parseFloat(getComputedStyle(document.body).paddingBottom),
    gallery: [...document.querySelectorAll('.g')].map(box),
    missingImages: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.currentSrc || image.src),
    heroCrop: { ratio: getComputedStyle(photo).aspectRatio, fit: getComputedStyle(photo.querySelector('img')).objectFit, position: getComputedStyle(photo.querySelector('img')).objectPosition },
    hrefs: [...new Set([...document.querySelectorAll('a')].map(a => a.getAttribute('href')))].sort(),
    dishes: [...document.querySelectorAll('.card-copy')].map(card => ({ name: card.querySelector('h3').textContent, price: card.querySelector('strong').textContent.replace(/\s+/g,' ').trim() })),
    animations: document.getAnimations().length
  }
}
function focusState() {
  const element = document.activeElement
  const rect = element.getBoundingClientRect()
  const style = getComputedStyle(element)
  const top = document.elementFromPoint(Math.max(1, Math.min(innerWidth - 1, rect.x + rect.width / 2)), Math.max(1, Math.min(innerHeight - 1, rect.y + rect.height / 2)))
  return { inDialog: Boolean(element.closest('dialog')), visible: rect.top >= -1 && rect.bottom <= innerHeight + 1 && rect.left >= -1 && rect.right <= innerWidth + 1, unobscured: element === top || element.contains(top), outline: style.outlineStyle, outlineWidth: parseFloat(style.outlineWidth), name: element.getAttribute('aria-label') || element.textContent }
}
async function restrictNetwork(context) {
  await context.route('**/*', route => {
    const requested = new URL(route.request().url())
    return requested.origin === url.origin && !requested.pathname.startsWith('/_vercel/') ? route.continue() : route.abort()
  })
}
async function imagesLoaded(page) {
  const images = page.locator('main img')
  for (let index = 0; index < await images.count(); index++) {
    await images.nth(index).scrollIntoViewIfNeeded()
    await images.nth(index).evaluate(async image => {
      if (!image.complete) await Promise.race([
        new Promise(resolve => { image.addEventListener('load', resolve, { once: true }); image.addEventListener('error', resolve, { once: true }) }),
        new Promise(resolve => setTimeout(resolve, 7000))
      ])
    })
  }
  await page.evaluate(() => window.scrollTo(0, 0))
}

try {
  const root = await fetch(origin, { redirect: 'manual' })
  verify([307, 308].includes(root.status) && root.headers.get('location') === '/uz', 'Root redirect changed')
  verify((await fetch(`${origin}/invalid-locale`)).status === 404, 'Invalid locale must be 404')
  for (const engine of requestedEngines) {
    let browser
    try {
      browser = await playwright[engine].launch(engine === 'chromium' && process.env.QA_CHROMIUM_PATH ? { executablePath: process.env.QA_CHROMIUM_PATH } : {})
    } catch (error) {
      report.open.push(`${engine} unavailable: ${String(error)}`)
      continue
    }
    try {
      for (const locale of (process.env.QA_LOCALES || 'uz,ru,en').split(',')) {
        const response = await fetch(`${origin}/${locale}`)
        const html = await response.text()
        verify(response.status === 200 && new RegExp(`<html[^>]*lang="${locale}"`).test(html), `${locale}: server locale`)
        verify(html.includes(`https://starburger-site.vercel.app/${locale}`), `${locale}: canonical/public URL`)
        for (const textPercent of (process.env.QA_TEXT || '100,200').split(',').map(Number)) {
          for (const width of process.env.QA_WIDTHS ? process.env.QA_WIDTHS.split(',').map(Number) : engine === 'chromium' ? [360, 390, 430, 768, 1024, 1440] : [390]) {
            const id = `${engine}-${locale}-${width}-text${textPercent}`
            const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce', ...(engine === 'webkit' ? { isMobile: true, hasTouch: true } : {}) })
            await restrictNetwork(context)
            const page = await context.newPage()
            const errors = []
            page.on('pageerror', error => errors.push(String(error)))
            try {
              await page.goto(`${origin}/${locale}`, { waitUntil: 'networkidle' })
              if (await page.evaluate(() => Boolean(window.__TEST_RUNTIME__) || !document.querySelector('script[src*="/_next/"]'))) throw new Error('Not the real Next build; compatibility previews are not accepted by this runner.')
              if (textPercent === 200) await page.evaluate(() => { document.documentElement.style.fontSize = '200%' })
              await imagesLoaded(page)
              const info = await page.evaluate(inspect)
              verify(info.scrollWidth <= width + 1 && info.clipped.length === 0, `${id}: overflow/clipping`)
              verify(info.smallControls.length === 0, `${id}: 44px design target (not a full WCAG audit)`)
              verify(info.gallery.length === 6 && info.gallery.every(photo => photo.height > 100), `${id}: all six gallery cells`)
              verify(info.missingImages.length === 0, `${id}: source images did not load`)
              verify(info.animations === 0, `${id}: reduced motion`)
              verify(info.panelPosition !== 'fixed' || info.bodyPadding >= info.panelHeight - .5, `${id}: bottom panel reservation`)
              verify(info.heroCrop.fit === 'cover' && info.heroCrop.position === '50% 50%' && info.heroCrop.ratio === '1 / 1', `${id}: existing hero crop geometry changed`)
              verify(JSON.stringify(info.dishes) === JSON.stringify(names.map((name, index) => ({ name, price: prices[index] }))), `${id}: names/prices changed`)
              verify(await page.locator('.hero .primary').textContent() === labels[locale][1] && await page.locator('.mobile-actions a').first().textContent() === labels[locale][1], `${id}: primary action labels`)
              verify(Object.values(destinations).every(destination => info.hrefs.includes(destination)), `${id}: existing destination changed`)
              verify(await page.locator('.hero .primary').getAttribute('href') === destinations.menu, `${id}: menu destination`)
              verify(await page.locator('.card-order').count() === 0, `${id}: no misleading dish order links`)
              verify(errors.length === 0, `${id}: runtime errors ${errors.join('; ')}`)
              if ([390,1440].includes(width)) await page.screenshot({ path: path.join(output, `${id}.png`), fullPage: true })
              if (width === 390) {
                await page.locator('.menu-toggle').click()
                await page.keyboard.press('Escape')
                verify(await page.locator('#mobile-navigation').isHidden(), `${id}: navigation Escape`)
                verify(await page.locator('.menu-toggle').evaluate(element => element === document.activeElement), `${id}: navigation focus restored`)
                await page.locator('.menu-toggle').click()
                await page.locator('#mobile-navigation a[href="#menu"]').click()
                await page.waitForFunction(() => document.activeElement?.id === 'menu')
                verify(await page.evaluate(() => location.hash === '#menu'), `${id}: anchor history`)
                await page.goBack()
                // Same-document Back restores focus/scroll asynchronously.
                // Let browser history restoration finish before keyboard input.
                await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))))
                verify(await page.evaluate(() => location.hash !== '#menu'), `${id}: Back`)
                for (let index = 0; index < 5; index++) {
                  const trigger = page.locator('.card-trigger').nth(index)
                  await trigger.focus()
                  await page.keyboard.press('Enter')
                  await page.waitForFunction(() => document.querySelector('dialog').open)
                  verify(await page.locator('#dish-title').textContent() === names[index], `${id}: correct dish dialog`)
                  await page.locator('.dialog-close').focus()
                  for (const key of ['Shift+Tab','Tab','Tab','Tab','Tab','Shift+Tab']) {
                    await page.keyboard.press(key)
                    const focus = await page.evaluate(focusState)
                    verify(focus.inDialog && focus.visible && focus.unobscured && focus.outlineWidth >= 3 && focus.outline !== 'none', `${id}: ${key} focus ${JSON.stringify(focus)}`)
                  }
                  await page.locator('dialog').evaluate(element => { element.scrollTop = element.scrollHeight })
                  verify(await page.locator('.dialog-close').evaluate(element => { const r=element.getBoundingClientRect(), d=element.closest('dialog').getBoundingClientRect(); return r.top>=d.top && r.bottom<=d.bottom }), `${id}: sticky close reachable`)
                  await page.keyboard.press('Escape')
                  await page.waitForFunction(() => !document.querySelector('dialog').open && !document.querySelector('#dish-title') && document.body.style.overflow !== 'hidden')
                  verify(await trigger.evaluate(element => element === document.activeElement), `${id}: dish focus restored`)
                }
                await page.locator('.card-trigger').first().click()
                await page.locator('.dialog-close').click()
                await page.waitForFunction(() => !document.querySelector('dialog').open && !document.querySelector('#dish-title') && document.body.style.overflow !== 'hidden')
                await page.locator('.card-trigger').first().click()
                await page.mouse.click(1,1)
                await page.waitForFunction(() => !document.querySelector('dialog').open && !document.querySelector('#dish-title') && document.body.style.overflow !== 'hidden')
                await page.locator('.mobile-actions').evaluate(element => { element.style.paddingBottom = '44px' })
                await page.waitForFunction(() => parseFloat(getComputedStyle(document.body).paddingBottom) >= document.querySelector('.mobile-actions').getBoundingClientRect().height - .5)
              }
              report.results.push({ id, ...info, errors })
            } catch (error) {
              report.failures.push(`${id}: ${error.stack || String(error)}`)
              await page.screenshot({ path: path.join(output, `${id}-failure.png`) }).catch(() => {})
            } finally {
              await save()
              await context.close()
            }
          }
        }
      }
      // A root-font test is NOT real browser zoom. A separate measured attempt is required.
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
      await restrictNetwork(context)
      const page = await context.newPage()
      await page.goto(`${origin}/ru`, { waitUntil: 'networkidle' })
      const before = await page.evaluate(() => ({ dpr: devicePixelRatio, width: innerWidth }))
      for (let index=0; index<5; index++) await page.keyboard.press('Control+=')
      const after = await page.evaluate(() => ({ dpr: devicePixelRatio, width: innerWidth }))
      if (Math.abs(after.dpr / before.dpr - 2) > .05 || Math.abs(after.width / before.width - .5) > .03) {
        report.open.push(`${engine}: REAL_200_PERCENT_ZOOM_NOT_CONFIRMED; root-font and device scale tests are not a substitute. ${JSON.stringify({ before, after })}`)
      } else {
        const info = await page.evaluate(inspect)
        verify(info.scrollWidth <= info.width + 1 && info.clipped.length === 0, `${engine}: real 200% zoom overflow`)
        report.results.push({ id: `${engine}-real-zoom-200`, before, after, ...info })
      }
      await context.close()
    } finally { await browser.close() }
  }
} catch (error) {
  report.failures.push(`Runner blocked or failed: ${String(error)}`)
} finally {
  report.open.push('Physical-device safe areas, manual screen reader, photo recognition/crop and real external service availability require separate observation. No order/message/call was submitted by this runner.')
  report.finishedAt = new Date().toISOString()
  await save()
  console.log(JSON.stringify({ cases: report.results.length, failures: report.failures, open: report.open }, null, 2))
  if (report.failures.length) process.exitCode = 1
}
