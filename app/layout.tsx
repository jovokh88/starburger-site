import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata={title:'Star Burger — вкус, который не отпускает',description:'Star Burger в Джизаке — бургеры, пицца, лаваш и гриль 24/7.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" className="bg-[#111110]"><body>{children}</body></html>}
