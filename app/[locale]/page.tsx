import type { Metadata } from 'next'
import HomePage from '@/components/home-page'
import { copy, locales, type Locale } from '@/lib/site-data'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const active = locales.includes(locale as Locale) ? locale as Locale : 'ru'
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://starburger-site.vercel.app').replace(/\/$/, '')
  return { title: copy[active].title, description: copy[active].description, metadataBase: new URL(siteUrl), alternates: { canonical: `${siteUrl}/${active}`, languages: { ru: `${siteUrl}/ru`, uz: `${siteUrl}/uz`, en: `${siteUrl}/en`, 'x-default': `${siteUrl}/ru` } }, openGraph: { title: copy[active].title, description: copy[active].description, type: 'website', locale: copy[active].lang, url: `${siteUrl}/${active}` } }
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <HomePage locale={locales.includes(locale as Locale) ? locale as Locale : 'ru'} />
}
