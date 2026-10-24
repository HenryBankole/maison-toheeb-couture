import React from 'react';
import { Clock, ShoppingBag, Eye, ArrowUpRight } from 'lucide-react';

export default function ProductCard({ 
  product, 
  settings, 
  onQuickOrder, 
  onAddToCart, 
  onViewDetails 
}) {
  const currency = settings?.currency || 'FCFA';
  const isBespoke = product.isCustomMade;
  const turnaroundDays = product.turnaroundDays || 5;

  return (
    <div className="group flex flex-col justify-between bg-white rounded-2xl p-2.5 transition-all duration-300 hover:shadow-lg border border-slate-100 hover:border-slate-200">
      
      {/* 1. Image Container with Soft Pedestal Background */}
      <div 
        className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-[#f4f6f5] cursor-pointer"
        onClick={() => onViewDetails(product)}
      >
        <img 
          src={product.image} 
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/uploads/cat_boubous.jpg';
          }}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Minimal Category Tag */}
        <div className="absolute top-2.5 left-2.5">
          <span className="px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-white/95 text-slate-800 shadow-sm border border-slate-200/50 backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        {/* Timeframe Pill - Only for bespoke tailoring */}
        {isBespoke && (
          <div className="absolute top-2.5 right-2.5">
            <span className="px-2 py-0.5 text-[10px] font-medium rounded-md bg-white/95 text-slate-700 shadow-sm border border-slate-200/50 flex items-center gap-1 backdrop-blur-sm">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>{turnaroundDays} jours</span>
            </span>
          </div>
        )}

        {/* Quick View Overlay Icon on Hover */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
          <span className="bg-white/95 text-slate-900 rounded-full px-3 py-1.5 text-xs font-semibold shadow-md flex items-center gap-1 transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>Aperçu</span>
          </span>
        </div>
      </div>

      {/* 2. Editorial Typography & Pricing */}
      <div className="pt-3 pb-1 px-1 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block mb-0.5">
            {isBespoke ? 'Atelier &bull; Sur Mesure' : 'Boutique &bull; En Stock'}
          </span>

          <h3 
            onClick={() => onViewDetails(product)}
            className="font-sans text-sm font-bold text-slate-900 group-hover:text-black line-clamp-1 cursor-pointer transition-colors"
          >
            {product.name}
          </h3>

          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed font-normal">
            {product.description}
          </p>
        </div>

        {/* Price & Action Row */}
        <div className="pt-2 border-t border-slate-100 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm sm:text-base font-extrabold text-slate-900">
              {Number(product.price).toLocaleString()} {currency}
            </span>
            <span className="text-[11px] font-medium text-slate-400">
              {isBespoke ? 'Matière incluse' : 'Disponible'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="w-full py-2 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Panier</span>
            </button>

            <button
              onClick={() => onQuickOrder(product)}
              className="w-full py-2 px-2.5 rounded-lg bg-black hover:bg-slate-900 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>{isBespoke ? 'Mesures' : 'Acheter'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
