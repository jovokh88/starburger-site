import siteConfig from '@/lib/site-config'
export const site=siteConfig
export type Locale='ru'|'uz'|'en'
export const locales:Locale[]=['uz','ru','en']
export const copy={
uz:{lang:'uz',title:"Star Burger — unutilmas ta’m",description:'Jizzaxdagi Star Burger — burger, pizza, pide va gril. 24/7 ochiq.',city:'Jizzax · 24/7',hero:["Unutilmas","haqiqiy","ta’m."],intro:'Yaxshi taom, iliq muhit va istalgan vaqtda ochiq eshiklar. Star Burger — Jizzaxda 24/7.',menu:'Menyu',about:'Muhit',reviews:'Fikrlar',contact:'Aloqa',order:'Telegramda buyurtma',orderBot:'Buyurtma',viewMenu:'Menyuni ochish',fullMenu:"To‘liq menyuni ko‘rish",hits:"Tanlangan taomlar",kitchen:'Oshxonadan',address:"Jizzax, Madaniyat MFY, Qodirjon Inomov ko‘chasi, 73",open:'24/7 ochiqmiz',find:'Istalgan vaqtda keling',route:"Yo‘nalish qurish",google:'Google Maps',yandex:'Yandex Maps',reviewsHeadline:"Haqiqiy fikrlar — eng yaxshi reklama.",reviewsText:"Biz fikrlarni bezamaymiz. Star Burger haqidagi eng so‘nggi baho va izohlarni rasmiy Google va Yandex kartalarida ko‘ring.",atmosphere:"Bu joyning ham o‘z ta’mi bor",football:"Futbol oqshomlari",private:'Alohida xona',always:'Star Burger uxlamaydi',categories:['Burger','Pizza','Pide','Gril','Nonushta'],signature:'Firmali',chefPick:'Oshxona tanlovi',experienceText:"Kechki ovqat, do‘stlar bilan uchrashuv, oilaviy nonushta yoki katta o‘yin — kunning istalgan vaqtida.",privateText:'Kompaniyalar uchun alohida va qulay makon.',footballText:"Proyektorli zal va katta o‘yinlar muhiti.",atmosphereLabel:'Star Burger ichida',reviewsLabel:'Mehmonlar aytadi',findLabel:'Biz yaqindamiz',heroAlt:'Star Burger taomi',facadeAlt:'Jizzaxdagi Star Burger fasadi',language:'Til tanlash',openMenu:'Menyuni ochish',closeMenu:'Menyuni yopish'},
ru:{lang:'ru',title:'Star Burger — вкус, который запоминается',description:'Star Burger в Джизаке — бургеры, пицца, пиде и гриль. Открыты 24/7.',city:'Джизак · 24/7',hero:['Вкус,','который','запоминается.'],intro:'Хорошая еда, тёплая атмосфера и открытые двери в любое время. Star Burger — 24/7 в Джизаке.',menu:'Меню',about:'Атмосфера',reviews:'Отзывы',contact:'Контакты',order:'Заказать в Telegram',orderBot:'Заказать',viewMenu:'Открыть меню',fullMenu:'Смотреть полное меню',hits:"Выбранные блюда",kitchen:'Из кухни',address:'Джизак, МФЙ Madaniyat, ул. Qodirjon Inomov, 73',open:'Открыты 24/7',find:'Заезжайте в любое время',route:'Построить маршрут',google:'Google Maps',yandex:'Яндекс Карты',reviewsHeadline:'Настоящие отзывы лучше рекламных обещаний.',reviewsText:'Мы не приукрашиваем отзывы. Актуальные оценки и комментарии гостей доступны в официальных карточках Google и Яндекс.',atmosphere:'У места тоже есть вкус',football:'Футбольные вечера',private:'Приватная комната',always:'Star Burger не спит',categories:['Бургеры','Пицца','Пиде','Гриль','Завтраки'],signature:'Фирменное',chefPick:'Выбор кухни',experienceText:'Поздний ужин, встреча с друзьями, семейный завтрак или большой матч — в любое время суток.',privateText:'Отдельное комфортное пространство для компаний.',footballText:"Зал с проектором и атмосфера больших матчей.",atmosphereLabel:'Внутри Star Burger',reviewsLabel:'Говорят гости',findLabel:'Мы рядом',heroAlt:'Блюдо Star Burger',facadeAlt:'Фасад Star Burger в Джизаке',language:'Выбор языка',openMenu:'Открыть меню',closeMenu:'Закрыть меню'},
en:{lang:'en',title:'Star Burger — a taste to remember',description:'Star Burger in Jizzakh — burgers, pizza, pide and grill. Open 24/7.',city:'Jizzakh · 24/7',hero:['A taste','to remember.',''],intro:'Great food, a warm atmosphere and open doors at any hour. Star Burger — 24/7 in Jizzakh.',menu:'Menu',about:'Atmosphere',reviews:'Reviews',contact:'Contact',order:'Order on Telegram',orderBot:'Order',viewMenu:'Open menu',fullMenu:'View full menu',hits:"Selected dishes",kitchen:'From the kitchen',address:'73 Qodirjon Inomov Street, Madaniyat, Jizzakh',open:'Open 24/7',find:'Come by anytime',route:'Get directions',google:'Google Maps',yandex:'Yandex Maps',reviewsHeadline:'Real guest reviews beat advertising promises.',reviewsText:'We do not rewrite or embellish reviews. See current ratings and guest comments on the official Google and Yandex listings.',atmosphere:'A place with a flavour of its own',football:'Football nights',private:'Private room',always:'Star Burger never sleeps',categories:['Burgers','Pizza','Pide','Grill','Breakfast'],signature:'Signature',chefPick:"Kitchen pick",experienceText:'Late dinner, friends, family breakfast or a big match — any time of day.',privateText:'A comfortable private space for groups.',footballText:"A projector room and the atmosphere of the big game.",atmosphereLabel:'Inside Star Burger',reviewsLabel:'Guest voices',findLabel:'Find us',heroAlt:'Star Burger dish',facadeAlt:'Star Burger facade in Jizzakh',language:'Choose language',openMenu:'Open menu',closeMenu:'Close menu'}
} as const
export const gallery=[['/images/atm-facade.jpg','Star Burger facade'],['/images/food-burger.jpg','Star Burger burger'],['/images/food-pide.jpg','Fresh pide'],['/images/food-kebab.jpg','Grilled kebab'],['/images/food-breakfast.jpg','Breakfast'],['/images/food-bruschetta.jpg','Bruschetta']] as const
export const menu=[
  {
    "name": "Star Burger",
    "price": "66 000",
    "image": "/images/star-burger.webp",
    "desc": {
      "uz": "Star Burger’ning firmali burgeri.",
      "ru": "Фирменный бургер Star Burger.",
      "en": "The signature Star Burger."
    }
  },
  {
    "name": "Pizza Peperoni (30 cm)",
    "price": "80 000",
    "image": "/images/peperoni.webp",
    "desc": {
      "uz": "Peperoni pizza, 30 cm.",
      "ru": "Пицца Peperoni, 30 см.",
      "en": "Peperoni pizza, 30 cm."
    }
  },
  {
    "name": "Lavash Dürüm (Oddiy)",
    "price": "39 000",
    "image": "/images/lavash.webp",
    "desc": {
      "uz": "Lavash Dürüm — oddiy variant.",
      "ru": "Lavash Dürüm — стандартный вариант.",
      "en": "Lavash Dürüm — regular variant."
    }
  },
  {
    "name": "Hot-dog (Oddiy)",
    "price": "25 000",
    "image": "/images/hotdog.webp",
    "desc": {
      "uz": "Hot-dog — oddiy variant.",
      "ru": "Хот-дог — стандартный вариант.",
      "en": "Hot-dog — regular variant."
    }
  },
  {
    "name": "Tavuk Kanat",
    "price": "52 900",
    "image": "/images/tavuk-kanat.webp",
    "desc": {
      "uz": "Tovuq qanotlari.",
      "ru": "Куриные крылышки.",
      "en": "Chicken wings."
    }
  }
] as const
