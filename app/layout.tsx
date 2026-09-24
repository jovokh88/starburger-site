import type {Metadata,Viewport} from 'next'
import {Analytics} from '@vercel/analytics/next'
import './globals.css'
const siteUrl=(process.env.NEXT_PUBLIC_SITE_URL||'https://starburger-site.vercel.app').replace(/\/$/,'')
export const metadata:Metadata={title:'Star Burger',description:'Star Burger в Джизаке — 24/7.',metadataBase:new URL(siteUrl),icons:{icon:'/images/logo.png',apple:'/images/logo.png'},openGraph:{images:[{url:'/images/hero.jpg',width:1200,height:630,alt:'Star Burger'}]},twitter:{card:'summary_large_image',images:['/images/hero.jpg']},robots:{index:true,follow:true}}
export const viewport:Viewport={themeColor:'#0d0e0c',width:'device-width',initialScale:1}
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="uz" className="bg-[#0d0e0c]"><body>{children}<Analytics/></body></html>}
