import type { Metadata } from 'next'
import HomePage from '@/components/home-page'
import { copy, locales, type Locale } from '@/lib/site-data'

export function generateStaticParams() { return locales.map((locale) => ({ locale })) }

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const active = locales.includes(locale as Locale) ? locale as Locale : 'ru'
  return { title: copy[active].title, description: copy[active].description, alternates: { canonical: `/${active}`, languages: { ru: '/ru', uz: '/uz', en: '/en', 'x-default': '/ru' } }, openGraph: { title: copy[active].title, description: copy[active].description, type: 'website', locale: copy[active].lang } }
}

export default async function LocalePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <HomePage locale={locales.includes(locale as Locale) ? locale as Locale : 'ru'} />
}
