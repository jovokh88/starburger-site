import hall from '../atm-hall.jpg'
import privateRoom from '../atm-private.jpg'
import projector from '../atm-projector.jpg'
import art from '../atm-art.jpg'
import pizza from '../atm-pizza.jpg'

export const atmosphereGallery = [
  { src: hall, alt: { uz: 'Star Burger asosiy zali', ru: 'Основной зал Star Burger', en: 'The main dining room' } },
  { src: privateRoom, alt: { uz: 'Alohida xona', ru: 'Приватная комната', en: 'The private room' } },
  { src: projector, alt: { uz: 'Proyektorli zal', ru: 'Зал с проектором', en: 'The projector room' } },
  { src: art, alt: { uz: 'Interyer tafsilotlari', ru: 'Детали интерьера', en: 'Interior details' } },
  { src: '/images/atm-facade.jpg', alt: { uz: 'Star Burger fasadi', ru: 'Фасад Star Burger', en: 'The Star Burger facade' } },
  { src: pizza, alt: { uz: 'Zaldagi stol', ru: 'Столик в зале', en: 'A table in the dining room' } }
] as const
