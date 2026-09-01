import siteConfig from '@/lib/site-config'

export const site = siteConfig

export type Locale = 'ru' | 'uz' | 'en'
export const locales: Locale[] = ['ru', 'uz', 'en']

export const copy = {
  ru: { lang: "ru", title: "Star Burger — вкус, который не отпускает", description: "Star Burger в Джизаке — бургеры, пицца, лаваш и гриль 24/7.", city: "Джизак · 24/7", hero: ["Вкус,", "который", "не отпускает."], intro: "Настоящий вкус, который хочется повторить. Заезжайте в любое время — мы всегда на месте.", menu: "Меню", about: "О нас", contact: "Контакты", order: "Заказать в Telegram", orderBot: "Заказать", orderBotText: "Заказать через Telegram-бот", viewMenu: "Смотреть меню", fullMenu: "Открыть полное меню", hits: "Главные хиты", kitchen: "Из кухни", address: "Jizzax, Madaniyat MFY, Qodirjon Inomov ko'chasi, 73", open: "Открыты круглосуточно", find: "Как нас найти", route: "Построить маршрут", google: "Открыть в Google Maps", yandex: "Открыть в Яндекс Картах", reviews: "Отзывы гостей", readReviews: "Читать все отзывы", atmosphere: "Атмосфера Star Burger", football: "Два зала с проекторами для футбольных матчей", private: "Приватная комната для компаний", always: "Работаем 24/7" },
  uz: { lang: "uz", title: "Star Burger — unutilmas tam", description: "Jizzaxdagi Star Burger — burger, pizza, lavash va gril 24/7.", city: "Jizzax · 24/7", hero: ["Unutilmas", "haqiqiy", "tam."], intro: "Har kuni, istalgan vaqtda yangi va mazali taomlar. Biz doim ochiqmiz.", menu: "Menyu", about: "Biz haqimizda", contact: "Aloqa", order: "Telegram orqali buyurtma", orderBot: "Buyurtma", orderBotText: "Telegram-bot orqali buyurtma", viewMenu: "Menyuni korish", fullMenu: "Toliq menyuni ochish", hits: "Mashhur taomlar", kitchen: "Oshxonadan", address: "Jizzax, Madaniyat MFY, Qodirjon Inomov ko'chasi, 73", open: "24/7 ochiqmiz", find: "Bizni qanday topish mumkin", route: "Yonalish qurish", google: "Google Mapsda ochish", yandex: "Yandex Mapsda ochish", reviews: "Mehmonlar fikri", readReviews: "Barcha fikrlarni oqish", atmosphere: "Star Burger muhiti", football: "Futbol oyinlari uchun proyektorli ikki zal", private: "Kompaniyalar uchun alohida xona", always: "24/7 ishlaymiz" },
  en: { lang: "en", title: "Star Burger — a taste you remember", description: "Star Burger in Jizzakh — burgers, pizza, lavash and grill, open 24/7.", city: "Jizzakh · 24/7", hero: ["A taste", "you", "remember."], intro: "Real flavor worth coming back for. Drop in anytime — we are always here.", menu: "Menu", about: "About", contact: "Contact", order: "Order on Telegram", orderBot: "Order", orderBotText: "Order via Telegram bot", viewMenu: "View menu", fullMenu: "Open full menu", hits: "Guest favorites", kitchen: "From the kitchen", address: "Jizzax, Madaniyat MFY, Qodirjon Inomov ko'chasi, 73", open: "Open around the clock", find: "Find us", route: "Get directions", google: "Open in Google Maps", yandex: "Open in Yandex Maps", reviews: "Guest reviews", readReviews: "Read all reviews", atmosphere: "The Star Burger atmosphere", football: "Two projector rooms for football nights", private: "Private room for groups", always: "Open 24/7" },
} as const

export const reviews: never[] = []

export const gallery = [
  ['/images/atm-facade.jpg', 'Star Burger facade at night'],
  ['/images/food-burger.jpg', 'Star Burger signature burger'],
  ['/images/food-pide.jpg', 'Fresh pide from the kitchen'],
  ['/images/food-kebab.jpg', 'Grilled kebab plate'],
  ['/images/food-breakfast.jpg', 'Breakfast spread'],
  ['/images/food-bruschetta.jpg', 'Fresh bruschetta'],
] as const

export const menu = [
  { name: 'Star Burger', desc: 'Фирменный бургер с сочной котлетой', price: '66 000', image: '/images/food-burger.jpg' },
  { name: 'Kuşbaşı Pide', desc: 'Тонкое тесто, мясо и свежие овощи', price: '49 900', image: '/images/food-pide.jpg' },
  { name: 'Iskandar Kebab', desc: 'Нежное мясо, томатный соус и йогурт', price: '66 900', image: '/images/food-kebab.jpg' },
] as const

export const mapSearch = siteConfig.mapSearch
