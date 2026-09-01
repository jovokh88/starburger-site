import type { Metadata, Viewport } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://starburger-site.vercel.app').replace(/\/$/, '')

export const metadata: Metadata = { title: 'Star Burger', description: 'Star Burger в Джизаке — бургеры, пицца, лаваш и гриль 24/7.', metadataBase: new URL(siteUrl), icons: { icon: '/images/logo.png', apple: '/images/logo.png' }, twitter: { card: 'summary_large_image' }, robots: { index: true, follow: true } }
export const viewport: Viewport = { themeColor: '#111110', width: 'device-width', initialScale: 1 }
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="ru" className="bg-[#111110]"><body>{children}<Analytics /></body></html> }
