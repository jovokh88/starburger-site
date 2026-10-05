'use client'

import Image from 'next/image'
import { ArrowRight, Clock3, ExternalLink, MapPin, Menu as MenuIcon, MessageCircle, Phone, Users, X } from 'lucide-react'
import { track } from '@vercel/analytics'
import { useEffect, useRef, useState } from 'react'
import { copy, menu, site, type Locale } from '@/lib/site-data'
import { atmosphereGallery } from '@/lib/atmosphere-gallery'
import { premiumUi } from '@/lib/premium-ui'

const external = { target: '_blank', rel: 'noopener noreferrer' as const }
type Dish = (typeof menu)[number]

export default function HomePage({ locale = 'uz' }: { locale?: Locale }) {
  const t = copy[locale]
  const ui = premiumUi[locale]
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Dish | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const menuButton = useRef<HTMLButtonElement>(null)
  const lastDishButton = useRef<HTMLButtonElement | null>(null)
  const header = useRef<HTMLElement>(null)
  const actionBar = useRef<HTMLElement>(null)

  // Reserve the actual toolbar height, including wrapped labels and safe areas.
  // Short/zoomed viewports use ordinary document flow instead of fixed bars.
  useEffect(() => {
    const root = document.documentElement
    const measure = () => {
      const head = header.current
      const bar = actionBar.current
      const inner = head?.querySelector('.nav-inner')
      const headerHeight = head && inner && getComputedStyle(head).position === 'sticky'
        ? inner.getBoundingClientRect().bottom - head.getBoundingClientRect().top : 0
      const barHeight = bar && getComputedStyle(bar).position === 'fixed'
        ? bar.getBoundingClientRect().height : 0
      root.style.setProperty('--site-header-height', `${Math.ceil(headerHeight)}px`)
      root.style.setProperty('--mobile-bar-height', `${Math.ceil(barHeight)}px`)
    }
    measure()
    const observer = new ResizeObserver(measure)
    if (header.current) observer.observe(header.current, { box: 'border-box' })
    if (actionBar.current) observer.observe(actionBar.current, { box: 'border-box' })
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      root.style.removeProperty('--site-header-height')
      root.style.removeProperty('--mobile-bar-height')
    }
  }, [])

  function navigateToSection(href: string) {
    setOpen(false)
    // Keep native anchor history/Back; move focus out of the closing navigation.
    requestAnimationFrame(() => document.getElementById(href.slice(1))?.focus({ preventScroll: true }))
  }

  // Analytics failure must never interrupt an order, phone call, or navigation.
  function record(name: string, extra: Record<string, string> = {}) {
    try { track(name, { locale, ...extra }) } catch { /* Navigation remains available. */ }
  }

  useEffect(() => {
    if (!open) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); menuButton.current?.focus() }
    }
    const desktop = window.matchMedia('(min-width: 1000px)')
    const closeOnDesktop = () => { if (desktop.matches) setOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    desktop.addEventListener('change', closeOnDesktop)
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      desktop.removeEventListener('change', closeOnDesktop)
    }
  }, [open])

  useEffect(() => {
    if (!selected || !dialog.current) return
    const element = dialog.current
    const previousOverflow = document.body.style.overflow
    element.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      if (element.open) element.close()
      document.body.style.overflow = previousOverflow
    }
  }, [selected])

  const schema = {
    '@context': 'https://schema.org', '@type': 'Restaurant', name: 'Star Burger',
    image: `${site.siteUrl}/images/star-burger.webp`, url: `${site.siteUrl}/${locale}`,
    address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: 'Jizzax', addressCountry: 'UZ' },
    telephone: site.tel.replace('tel:', ''), openingHours: 'Mo-Su 00:00-24:00',
    servesCuisine: ['Burgers', 'Pizza', 'Turkish', 'Grill'],
    sameAs: [site.googleMaps, site.yandexMaps, site.telegram, site.instagram]
  }
  const navigation = [['#menu', ui.dishes], ['#story', t.about], ['#reviews', t.reviews], ['#contact', t.contact]]

  return <>
    <a className="skip-link" href="#main-content">{ui.skip}</a>
    <header ref={header} className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Star Burger">
          <Image src="/images/logo.png" alt="" width={44} height={44} className="logo" />
          <span>STAR BURGER</span>
        </a>
        <nav className="desktop-nav" aria-label={ui.navigation}>
          {navigation.map(([href, label]) => <a key={href} href={href} onClick={() => navigateToSection(href)}>{label}</a>)}
        </nav>
        <div className="nav-controls">
          <nav className="langs" aria-label={t.language}>
            {(['uz', 'ru', 'en'] as Locale[]).map(language => <a key={language} href={`/${language}`} lang={language} hrefLang={language} aria-current={language === locale ? 'page' : undefined}>{language.toUpperCase()}</a>)}
          </nav>
          <button ref={menuButton} type="button" className="menu-toggle" aria-label={open ? ui.closeNavigation : ui.openNavigation} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X aria-hidden /> : <MenuIcon aria-hidden />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile" hidden={!open} aria-label={ui.navigation}>
        <a className="nav-full-menu" href={site.menuUrl} {...external} onClick={() => record('full_menu_click', { placement: 'navigation' })}>{ui.fullMenu}<ExternalLink size={18} aria-hidden /></a>
        {navigation.map(([href, label]) => <a key={href} href={href} onClick={() => navigateToSection(href)}>{label}<ArrowRight size={18} aria-hidden /></a>)}
        <a href={site.tel} onClick={() => record('phone_click', { placement: 'navigation' })}>{site.phone}<Phone size={18} aria-hidden /></a>
      </nav>
    </header>

    <main id="main-content" className="shell" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <section id="top" tabIndex={-1} className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" aria-hidden />{t.city}</p>
            <h1 id="hero-title"><span>{t.hero[0]}</span>{' '}<em>{t.hero[1]}</em>{' '}<span>{t.hero[2]}</span></h1>
            <p className="lead">{t.intro}</p>
            <div className="actions">
              <a href={site.menuUrl} {...external} onClick={() => record('menu_open', { placement: 'hero' })} className="primary">{ui.fullMenu}<ArrowRight size={18} aria-hidden /></a>
              <a href={site.telegram} {...external} onClick={() => record('telegram_contact_click', { placement: 'hero' })} className="ghost">{ui.telegramContact}<MessageCircle size={18} aria-hidden /></a>
            </div>
            <p className="hero-hint">{ui.heroHint}</p>
          </div>
          <div className="hero-art">
            <div className="hero-photo"><Image src="/images/brand-interior.webp" alt={ui.brandAlt} fill preload sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 899px) 560px, (max-width: 1328px) calc((100vw - 96px) / 2), 616px" className="hero-img" /></div>
          </div>
        </div>
      </section>

      <section id="menu" tabIndex={-1} className="paper section" aria-labelledby="menu-title">
        <div className="wrap">
          <div className="heading"><div><p className="eyebrow ink">{t.kitchen}</p><h2 id="menu-title">{t.hits}</h2></div><a href={site.menuUrl} {...external} onClick={() => record('full_menu_click')} className="text-link">{ui.fullMenu}<ArrowRight size={18} aria-hidden /></a></div>
          <div className="cards">{menu.map(dish => <article key={dish.name} className="card">
            <button type="button" className="card-trigger" aria-haspopup="dialog" aria-label={`${ui.details}: ${dish.name}, ${dish.price} UZS`} onClick={event => { setOpen(false); lastDishButton.current = event.currentTarget; setSelected(dish); record('dish_view', { dish: dish.name }) }}>
              <div className="photo"><Image src={dish.image} alt={dish.name} fill sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 999px) calc((100vw - 72px) / 2), (max-width: 1328px) calc((100vw - 72px) / 2), 628px" className="object-cover" /></div>
              <div className="card-copy"><h3>{dish.name}</h3><div className="card-bottom"><strong>{dish.price}<small> UZS</small></strong><span>{ui.details}<ArrowRight size={16} aria-hidden /></span></div></div>
            </button>
          </article>)}</div>
          <p className="menu-note">{ui.menuNote} <a href={site.menuUrl} {...external} onClick={() => record('full_menu_click', { placement: 'note' })}>QRCHA <ExternalLink size={12} aria-hidden /></a></p>
        </div>
      </section>

      <section id="story" tabIndex={-1} className="story" aria-labelledby="story-title"><div className="wrap story-grid"><div><p className="eyebrow">{t.about}</p><h2 id="story-title">{t.always}</h2><p className="story-lead">{t.experienceText}</p></div><div className="features">
        <div><Clock3 aria-hidden /><span className="feature-number" aria-hidden>01</span><h3>24/7</h3><p>{t.open}</p></div>
        <div><Users aria-hidden /><span className="feature-number" aria-hidden>02</span><h3>{t.private}</h3><p>{t.privateText}</p></div>
        <div><MessageCircle aria-hidden /><span className="feature-number" aria-hidden>03</span><h3>{t.football}</h3><p>{t.footballText}</p></div>
      </div></div></section>

      <section className="paper section" aria-labelledby="gallery-title"><div className="wrap"><p className="eyebrow ink">{t.atmosphereLabel}</p><h2 id="gallery-title">{t.atmosphere}</h2><div className="gallery">{atmosphereGallery.map((image, index) => <figure key={image.alt.en} className={`g g${index + 1}`}><div className="gallery-photo"><Image src={image.src} alt={image.alt[locale]} fill placeholder={typeof image.src === 'string' ? 'empty' : 'blur'} loading="lazy" sizes={index === 0 || index === 3 || index === 4
        ? 'auto, (max-width: 359px) calc(100vw - 32px), (max-width: 639px) calc(100vw - 32px), (max-width: 999px) calc((100vw - 64px) / 2), (max-width: 1328px) calc(66.667vw - 37.333px), 848px'
        : 'auto, (max-width: 359px) calc(100vw - 32px), (max-width: 639px) calc(100vw - 32px), (max-width: 999px) calc((100vw - 64px) / 2), (max-width: 1328px) calc(33.333vw - 26.667px), 416px'} className="object-cover" /></div><figcaption>{image.alt[locale]}</figcaption></figure>)}</div></div></section>

      <section id="reviews" tabIndex={-1} className="reviews" aria-labelledby="reviews-title"><div className="wrap review-grid"><div><p className="eyebrow">{t.reviewsLabel}</p><h2 id="reviews-title">{ui.reviewTitle}</h2></div><div><p>{ui.reviewText}</p><div className="actions"><a href={site.googleReviews} {...external} onClick={() => record('google_reviews_click')} className="outline">Google<ExternalLink size={16} aria-hidden /></a><a href={site.yandexReviews} {...external} onClick={() => record('yandex_reviews_click')} className="outline">Yandex<ExternalLink size={16} aria-hidden /></a></div></div></div></section>

      <section id="contact" tabIndex={-1} className="paper contact" aria-labelledby="contact-title"><div className="wrap contact-grid"><div className="contact-copy"><p className="eyebrow ink">{t.findLabel}</p><h2 id="contact-title">{t.find}</h2><address className="contact-list"><p><MapPin aria-hidden />{t.address}</p><p><Clock3 aria-hidden />{t.open}</p><a href={site.tel} onClick={() => record('phone_click', { placement: 'contact' })}><Phone aria-hidden />{site.phone}</a></address><div className="actions"><a href={site.mapSearch} {...external} onClick={() => record('directions_click')} className="dark">{t.route}<ArrowRight size={18} aria-hidden /></a><a href={site.instagram} {...external} onClick={() => record('instagram_click')} className="light">Instagram<ExternalLink size={16} aria-hidden /></a></div></div><div className="contact-photo"><Image src="/images/atm-facade.jpg" alt={t.facadeAlt} fill sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 899px) calc(100vw - 48px), (max-width: 1328px) calc((100vw - 96px) / 2), 616px" className="object-cover" /></div></div></section>
    </main>
    <footer><div className="wrap foot"><span>STAR BURGER</span><small>© 2026 · {locale === 'en' ? 'Jizzakh' : locale === 'ru' ? 'Джизак' : 'Jizzax'} · 24/7</small><a href={site.tel} onClick={() => record('phone_click', { placement: 'footer' })}>{site.phone}</a></div></footer>
    <nav ref={actionBar} className="mobile-actions" aria-label={ui.quickActions}><a href={site.menuUrl} {...external} onClick={() => record('mobile_menu_click')}>{ui.fullMenu}</a><a href={site.telegram} {...external} aria-label={ui.telegramContact} onClick={() => record('telegram_contact_click')}>Telegram</a><a href={site.tel} aria-label={ui.call} onClick={() => record('phone_click', { placement: 'mobile' })}><Phone size={20} aria-hidden /></a></nav>
    <dialog ref={dialog} className="dish-dialog photo-viewer" aria-labelledby="dish-title" onKeyDown={event => {
      if (event.key !== 'Tab') return
      const controls = Array.from(event.currentTarget.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')).filter(element => element.getClientRects().length > 0)
      const first = controls[0]
      const last = controls[controls.length - 1]
      if (!first || !last) return
      // WebKit can skip links in its default keyboard mode. Cycle the visible
      // controls explicitly so both directions stay inside the native dialog.
      event.preventDefault()
      const index = controls.indexOf(document.activeElement as HTMLElement)
      const next = controls[(index + (event.shiftKey ? -1 : 1) + controls.length) % controls.length]
      next.focus()
      next.scrollIntoView({ block: 'nearest' })
    }} onClose={() => { setSelected(null); if (lastDishButton.current?.isConnected) lastDishButton.current.focus() }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close() } }}>
      {selected && <><div className="dialog-toolbar"><h2 id="dish-title">{selected.name}</h2><button type="button" className="dialog-close" aria-label={ui.close} onClick={() => dialog.current?.close()}><X aria-hidden /></button></div><div className="dialog-photo"><Image src={selected.image} alt={selected.name} fill sizes="(max-width: 823px) calc(100vw - 24px), 800px" className="object-cover" /></div></>}
    </dialog>
  </>
}
