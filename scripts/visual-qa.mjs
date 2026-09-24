import { createRequire } from 'node:module'
import fs from 'node:fs/promises'

if (!process.env.QA_TOOLS_DIR) throw new Error('QA_TOOLS_DIR is required: keep test dependencies isolated')
const require = createRequire(`${process.env.QA_TOOLS_DIR}/package.json`)
const { chromium, webkit } = require('playwright')
const origin = 'http://127.0.0.1:3000'
const results = []
const failures = []
const verify = (condition, message) => { if (!condition) failures.push(message) }
const save = async () => fs.writeFile('qa-report/report.json', JSON.stringify({ results, failures }, null, 2))
await fs.mkdir('qa-report', { recursive: true })

const root = await fetch(origin, { redirect: 'manual' })
verify([307, 308].includes(root.status) && root.headers.get('location') === '/uz', 'Root must redirect to /uz')
verify((await fetch(`${origin}/invalid-locale`)).status === 404, 'Unknown locale must return 404')

async function restrictNetwork(page) {
  await page.route('**/*', route => {
    const url = new URL(route.request().url())
    return url.hostname === '127.0.0.1' && !url.pathname.startsWith('/_vercel/') ? route.continue() : route.abort()
  })
}

for (const [engine, launch] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await launch.launch()
  try {
    for (const locale of ['uz', 'ru', 'en']) {
      const response = await fetch(`${origin}/${locale}`)
      const html = await response.text()
      const serverLang = (html.match(/<html[^>]*lang="([^"]+)"/) || [])[1]
      verify(response.status === 200, `${locale}: HTTP 200`)
      verify(serverLang === locale, `${locale}: server HTML language is ${serverLang}`)
      await fs.writeFile(`qa-report/${locale}.html`, html)
      for (const width of engine === 'chromium' ? [320, 375, 390, 768, 1024, 1440] : [390]) {
        const id = `${engine}/${locale}/${width}`
        const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce', ...(engine === 'webkit' ? { isMobile: true, hasTouch: true } : {}) })
        const page = await context.newPage()
        const errors = []
        const networkFailures = []
        page.on('pageerror', error => errors.push(String(error)))
        page.on('requestfailed', request => {
          if (request.url().includes('/_next/image')) networkFailures.push({ url: request.url(), error: request.failure() })
        })
        try {
          await restrictNetwork(page)
          await page.goto(`${origin}/${locale}`, { waitUntil: 'networkidle' })
          if ([390, 1440].includes(width)) await page.screenshot({ path: `qa-report/${engine}-${locale}-${width}-hero.png` })
          // Scroll each real lazy-loaded image into the viewport, as a user would.
          const images = page.locator('main img')
          for (let index = 0; index < await images.count(); index++) {
            const image = images.nth(index)
            await image.scrollIntoViewIfNeeded()
            await image.evaluate(async element => {
              if (!element.complete) await Promise.race([
                new Promise(resolve => { element.addEventListener('load', resolve, { once: true }); element.addEventListener('error', resolve, { once: true }) }),
                new Promise(resolve => setTimeout(resolve, 7000))
              ])
            })
          }
          await page.evaluate(() => window.scrollTo(0, 0))
          const info = await page.evaluate(() => ({
            width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
            lang: document.documentElement.lang,
            mobilePanelDisplay: getComputedStyle(document.querySelector('.mobile-actions')).display,
            imageMissing: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => ({ src: image.src, loading: image.loading, complete: image.complete })),
            clipped: [...document.querySelectorAll('h1,h2,h3,.brand,.langs,.card-copy,.nav button')].filter(element => element.getBoundingClientRect().width > 0).map(element => ({ text: element.textContent, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: element.clientWidth, scroll: element.scrollWidth })).filter(element => element.right > innerWidth + 1 || element.left < -1 || element.scroll > element.width + 1),
            gallery: [...document.querySelectorAll('.g')].map(element => ({ height: element.getBoundingClientRect().height, width: element.getBoundingClientRect().width })),
            reducedMotionAnimations: document.getAnimations().length
          }))
          verify(info.scrollWidth <= width + 1, `${id}: page overflow`)
          verify(info.clipped.length === 0, `${id}: clipped content ${JSON.stringify(info.clipped)}`)
          verify(info.gallery.length === 6 && info.gallery.every(image => image.height > 100), `${id}: hidden gallery images`)
          verify(info.imageMissing.length === 0, `${id}: missing images ${JSON.stringify(info.imageMissing)}`)
          verify(width < 768 ? info.mobilePanelDisplay !== 'none' : info.mobilePanelDisplay === 'none', `${id}: incorrect mobile toolbar visibility`)
          verify(info.reducedMotionAnimations === 0, `${id}: reduced motion not respected`)
          if ([390, 1440].includes(width)) await page.screenshot({ path: `qa-report/${engine}-${locale}-${width}-full.jpg`, fullPage: true, type: 'jpeg', quality: 82 })
          if (width === 390) {
            await page.evaluate(() => window.scrollTo(0, 0))
            await page.locator('.menu-toggle').click()
            verify(await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'true', `${id}: mobile navigation opens`)
            await page.keyboard.press('Escape')
            verify(await page.locator('#mobile-navigation').isHidden(), `${id}: navigation closes with Escape`)
            await page.locator('.card-trigger').first().click()
            await page.waitForFunction(() => document.querySelector('dialog')?.open, undefined, { timeout: 10000 })
            verify(await page.locator('#dish-title').innerText() === 'Star Burger', `${id}: correct dish details`)
            await page.screenshot({ path: `qa-report/${engine}-${locale}-dish.png` })
            await page.keyboard.press('Escape')
            await page.waitForFunction(() => !document.querySelector('dialog')?.open, undefined, { timeout: 10000 })
            verify(await page.locator('.card-trigger').first().evaluate(element => element === document.activeElement), `${id}: dialog focus returns`)
          }
          verify(errors.length === 0, `${id}: ${errors.join('; ')}`)
          results.push({ engine, locale, width, serverLang, ...info, errors, networkFailures })
        } catch (error) {
          failures.push(`${id}: ${String(error)}`)
          results.push({ engine, locale, width, serverLang, errors, networkFailures, testError: String(error) })
          await page.screenshot({ path: `qa-report/${engine}-${locale}-${width}-failure.png` }).catch(() => {})
        } finally {
          await save()
          await context.close()
        }
      }
    }
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
    const page = await context.newPage()
    await restrictNetwork(page)
    await page.goto(`${origin}/uz`)
    const excessiveMotion = await page.evaluate(() => document.getAnimations().some(animation => {
      const timing = animation.effect?.getTiming()
      return timing && (timing.iterations === Infinity || Number(timing.duration) > 5000)
    }))
    verify(!excessiveMotion, `${engine}: uncontrolled continuous motion`)
    await context.close()
  } finally {
    await browser.close()
    await save()
  }
}
console.log(JSON.stringify({ cases: results.length, failures }, null, 2))
if (failures.length) process.exitCode = 1
