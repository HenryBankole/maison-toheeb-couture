import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, '..', 'server', 'data', 'database.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

db.heroSlides = [
  {
    id: 1,
    tag: "Collection Cérémonie & Prestige",
    titleLine1: "L'Honneur & la Grâce",
    titleLine2: "Haute Couture Homme",
    subtitle: "Grands Boubous d'Honneur et ensembles d'apparat confectionnés sur mesure dans les plus nobles étoffes d'Afrique de l'Ouest.",
    primaryCta: "Sur Mesure",
    secondaryCta: "Prêt-à-Porter",
    modelImage: "/uploads/hero_slide_1.jpg",
    featuredProduct: {
      id: "ready-004",
      name: "Oud Al-Maliki 100ml Pur",
      price: "55 000 FCFA",
      image: "/uploads/hero_prod_oud.jpg"
    }
  },
  {
    id: 2,
    tag: "Senator & Kaftans Modernes",
    titleLine1: "L'Art de l'Allure",
    titleLine2: "Coupe Royale & Pure",
    subtitle: "Ensembles Senator en laine vierge Super 140s et Kaftans minimalistes pour réceptions d'affaires et cérémonies officielles.",
    primaryCta: "Confection Senator",
    secondaryCta: "Boutique Showroom",
    modelImage: "/uploads/hero_slide_2.jpg",
    featuredProduct: {
      id: "ready-001",
      name: "Fila Aso-Oke Tissé Main",
      price: "32 000 FCFA",
      image: "/uploads/hero_prod_fila.jpg"
    }
  },
  {
    id: 3,
    tag: "Parfumerie Rare & Accessoires",
    titleLine1: "Sillage d'Exception",
    titleLine2: "Oud Pur & Cuir Noble",
    subtitle: "Extraits purs d'Oud de 12 ans, attars orientaux sans alcool, babouches royales brodées main et ceintures pleine fleur.",
    primaryCta: "Explorer Parfums",
    secondaryCta: "Prendre Rendez-vous",
    modelImage: "/uploads/hero_slide_3.jpg",
    featuredProduct: {
      id: "ready-013",
      name: "Babouches Royales en Cuir",
      price: "48 000 FCFA",
      image: "/uploads/hero_prod_shoe.jpg"
    }
  }
];

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');

const initialDataPath = path.join(__dirname, '..', 'server', 'data', 'initialData.js');
const exportContent = `export const initialData = ${JSON.stringify(db, null, 2)};\n`;
fs.writeFileSync(initialDataPath, exportContent, 'utf8');

console.log('database.json and initialData.js successfully updated with 100% French hero slides!');
