import React from 'react';

const defaultCategories = [
  {
    id: "Boubous d'Honneur & Senator",
    name: "Boubous",
    image: "/uploads/cat_boubous.jpg",
    section: "bespoke"
  },
  {
    id: "Kaftans Sur Mesure",
    name: "Kaftans",
    image: "/uploads/cat_kaftans.jpg",
    section: "bespoke"
  },
  {
    id: "Coiffes & Bonnets",
    name: "Filas & Coiffes",
    image: "/uploads/cat_filas.jpg",
    section: "ready_to_wear"
  },
  {
    id: "Parfums & Ouds",
    name: "Parfums & Ouds",
    image: "/uploads/cat_parfums.jpg",
    section: "ready_to_wear"
  },
  {
    id: "Chaussures & Babouches",
    name: "Babouches",
    image: "/uploads/cat_babouches.jpg",
    section: "ready_to_wear"
  },
  {
    id: "Ceintures",
    name: "Ceintures",
    image: "/uploads/cat_ceintures.jpg",
    section: "ready_to_wear"
  }
];

export default function CategoryCircleSlider({ 
  categories = defaultCategories, 
  onSelectCategory, 
  activeCategory 
}) {
  const list = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        
        {/* Centered Editorial Section Header in French */}
        <div className="text-center space-y-1.5 max-w-xl mx-auto">
          <h2 className="font-sans text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Nouveautés Récentes
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-normal">
            Pièces maîtresses sélectionnées chaque mois &bull; Maison Toheeb
          </p>
        </div>

        {/* 6 Circular Pods with images FILLING the circle (No excessive bezel) */}
        <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-10 overflow-x-auto pb-4 scrollbar-none">
          {list.map((cat) => {
            const isSelected = activeCategory === cat.id;

            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat)}
                className="flex flex-col items-center gap-3 shrink-0 cursor-pointer group"
              >
                {/* Circular Pod Container - Image fills the circle edge-to-edge */}
                <div className={`w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-sm ${
                  isSelected 
                    ? 'border-slate-900 ring-4 ring-slate-900/10 shadow-md scale-105' 
                    : 'border-slate-200/90 group-hover:border-slate-400 group-hover:shadow-md'
                }`}>
                  <img
                    src={cat.image}
                    alt={cat.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/uploads/cat_boubous.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                </div>

                {/* Pod Label */}
                <span className={`text-xs sm:text-sm font-semibold tracking-tight transition-colors ${
                  isSelected ? 'text-slate-900 font-bold' : 'text-slate-800 group-hover:text-slate-900'
                }`}>
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
