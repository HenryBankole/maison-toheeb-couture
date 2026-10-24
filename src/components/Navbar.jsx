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
  Store
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

  const handleNavClick = (section, category = 'all') => {
    setActiveView('store');
    if (setStoreSection) setStoreSection(section);
    if (setSelectedCategory) setSelectedCategory(category);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      
      {/* 1. TOP ANNOUNCEMENT BAR (Mirrors the exact reference header) */}
      <div className="bg-[#f8f9fa] border-b border-slate-200/80 px-4 sm:px-8 py-2 text-[11px] sm:text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Left Announcement text */}
          <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
            <span className="font-normal text-slate-600">
              Haute Couture Africaine & Boubous d'Honneur
            </span>
            <span className="text-slate-300">|</span>
            <button
              onClick={() => handleNavClick('bespoke')}
              className="font-medium text-slate-900 underline hover:text-slate-700 transition-colors"
            >
              Découvrir la Collection &rarr;
            </button>

            {settings?.previewUrl && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(settings.previewUrl);
                  alert('Lien de prévisualisation live copié dans le presse-papier !\n\n' + settings.previewUrl);
                }}
                className="hidden lg:inline-flex items-center gap-1.5 ml-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px] font-semibold transition-colors"
                title="Cliquer pour copier le lien permanent à envoyer à votre client"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Lien Live Client</span>
              </button>
            )}
          </div>

          {/* Right Language & Currency selectors */}
          <div className="flex items-center gap-4 shrink-0 font-medium">
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors">
              <span>Français</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-1 cursor-pointer hover:text-slate-900 transition-colors">
              <span>FCFA (CFR)</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
            <span className="hidden md:inline text-slate-300">|</span>
            <button 
              onClick={onOpenCallModal}
              className="hidden md:flex items-center gap-1 text-slate-700 hover:text-slate-900 transition-colors"
            >
              <Phone className="w-3 h-3 text-slate-500" />
              <span>{settings?.displayPhone || '+229 97 00 00 00'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* 2. MAIN HEADER (Left Links | Center Lowercase 'toheeb' Logo | Right Icons) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LEFT: Navigation Links */}
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

          {/* CENTER: Geometric Lowercase Brand Logo matching 'unicoz' in reference */}
          <div 
            onClick={() => { setActiveView('store'); }}
            className="flex flex-col items-center justify-center cursor-pointer select-none group px-2"
          >
            <span className="font-sans text-2xl sm:text-3xl font-extrabold lowercase tracking-tight text-slate-900 group-hover:opacity-90 transition-opacity">
              toheeb
            </span>
            <span className="text-[9px] uppercase tracking-[0.28em] text-slate-400 font-semibold -mt-0.5">
              haute couture &bull; sur mesure
            </span>
          </div>

          {/* RIGHT: Search, User Dashboard, Cart with badge */}
          <div className="flex items-center gap-3 sm:gap-4">
            
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
                      placeholder="Boubou, Oud, Fila..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Tailor Dashboard / User Account Icon */}
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

            {/* Shopping Cart Icon with Black Circle Badge */}
            <button
              onClick={onOpenCartModal}
              aria-label="Panier et commandes"
              className="relative p-2 text-slate-700 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              
              {/* Badge Counter matching reference '🛒²' */}
              {cartCount > 0 ? (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-black text-white font-mono text-[10px] font-bold flex items-center justify-center px-1 shadow-sm">
                  {cartCount}
                </span>
              ) : (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-slate-100 text-slate-500 font-mono text-[10px] font-bold flex items-center justify-center px-1 border border-slate-200">
                  0
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
            <button
              onClick={() => { onOpenCallModal(); setMobileMenuOpen(false); }}
              className="w-full text-left px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <Phone className="w-4 h-4 text-slate-500" />
              <span>Appeler le Tailleur ({settings?.displayPhone || '+229 97 00 00 00'})</span>
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
