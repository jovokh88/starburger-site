import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { locales, type Locale } from '@/lib/site-data'
import '../globals.css'
import '../visual-refinements.css'
import '../restyle.css'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://starburger-site.vercel.app').replace(/\/$/, '')
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Star Burger',
  icons: { icon: '/images/logo.png', apple: '/images/logo.png' },
  robots: { index: true, follow: true },
  openGraph: { images: [{ url: '/images/star-burger.webp', width: 1440, height: 1440, alt: 'Star Burger' }] },
  twitter: { card: 'summary_large_image', images: ['/images/star-burger.webp'] }
}
export const viewport: Viewport = { themeColor: '#10120e', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

// Resolve the language on the server, before the browser receives the document.
export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const active = locales.includes(locale as Locale) ? locale : 'uz'
  return <html lang={active}><body>{children}<Analytics /></body></html>
}
