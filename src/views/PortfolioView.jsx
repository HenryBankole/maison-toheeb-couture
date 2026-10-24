import React, { useState } from 'react';
import { Sparkles, Calendar, User, Scissors, ExternalLink, ArrowRight } from 'lucide-react';

export default function PortfolioView({ portfolio, onSelectCategory, onConsult }) {
  const [filter, setFilter] = useState('All');

  const categories = ['All', 'Good Luck Garments', 'Kaftans', 'Filas & Caps', 'Perfumes & Fragrances'];

  const filteredItems = portfolio.filter(item => {
    if (filter === 'All') return true;
    return item.category?.toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-12">
      {/* Portfolio Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-300 text-xs font-semibold uppercase tracking-widest">
          <Sparkles className="w-3.5 h-3.5 text-gold-400" />
          <span>Atelier Archive & Lookbook</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
          Our Master Tailor Portfolio
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          A curated exhibition of bespoke Agbada regalias, Senator suites, hand-embroidered Kaftans, and royal wedding commissions crafted for dignitaries, executives, and discerning gentlemen across West Africa and the diaspora.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              filter === c
                ? 'bg-gold-500 text-black shadow-lg shadow-gold-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="group glass-card rounded-2xl overflow-hidden border border-slate-800 hover:border-gold-500/50 transition-all duration-300 flex flex-col"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b101b] via-transparent to-transparent opacity-80" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-black/70 backdrop-blur-md text-gold-300 border border-gold-500/30">
                  {item.category}
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                <div>
                  <span className="text-xs text-slate-300 flex items-center gap-1.5 mb-1">
                    <User className="w-3.5 h-3.5 text-gold-400" />
                    {item.client}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-white">
                    {item.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
                  {item.year}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.details}
              </p>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Scissors className="w-3.5 h-3.5 text-gold-400" />
                  Bespoke Handcrafted
                </span>
                <button
                  onClick={() => onSelectCategory(item.category)}
                  className="text-xs text-gold-400 hover:text-gold-300 font-semibold flex items-center gap-1"
                >
                  <span>Commission Similar Style</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
