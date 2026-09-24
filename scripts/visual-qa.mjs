import { chromium, webkit } from 'playwright'
import fs from 'node:fs/promises'

const origin = 'http://127.0.0.1:3000'
const results = []
const failures = []
const verify = (condition, message) => { if (!condition) failures.push(message) }
await fs.mkdir('qa-report', { recursive: true })
const root = await fetch(origin, { redirect: 'manual' })
verify([307, 308].includes(root.status) && root.headers.get('location') === '/uz', 'Root must redirect to /uz')
verify((await fetch(`${origin}/invalid-locale`)).status === 404, 'Unknown locale must return 404')

for (const [engine, launch] of [['chromium', chromium], ['webkit', webkit]]) {
  const browser = await launch.launch()
  for (const locale of ['uz', 'ru', 'en']) {
    const response = await fetch(`${origin}/${locale}`)
    const html = await response.text()
    const serverLang = (html.match(/<html[^>]*lang="([^"]+)"/) || [])[1]
    verify(response.status === 200, `${locale}: HTTP 200`)
    verify(serverLang === locale, `${locale}: server HTML language is ${serverLang}`)
    await fs.writeFile(`qa-report/${locale}.html`, html)
    for (const width of engine === 'chromium' ? [320, 375, 390, 768, 1024, 1440] : [390]) {
      const context = await browser.newContext({ viewport: { width, height: width < 768 ? 844 : 900 }, reducedMotion: 'reduce', ...(engine === 'webkit' ? { isMobile: true, hasTouch: true } : {}) })
      const page = await context.newPage()
      const errors = []
      page.on('pageerror', error => errors.push(String(error)))
      // Do not send test clicks, visits, or telemetry to external systems.
      await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' && !route.request().url().includes('/_vercel/') ? route.continue() : route.abort())
      await page.goto(`${origin}/${locale}`, { waitUntil: 'networkidle' })
      if ([390, 1440].includes(width)) {
        await page.screenshot({ path: `qa-report/${engine}-${locale}-${width}-hero.png` })
      }
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 650) {
          window.scrollTo(0, y)
          await new Promise(resolve => setTimeout(resolve, 90))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForFunction(() => [...document.images].every(image => image.complete), { timeout: 20000 })
      const info = await page.evaluate(() => ({
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
        lang: document.documentElement.lang,
        mobilePanelDisplay: getComputedStyle(document.querySelector('.mobile-actions')).display,
        imageMissing: [...document.images].filter(image => !image.naturalWidth).map(image => image.src),
        clipped: [...document.querySelectorAll('h1,h2,h3,.brand,.langs,.card-copy,.nav button')].map(element => ({ text: element.textContent, left: element.getBoundingClientRect().left, right: element.getBoundingClientRect().right, width: element.clientWidth, scroll: element.scrollWidth })).filter(element => element.right > innerWidth + 1 || element.left < -1 || element.scroll > element.width + 1),
        gallery: [...document.querySelectorAll('.g')].map(element => ({ height: element.getBoundingClientRect().height, width: element.getBoundingClientRect().width })),
        reducedMotionAnimations: document.getAnimations().length
      }))
      verify(info.scrollWidth <= width + 1, `${engine}/${locale}/${width}: page overflow`)
      verify(info.clipped.length === 0, `${engine}/${locale}/${width}: clipped content ${JSON.stringify(info.clipped)}`)
      verify(info.gallery.length === 6 && info.gallery.every(image => image.height > 100), `${engine}/${locale}/${width}: hidden gallery images`)
      verify(info.imageMissing.length === 0, `${engine}/${locale}/${width}: missing images`)
      verify(width < 768 ? info.mobilePanelDisplay !== 'none' : info.mobilePanelDisplay === 'none', `${engine}/${locale}/${width}: incorrect mobile toolbar visibility`)
      verify(info.reducedMotionAnimations === 0, `${engine}/${locale}/${width}: reduced motion not respected`)
      if ([390, 1440].includes(width)) {
        await page.screenshot({ path: `qa-report/${engine}-${locale}-${width}-full.jpg`, fullPage: true, type: 'jpeg', quality: 82 })
      }
      if (width === 390) {
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.locator('.menu-toggle').click()
        verify(await page.locator('.menu-toggle').getAttribute('aria-expanded') === 'true', `${engine}/${locale}: mobile nav opens`)
        await page.keyboard.press('Escape')
        verify(await page.locator('#mobile-navigation').isHidden(), `${engine}/${locale}: mobile nav closes with Escape`)
        await page.locator('.card-trigger').first().click()
        await page.waitForFunction(() => document.querySelector('dialog')?.open)
        verify(await page.locator('#dish-title').innerText() === 'Star Burger', `${engine}/${locale}: correct dish details`)
        await page.screenshot({ path: `qa-report/${engine}-${locale}-dish.png` })
        await page.keyboard.press('Escape')
        await page.waitForFunction(() => !document.querySelector('dialog')?.open)
        verify(await page.locator('.card-trigger').first().evaluate(element => element === document.activeElement), `${engine}/${locale}: dialog focus returns`)
      }
      verify(errors.length === 0, `${engine}/${locale}/${width}: ${errors.join('; ')}`)
      results.push({ engine, locale, width, serverLang, ...info, errors })
      await context.close()
    }
  }
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'no-preference' })
  const page = await context.newPage()
  await page.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' && !route.request().url().includes('/_vercel/') ? route.continue() : route.abort())
  await page.goto(`${origin}/uz`)
  const excessiveMotion = await page.evaluate(() => document.getAnimations().some(animation => {
    const timing = animation.effect?.getTiming()
    return timing && (timing.iterations === Infinity || Number(timing.duration) > 5000)
  }))
  verify(!excessiveMotion, `${engine}: uncontrolled continuous motion`)
  await context.close()
  await browser.close()
}
await fs.writeFile('qa-report/report.json', JSON.stringify({ results, failures }, null, 2))
console.log(JSON.stringify({ results, failures }, null, 2))
if (failures.length) process.exitCode = 1
