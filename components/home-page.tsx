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
    image: `${site.siteUrl}/images/food-burger.jpg`, url: `${site.siteUrl}/${locale}`,
    address: { '@type': 'PostalAddress', streetAddress: site.address, addressLocality: 'Jizzax', addressCountry: 'UZ' },
    telephone: site.tel.replace('tel:', ''), openingHours: 'Mo-Su 00:00-24:00',
    servesCuisine: ['Burgers', 'Pizza', 'Turkish', 'Grill'],
    sameAs: [site.googleMaps, site.yandexMaps, site.telegram, site.instagram]
  }
  const navigation = [['#menu', t.menu], ['#story', t.about], ['#reviews', t.reviews], ['#contact', t.contact]]

  return <>
    <a className="skip-link" href="#main-content">{ui.skip}</a>
    <header className="nav">
      <div className="wrap nav-inner">
        <a href="#top" className="brand" aria-label="Star Burger">
          <Image src="/images/logo.png" alt="" width={44} height={44} className="logo" />
          <span>STAR BURGER</span>
        </a>
        <nav className="desktop-nav" aria-label={ui.navigation}>
          {navigation.map(([href, label]) => <a key={href} href={href}>{label}</a>)}
        </nav>
        <div className="nav-controls">
          <nav className="langs" aria-label={t.language}>
            {(['uz', 'ru', 'en'] as Locale[]).map(language => <a key={language} href={`/${language}`} lang={language} hrefLang={language} aria-current={language === locale ? 'page' : undefined}>{language.toUpperCase()}</a>)}
          </nav>
          <button ref={menuButton} type="button" className="menu-toggle" aria-label={open ? t.closeMenu : t.openMenu} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <X aria-hidden /> : <MenuIcon aria-hidden />}</button>
        </div>
      </div>
      <nav id="mobile-navigation" className="mobile" hidden={!open} aria-label={ui.navigation}>
        {navigation.map(([href, label]) => <a key={href} href={href} onClick={() => setOpen(false)}>{label}<ArrowRight size={18} aria-hidden /></a>)}
        <a href={site.tel} onClick={() => record('phone_click', { placement: 'navigation' })}>{site.phone}<Phone size={18} aria-hidden /></a>
      </nav>
    </header>

    <main id="main-content" className="shell" tabIndex={-1}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />
      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="wrap hero-inner">
          <div className="hero-copy">
            <p className="eyebrow"><span className="status-dot" aria-hidden />{t.city}</p>
            <h1 id="hero-title"><span>{t.hero[0]}</span><span><em>{t.hero[1]}</em></span><span>{t.hero[2]}</span></h1>
            <p className="lead">{t.intro}</p>
            <div className="actions">
              <a href={site.menuUrl} {...external} onClick={() => record('menu_open', { placement: 'hero' })} className="primary">{t.viewMenu}<ArrowRight size={18} aria-hidden /></a>
              <a href={site.telegramOrderBot} {...external} onClick={() => record('telegram_order_click', { placement: 'hero' })} className="ghost">{t.order}<MessageCircle size={18} aria-hidden /></a>
            </div>
          </div>
          <figure className="hero-art">
            <div className="hero-photo"><Image src="/images/food-burger.jpg" alt={ui.burgerAlt} fill priority sizes="(max-width: 899px) calc(100vw - 32px), 48vw" className="hero-img" /></div>
            <figcaption className="hero-caption"><span>STAR BURGER</span><span>JIZZAX / 24:7</span></figcaption>
          </figure>
        </div>
        <div className="category-strip" aria-label={t.menu}><div className="wrap">{t.categories.map(category => <span key={category}>{category}</span>)}</div></div>
      </section>

      <section id="menu" className="paper section" aria-labelledby="menu-title">
        <div className="wrap">
          <div className="heading"><div><p className="eyebrow ink">{t.kitchen}</p><h2 id="menu-title">{t.hits}</h2></div><a href={site.menuUrl} {...external} onClick={() => record('full_menu_click')} className="text-link">{t.fullMenu}<ArrowRight size={18} aria-hidden /></a></div>
          <div className="cards">{menu.map((dish, index) => <article key={dish.name} className="card">
            <button type="button" className="card-trigger" aria-haspopup="dialog" aria-label={`${ui.details}: ${dish.name}`} onClick={event => { lastDishButton.current = event.currentTarget; setSelected(dish); record('dish_view', { dish: dish.name }) }}>
              <div className="photo"><Image src={dish.image} alt={dish.name} fill sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 999px) 46vw, 31vw" className="object-cover" /><span className="card-index" aria-hidden>0{index + 1}</span></div>
              <div className="card-copy"><h3>{dish.name}</h3><p>{dish.desc[locale]}</p><div className="card-bottom"><strong>{dish.price}<small> UZS</small></strong><span>{ui.details}<ArrowRight size={16} aria-hidden /></span></div></div>
            </button>
          </article>)}</div>
          <p className="menu-note">{ui.menuNote} <a href={site.menuUrl} {...external} onClick={() => record('full_menu_click', { placement: 'note' })}>QRCHA <ExternalLink size={12} aria-hidden /></a></p>
        </div>
      </section>

      <section id="story" className="story" aria-labelledby="story-title"><div className="wrap story-grid"><div><p className="eyebrow">{t.about}</p><h2 id="story-title">{t.always}</h2><p className="story-lead">{t.experienceText}</p></div><div className="features">
        <div><Clock3 aria-hidden /><span className="feature-number" aria-hidden>01</span><h3>24/7</h3><p>{t.open}</p></div>
        <div><Users aria-hidden /><span className="feature-number" aria-hidden>02</span><h3>{t.private}</h3><p>{t.privateText}</p></div>
        <div><MessageCircle aria-hidden /><span className="feature-number" aria-hidden>03</span><h3>{t.football}</h3><p>{t.footballText}</p></div>
      </div></div></section>

      <section className="paper section" aria-labelledby="gallery-title"><div className="wrap"><p className="eyebrow ink">{t.atmosphereLabel}</p><h2 id="gallery-title">{t.atmosphere}</h2><div className="gallery">{atmosphereGallery.map((image, index) => <figure key={image.alt.en} className={`g g${index + 1}`}><Image src={image.src} alt={image.alt[locale]} fill placeholder={typeof image.src === 'string' ? 'empty' : 'blur'} loading="lazy" sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 999px) 46vw, 48vw" className="object-cover" /><figcaption>{image.alt[locale]}</figcaption></figure>)}</div></div></section>

      <section id="reviews" className="reviews" aria-labelledby="reviews-title"><div className="wrap review-grid"><div><p className="eyebrow">{t.reviewsLabel}</p><h2 id="reviews-title">{ui.reviewTitle}</h2></div><div><p>{ui.reviewText}</p><div className="actions"><a href={site.googleReviews} {...external} onClick={() => record('google_reviews_click')} className="outline">Google<ExternalLink size={16} aria-hidden /></a><a href={site.yandexReviews} {...external} onClick={() => record('yandex_reviews_click')} className="outline">Yandex<ExternalLink size={16} aria-hidden /></a></div></div></div></section>

      <section id="contact" className="paper contact" aria-labelledby="contact-title"><div className="wrap contact-grid"><div className="contact-copy"><p className="eyebrow ink">{t.findLabel}</p><h2 id="contact-title">{t.find}</h2><address className="contact-list"><p><MapPin aria-hidden />{t.address}</p><p><Clock3 aria-hidden />{t.open}</p><a href={site.tel} onClick={() => record('phone_click', { placement: 'contact' })}><Phone aria-hidden />{site.phone}</a></address><div className="actions"><a href={site.mapSearch} {...external} onClick={() => record('directions_click')} className="dark">{t.route}<ArrowRight size={18} aria-hidden /></a><a href={site.instagram} {...external} onClick={() => record('instagram_click')} className="light">Instagram<ExternalLink size={16} aria-hidden /></a></div></div><div className="contact-photo"><Image src="/images/atm-facade.jpg" alt={t.facadeAlt} fill sizes="(max-width: 899px) calc(100vw - 32px), 48vw" className="object-cover" /></div></div></section>
    </main>
    <footer><div className="wrap foot"><span>STAR BURGER</span><small>© 2026 · Jizzax · 24/7</small><a href={site.tel} onClick={() => record('phone_click', { placement: 'footer' })}>{site.phone}</a></div></footer>
    <nav className="mobile-actions" aria-label={ui.quickActions}><a href={site.menuUrl} {...external} onClick={() => record('mobile_menu_click')}>{t.menu}</a><a href={site.telegramOrderBot} {...external} onClick={() => record('mobile_order_click')}>{t.orderBot}</a><a href={site.tel} aria-label={ui.call} onClick={() => record('phone_click', { placement: 'mobile' })}><Phone size={20} aria-hidden /></a></nav>
    <dialog ref={dialog} className="dish-dialog" aria-labelledby="dish-title" aria-describedby="dish-description" onClose={() => { setSelected(null); if (lastDishButton.current?.isConnected) lastDishButton.current.focus() }} onClick={event => { if (event.target === event.currentTarget) { const box = event.currentTarget.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) event.currentTarget.close() } }}>
      {selected && <><button type="button" className="dialog-close" aria-label={ui.close} onClick={() => dialog.current?.close()}><X aria-hidden /></button><div className="dialog-photo"><Image src={selected.image} alt={selected.name} fill sizes="(max-width: 699px) 94vw, 420px" className="object-cover" /></div><div className="dialog-copy"><p className="eyebrow ink">STAR BURGER</p><h2 id="dish-title">{selected.name}</h2><p id="dish-description">{selected.desc[locale]}</p><p className="dialog-price">{selected.price} <small>UZS</small></p><p className="dialog-note">{ui.dialogNote}</p><a href={site.telegramOrderBot} {...external} className="dark" onClick={() => record('telegram_order_click', { placement: 'dish', dish: selected.name })}>{t.order}<ArrowRight size={18} aria-hidden /></a><a href={site.menuUrl} {...external} className="text-link" onClick={() => record('full_menu_click', { placement: 'dish' })}>{t.fullMenu}<ExternalLink size={15} aria-hidden /></a></div></>}
    </dialog>
  </>
}
