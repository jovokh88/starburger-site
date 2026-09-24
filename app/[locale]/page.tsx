import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import HomePage from '@/components/home-page'
import { copy, locales, type Locale } from '@/lib/site-data'

export const dynamicParams = false
export function generateStaticParams() { return locales.map(locale => ({ locale })) }
function supportedLocale(value: string): Locale {
  if (!locales.includes(value as Locale)) notFound()
  return value as Locale
}
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const active = supportedLocale((await params).locale)
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://starburger-site.vercel.app').replace(/\/$/, '')
  const image = { url: '/images/food-burger.jpg', width: 1446, height: 2048, alt: 'Star Burger' }
  return {
    title: copy[active].title, description: copy[active].description,
    alternates: { canonical: `${siteUrl}/${active}`, languages: { uz: `${siteUrl}/uz`, ru: `${siteUrl}/ru`, en: `${siteUrl}/en`, 'x-default': `${siteUrl}/uz` } },
    openGraph: { title: copy[active].title, description: copy[active].description, type: 'website', locale: { uz: 'uz_UZ', ru: 'ru_RU', en: 'en_US' }[active], url: `${siteUrl}/${active}`, images: [image] },
    twitter: { card: 'summary_large_image', title: copy[active].title, description: copy[active].description, images: [image.url] }
  }
}
export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  return <HomePage locale={supportedLocale((await params).locale)} />
}
