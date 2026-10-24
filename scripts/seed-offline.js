import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.categories = [
  {
    id: "Boubous d'Honneur & Senator",
    name: 'Boubous',
    image: '/uploads/cat_boubous.jpg',
    section: 'bespoke'
  },
  {
    id: 'Kaftans Sur Mesure',
    name: 'Kaftans',
    image: '/uploads/cat_kaftans.jpg',
    section: 'bespoke'
  },
  {
    id: 'Coiffes & Bonnets',
    name: 'Filas & Coiffes',
    image: '/uploads/cat_filas.jpg',
    section: 'ready_to_wear'
  },
  {
    id: 'Parfums & Ouds',
    name: 'Parfums & Ouds',
    image: '/uploads/cat_parfums.jpg',
    section: 'ready_to_wear'
  },
  {
    id: 'Chaussures & Babouches',
    name: 'Babouches',
    image: '/uploads/cat_babouches.jpg',
    section: 'ready_to_wear'
  },
  {
    id: 'Ceintures',
    name: 'Ceintures',
    image: '/uploads/cat_ceintures.jpg',
    section: 'ready_to_wear'
  }
];

db.heroSlides = [
  {
    id: 1,
    tag: 'Winter & Ceremony Collection',
    titleLine1: 'Behind the desert',
    titleLine2: 'gift for man',
    subtitle: "Haute Couture Africaine & Boubous d'Honneur confectionnés sur mesure dans les plus nobles étoffes.",
    primaryCta: 'Sur Mesure',
    secondaryCta: 'Prêt-à-Porter',
    modelImage: '/uploads/hero_slide_1.jpg',
    featuredProduct: {
      id: 'ready-004',
      name: 'Oud Al-Maliki 100ml Pure',
      price: '55 000 FCFA',
      image: '/uploads/hero_prod_oud.jpg'
    }
  },
  {
    id: 2,
    tag: 'Senator & Kaftans Modernes',
    titleLine1: "L'Art de l'Allure",
    titleLine2: 'Coupe Royale & Pure',
    subtitle: 'Ensembles Senator en laine vierge Super 140s et Kaftans minimalistes pour rendez-vous et réceptions.',
    primaryCta: 'Commander Senator',
    secondaryCta: 'Voir Boutique',
    modelImage: '/uploads/hero_slide_2.jpg',
    featuredProduct: {
      id: 'ready-001',
      name: 'Fila Aso-Oke Tissé Main',
      price: '32 000 FCFA',
      image: '/uploads/hero_prod_fila.jpg'
    }
  },
  {
    id: 3,
    tag: 'Boutique & Parfums Rares',
    titleLine1: "Sillage d'Exception",
    titleLine2: 'Oud & Cuir Noble',
    subtitle: "Extraits purs d'Oud de 12 ans, attars sans alcool, babouches brodées main et ceintures pleine fleur.",
    primaryCta: 'Explorer Parfums',
    secondaryCta: 'Prendre RDV',
    modelImage: '/uploads/hero_slide_3.jpg',
    featuredProduct: {
      id: 'ready-013',
      name: 'Babouches Royales Cuir',
      price: '48 000 FCFA',
      image: '/uploads/hero_prod_shoe.jpg'
    }
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
console.log('Categories and heroSlides successfully persisted to database.json!');
