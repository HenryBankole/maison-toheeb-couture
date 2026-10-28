import React, { useState } from 'react';
import { 
  Search, 
  User, 
  ShoppingBag, 
  Phone, 
  MessageSquare, 
  Compass, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  Store,
  MapPin
} from 'lucide-react';

export default function Navbar({ 
  activeView, 
  setActiveView, 
  selectedCategory, 
  setSelectedCategory,
  storeSection = 'bespoke',
  setStoreSection,
  cartCount = 0,
  onOpenCallModal,
  onOpenMessageModal,
  onOpenCartModal,
  onOpenTrackerModal,
  settings,
  searchQuery = '',
  setSearchQuery
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const mapsUrl = settings?.mapsUrl || "https://www.google.com/maps?q=6.1628265380859375,1.2342439889907837&z=17&hl=en";
  const displayPhone = settings?.displayPhone || "+228 90 60 38 01 / +228 93 17 20 01";

  const handleNavClick = (section, category = 'all') => {
    setActiveView('store');
    if (setStoreSection) setStoreSection(section);
    if (setSelectedCategory) setSelectedCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#f8f9fa] border-b border-slate-200/80 px-4 sm:px-8 py-2 text-[11px] sm:text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Announcement text & Maps Shortcut */}
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-semibold text-slate-800">
              TAY Collections
            </span>
            <span className="text-slate-300">|</span>
            <span className="hidden sm:inline font-normal text-slate-600">
              Haute Couture Africaine & Boubous d'Honneur
            </span>
            <span className="hidden sm:inline text-slate-300">|</span>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-amber-700 hover:text-amber-800 underline transition-colors"
              title="Ouvrir la localisation de la boutique à Lomé sur Google Maps"
            >
              <MapPin className="w-3 h-3 text-amber-600 shrink-0" />
              <span>Boutique Lomé (Google Maps) &rarr;</span>
            </a>

            {settings?.previewUrl && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(settings.previewUrl);
                  alert('Lien permanent en ligne copié dans le presse-papier !\n\n' + settings.previewUrl);
                }}
                className="hidden lg:inline-flex items-center gap-1.5 ml-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors"
                title="Lien permanent en ligne 24h/24"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>En Ligne 24h/24</span>
              </button>
            )}
          </div>

          {/* Right Language, Currency & Telephone */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 font-medium">
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors">
              <span>Français</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors">
              <span>FCFA</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <span className="hidden md:inline text-slate-300">|</span>
            <button 
              onClick={onOpenCallModal}
              className="hidden md:flex items-center gap-1.5 text-slate-700 hover:text-slate-900 transition-colors font-mono"
              title="Appeler la boutique TAY Collections"
            >
              <Phone className="w-3 h-3 text-slate-500" />
              <span>+228 90 60 38 01</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER (Top-Left Logo & Name Style | Navigation Links | Right Icons) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* TOP-LEFT: Brand Logo & Typography Matching Logo Style */}
          <div 
            onClick={() => { setActiveView('store'); window.scrollTo({ top: 0, left: 0, behavior: 'instant' }); }}
            className="flex items-center gap-3 cursor-pointer select-none group shrink-0 py-1"
          >
            {/* Circular Gold Medallion Logo (Clean, High Quality, No Numbers) */}
            <div className="relative">
              <img 
                src="/tay-logo-highres.png" 
                alt="TAY Collections Logo" 
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm" 
              />
            </div>

            {/* Brand Name Style matching the exact logo font style */}
            <div className="flex flex-col justify-center">
              <div className="flex items-baseline gap-1.5">
                <span className="font-['Cinzel',serif] text-xl sm:text-2xl font-black tracking-wider text-slate-900 group-hover:text-amber-700 transition-colors leading-none">
                  TAY
                </span>
                <span 
                  style={{ fontFamily: "'Alex Brush', cursive" }} 
                  className="text-xl sm:text-2xl text-amber-700 font-normal leading-none -ml-0.5 tracking-wide"
                >
                  Collection
                </span>
              </div>
              <span className="text-[8.5px] uppercase tracking-[0.24em] text-slate-400 font-semibold mt-1">
                haute couture &bull; sur mesure
              </span>
            </div>
          </div>

          {/* CENTER: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            <button
              onClick={() => { setActiveView('store'); if (setStoreSection) setStoreSection('bespoke'); }}
              className={`transition-colors py-1 ${
                activeView === 'store' && storeSection === 'bespoke'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => handleNavClick('ready_to_wear')}
              className={`transition-colors py-1 ${
                activeView === 'store' && storeSection === 'ready_to_wear'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Boutique
            </button>

            <button
              onClick={() => handleNavClick('bespoke')}
              className={`transition-colors py-1 ${
                activeView === 'store' && storeSection === 'bespoke'
                  ? 'text-slate-900 font-semibold border-b-2 border-slate-900'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sur Mesure
            </button>

            <button
              onClick={onOpenTrackerModal}
              className="text-slate-600 hover:text-slate-900 transition-colors py-1 flex items-center gap-1.5"
            >
              <span>Suivi Commande</span>
            </button>

            <button
              onClick={onOpenMessageModal}
              className="text-slate-600 hover:text-slate-900 transition-colors py-1"
            >
              Contact
            </button>
          </nav>

          {/* RIGHT: Location, Search, Dashboard, Cart */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            
            {/* Direct Google Maps Link Button */}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 transition-colors text-xs font-medium"
              title="Voir la localisation de la boutique à Lomé sur Google Maps"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Lomé, Togo</span>
            </a>

            {/* Search Icon / Toggle */}
            <div className="relative">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label="Recherche"
                className="p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>

              {searchOpen && (
                <div className="absolute right-0 top-12 w-64 sm:w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2.5 z-50 animate-fadeIn">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                      placeholder="Boubou, Kaftan, Oud, Fila..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tailor Dashboard / Showroom Switch */}
            <button
              onClick={() => {
                setActiveView(activeView === 'dashboard' ? 'store' : 'dashboard');
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              title={activeView === 'dashboard' ? "Retour au Showroom" : "Espace Tailleur / Tableau de Bord"}
              className={`p-2 rounded-full transition-colors flex items-center gap-1.5 ${
                activeView === 'dashboard' 
                  ? 'bg-slate-900 text-white' 
                  : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {activeView === 'dashboard' ? (
                <Store className="w-5 h-5" />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="hidden xl:inline text-xs font-semibold">
                {activeView === 'dashboard' ? "Showroom" : "Atelier"}
              </span>
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={onOpenCartModal}
              aria-label="Mon Panier"
              className="p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors relative"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] font-bold flex items-center justify-center animate-scaleIn">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-100 space-y-2 animate-fadeIn">
            <button
              onClick={() => { setActiveView('store'); if (setStoreSection) setStoreSection('bespoke'); setMobileMenuOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                activeView === 'store' && storeSection === 'bespoke' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Accueil & Sur Mesure
            </button>
            <button
              onClick={() => { handleNavClick('ready_to_wear'); }}
              className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-lg ${
                activeView === 'store' && storeSection === 'ready_to_wear' ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              Boutique Prêt-à-Porter
            </button>
            <button
              onClick={() => { onOpenTrackerModal(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Suivi Commande</span>
            </button>
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-left px-3 py-2 text-xs font-medium text-amber-800 bg-amber-50 hover:bg-amber-100 rounded-lg flex items-center gap-2"
            >
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>Localisation Boutique (Lomé sur Google Maps) &rarr;</span>
            </a>
            <button
              onClick={() => { onOpenCallModal(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2 font-mono"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              <span>+228 90 60 38 01 / +228 93 17 20 01</span>
            </button>
            <button
              onClick={() => { onOpenMessageModal(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <MessageSquare className="w-4 h-4 text-slate-500" />
              <span>Envoyer un Message Web</span>
            </button>
            <button
              onClick={() => { 
                setActiveView(activeView === 'dashboard' ? 'store' : 'dashboard'); 
                setMobileMenuOpen(false); 
                window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
              }}
              className="w-full text-left px-3 py-2 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4 text-slate-700" />
              <span>{activeView === 'dashboard' ? "Revenir au Showroom" : "Accès Espace Tailleur (Kanban)"}</span>
            </button>
          </div>
        )}

      </div>
    </header>
  );
}
