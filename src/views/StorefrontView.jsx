import React, { useState, useRef } from 'react';
import { Search, Clock, Scissors, ShoppingBag, Sparkles, CheckCircle2 } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import CategoryCircleSlider from '../components/CategoryCircleSlider';
import ProductCard from '../components/ProductCard';

export default function StorefrontView({ 
  products = [], 
  categories = [],
  heroSlides = [],
  settings, 
  selectedCategory, 
  setSelectedCategory,
  storeSection,
  setStoreSection,
  onQuickOrder,
  onAddToCart,
  onViewDetails,
  onOpenCallModal,
  onOpenMessageModal,
  searchQuery: externalSearchQuery,
  setSearchQuery: setExternalSearchQuery
}) {
  const [internalSection, setInternalSection] = useState('bespoke');
  const activeSection = storeSection || internalSection;
  const setActiveSection = (section) => {
    if (setStoreSection) setStoreSection(section);
    setInternalSection(section);
  };

  const [internalSearch, setInternalSearch] = useState('');
  const searchQuery = externalSearchQuery !== undefined ? externalSearchQuery : internalSearch;
  const setSearchQuery = setExternalSearchQuery || setInternalSearch;

  // Category sub-filters for each section
  const [bespokeCategoryFilter, setBespokeCategoryFilter] = useState('all');
  const [readyCategoryFilter, setReadyCategoryFilter] = useState('all');

  const catalogRef = useRef(null);

  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Segment products cleanly:
  const isBespokeItem = (p) => p.section ? p.section === 'bespoke' : Boolean(p.isCustomMade);
  const bespokeProducts = products.filter(isBespokeItem);
  const readyMadeProducts = products.filter(p => !isBespokeItem(p));

  // Dynamically derive category pills from categories & existing products
  const bespokeCategoryList = [
    { id: 'all', label: 'Toutes les Créations Sur Mesure' },
    ...Array.from(new Set([
      ...categories.filter(c => c.section === 'bespoke').map(c => c.name),
      ...bespokeProducts.map(p => p.category).filter(Boolean)
    ])).map(name => ({ id: name, label: name }))
  ];

  const readyCategoryList = [
    { id: 'all', label: 'Toutes les Pièces' },
    ...Array.from(new Set([
      ...categories.filter(c => c.section === 'ready_to_wear').map(c => c.name),
      ...readyMadeProducts.map(p => p.category).filter(Boolean)
    ])).map(name => ({ id: name, label: name }))
  ];

  const matchCategoryFilter = (itemCat, filterValue) => {
    if (!filterValue || filterValue === 'all') return true;
    if (!itemCat) return false;
    const a = itemCat.trim().toLowerCase();
    const b = filterValue.trim().toLowerCase();
    return a === b || a.includes(b) || b.includes(a);
  };

  const displayedProducts = (activeSection === 'bespoke' ? bespokeProducts : readyMadeProducts).filter(p => {
    // Category filter
    if (activeSection === 'bespoke' && bespokeCategoryFilter !== 'all') {
      if (!matchCategoryFilter(p.category, bespokeCategoryFilter)) return false;
    }
    if (activeSection === 'ready_to_wear' && readyCategoryFilter !== 'all') {
      if (!matchCategoryFilter(p.category, readyCategoryFilter)) return false;
    }

    const matchesSearch = !searchQuery || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesSearch;
  });

  const handleCircleCategorySelect = (cat) => {
    const sec = cat.section || 'bespoke';
    setActiveSection(sec);
    if (sec === 'bespoke') {
      setBespokeCategoryFilter(cat.name || cat.id);
    } else {
      setReadyCategoryFilter(cat.name || cat.id);
    }
    scrollToCatalog();
  };

  return (
    <div className="w-full space-y-0 animate-fadeIn">
      
      {/* 1. HERO BANNER SECTION (Exact Replica of Reference Image) */}
      <HeroSection
        heroSlides={heroSlides}
        onExploreBespoke={() => {
          setActiveSection('bespoke');
          setBespokeCategoryFilter('all');
          scrollToCatalog();
        }}
        onExploreReadyToWear={() => {
          setActiveSection('ready_to_wear');
          setReadyCategoryFilter('all');
          scrollToCatalog();
        }}
        onQuickOrder={onQuickOrder}
        settings={settings}
      />

      {/* 2. RECENT ADDED CIRCULAR PODS (Exact Replica of Reference Image) */}
      <CategoryCircleSlider
        categories={categories}
        onSelectCategory={handleCircleCategorySelect}
        activeCategory={activeSection === 'bespoke' ? bespokeCategoryFilter : readyCategoryFilter}
      />

      {/* 3. FEATURED ITEMS / CATALOG SECTION (Clean, Minimalist White Aesthetic) */}
      <section ref={catalogRef} className="py-12 sm:py-16 bg-[#fcfdfd] border-b border-slate-100 scroll-mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* Centered Heading in French */}
          <div className="text-center space-y-1.5 max-w-xl mx-auto">
            <h2 className="font-sans text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Nos Modèles Phares
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-normal">
              Pièces d'exception sélectionnées pour vous &bull; Maison Toheeb
            </p>
          </div>

          {/* Segment Tabs Switcher & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            
            {/* Dual Segments */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  setActiveSection('bespoke');
                  setSearchQuery('');
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeSection === 'bespoke'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>1. Confection Sur Mesure (À Faire Coudre)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeSection === 'bespoke' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {bespokeProducts.length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveSection('ready_to_wear');
                  setSearchQuery('');
                }}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
                  activeSection === 'ready_to_wear'
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>2. Prêt-à-Porter & Parfums (En Stock)</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeSection === 'ready_to_wear' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'
                }`}>
                  {readyMadeProducts.length}
                </span>
              </button>
            </div>

            {/* Catalog Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une pièce, tissu ou oud..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 shadow-sm"
              />
            </div>

          </div>

          {/* Context Banner: Bespoke vs Ready-to-Wear */}
          {activeSection === 'bespoke' ? (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Pièces sur mesure</strong> : Choix personnalisé du tissu, des coloris disponibles en atelier et prise de mesure selon le barème métrique ouest-africain (en centimètres).
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="flex items-center gap-1 font-semibold text-slate-900">
                  <Clock className="w-3.5 h-3.5 text-slate-700" />
                  <span>Délai : 4 à 6 jours</span>
                </span>
                <button
                  onClick={onOpenCallModal}
                  className="text-slate-900 font-semibold underline text-xs hover:text-slate-700"
                >
                  Prendre rendez-vous &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>Boutique & Parfumerie d'Atelier</strong> : Bonnets Filas Aso-Oke, huiles d'Oud d'exception, kaftans et ceintures prêts à emporter, sans aucun délai d'attente de couture.
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 shrink-0">
                Disponibilité Immédiate Showroom
              </span>
            </div>
          )}

          {/* Category Filter Pills */}
          {activeSection === 'ready_to_wear' ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {readyCategoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setReadyCategoryFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    readyCategoryFilter === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {bespokeCategoryList.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setBespokeCategoryFilter(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                    bespokeCategoryFilter === cat.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/80'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Product Cards 4-Column Grid matching reference */}
          {displayedProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 space-y-2">
              <Scissors className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs text-slate-500">Aucun article ne correspond à votre recherche dans cette section.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setReadyCategoryFilter('all');
                  setBespokeCategoryFilter('all');
                }}
                className="text-xs font-semibold text-slate-900 underline"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {displayedProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  settings={settings}
                  onQuickOrder={onQuickOrder}
                  onAddToCart={onAddToCart}
                  onViewDetails={onViewDetails}
                />
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
