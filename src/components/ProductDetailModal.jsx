import React, { useState, useEffect } from 'react';
import { X, Clock, Scissors, ShoppingBag, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';

export default function ProductDetailModal({ product, settings, onClose, onQuickOrder, onAddToCart }) {
  if (!product) return null;
  const currency = settings?.currency || 'FCFA';
  const isBespoke = product.isCustomMade;
  const turnaroundDays = Number(product.turnaroundDays) || 5;

  const [isZoomed, setIsZoomed] = useState(false);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isZoomed, onClose]);

  const computeDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + turnaroundDays);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <>
      {/* Main Detail Modal with Click-Outside to Close */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 cursor-default"
        >
          
          {/* Close Button */}
          <div className="flex justify-end p-3 border-b border-slate-100">
            <button 
              onClick={onClose} 
              aria-label="Fermer"
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 p-6 gap-6">
            {/* Image with Click to Zoom */}
            <div 
              onClick={() => setIsZoomed(true)}
              className="relative aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in group"
            >
              <img 
                src={product.image} 
                alt={product.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/uploads/cat_boubous.jpg';
                }}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute bottom-3 right-3 bg-black/60 text-white rounded-full p-2 backdrop-blur-sm opacity-90 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 text-[11px] px-3 font-medium">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>Agrandir</span>
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
                  {product.category}
                </span>

                <h2 className="font-serif text-xl sm:text-2xl font-bold text-slate-900">
                  {product.name}
                </h2>

                <div className="text-xl font-serif font-bold text-slate-900">
                  {Number(product.price).toLocaleString()} {currency}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {product.description}
                </p>

                {/* Confection Delay ONLY for Bespoke */}
                {isBespoke ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-2 text-slate-900 font-semibold">
                      <Clock className="w-4 h-4 text-slate-700" />
                      <span>Délai de confection : {turnaroundDays} jours ouvrés</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Prêt le : <strong className="text-slate-800 capitalize">{computeDeliveryDate()}</strong> si commande passée aujourd'hui.
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      <span>Prêt-à-Porter &bull; En Stock Immédiat</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Disponible immédiatement sans délai de couture. Retrait au Showroom ou expédition rapide.
                    </div>
                  </div>
                )}

                {product.fabricRequirements && isBespoke && (
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5 text-slate-400" />
                    <span>Métrage requis : {product.fabricRequirements}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onQuickOrder(product);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <Scissors className="w-4 h-4" />
                  <span>{isBespoke ? 'Commander Sur Mesure' : 'Acheter Immédiatement'}</span>
                </button>

                <button
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ajouter au Panier</span>
                </button>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Fullscreen Image Lightbox: Clicking ANYWHERE closes it */}
      {isZoomed && (
        <div 
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-pointer animate-fadeIn select-none"
        >
          <div className="absolute top-4 right-4 flex items-center gap-2 text-white/80 hover:text-white">
            <span className="text-xs font-medium bg-black/40 px-3 py-1.5 rounded-full border border-white/20">
              Cliquer n'importe où pour fermer
            </span>
            <button 
              onClick={() => setIsZoomed(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <img 
            src={product.image} 
            alt={product.name}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/uploads/cat_boubous.jpg';
            }}
            className="max-w-[92vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl transition-transform hover:scale-[1.01]"
          />

          <div className="mt-4 text-center text-white/90">
            <h3 className="font-serif text-lg font-bold">{product.name}</h3>
            <p className="text-xs text-white/70">{Number(product.price).toLocaleString()} {currency}</p>
          </div>
        </div>
      )}
    </>
  );
}
