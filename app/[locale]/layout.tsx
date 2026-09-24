import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { locales, type Locale } from '@/lib/site-data'
import '../globals.css'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://starburger-site.vercel.app').replace(/\/$/, '')
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Star Burger',
  icons: { icon: '/images/logo.png', apple: '/images/logo.png' },
  robots: { index: true, follow: true },
  openGraph: { images: [{ url: '/images/food-burger.jpg', width: 1446, height: 2048, alt: 'Star Burger' }] },
  twitter: { card: 'summary_large_image', images: ['/images/food-burger.jpg'] }
}
export const viewport: Viewport = { themeColor: '#10120e', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

// Resolve the language on the server; do not repair the HTML language after hydration.
export default async function LocaleLayout({ children, params }: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const active = locales.includes(locale as Locale) ? locale : 'uz'
  return <html lang={active}><body>{children}<Analytics /></body></html>
}
