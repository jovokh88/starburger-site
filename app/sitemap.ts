import type { MetadataRoute } from 'next'
export default function sitemap(): MetadataRoute.Sitemap { const base = 'https://starburger-site.vercel.app'; return ['ru','uz','en'].map((locale) => ({ url: `${base}/${locale}`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.9 })) }
