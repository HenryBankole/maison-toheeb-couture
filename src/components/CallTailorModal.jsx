import React from 'react';
import { X, Phone, Clock, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

export default function CallTailorModal({ settings, onClose }) {
  const phone1 = settings?.phone || '22890603801';
  const phone2 = settings?.phone2 || '22893172001';
  const mapsUrl = settings?.mapsUrl || "https://www.google.com/maps?q=6.1628265380859375,1.2342439889907837&z=17&hl=en";

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5 cursor-default animate-scaleIn"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <img 
              src="/tay-logo-highres.png" 
              alt="TAY Collections" 
              className="w-10 h-10 object-contain drop-shadow-sm" 
            />
            <div>
              <h3 className="font-serif text-base font-bold text-slate-900 leading-tight">
                Contacter TAY Collections
              </h3>
              <p className="text-[11px] text-slate-500">
                Lomé, Togo &bull; Maître Tailleur & Service Client
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Introduction */}
        <p className="text-xs text-slate-600 leading-relaxed">
          Échangez directement avec notre atelier pour vos confections sur mesure, choix de tissus, essayages en boutique ou livraisons.
        </p>

        {/* 2 Phone Lines Cards */}
        <div className="space-y-3">
          
          {/* Ligne 1 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded">
                Ligne Principale
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                +228 90 60 38 01
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:+22890603801`}
                className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Appeler</span>
              </a>
              <a
                href={`https://wa.me/22890603801?text=${encodeURIComponent("Bonjour TAY Collections, je vous contacte depuis votre boutique en ligne.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Ligne 2 */}
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-700 bg-slate-200/80 px-2 py-0.5 rounded">
                Ligne Directe
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                +228 93 17 20 01
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <a
                href={`tel:+22893172001`}
                className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Appeler</span>
              </a>
              <a
                href={`https://wa.me/22893172001?text=${encodeURIComponent("Bonjour TAY Collections, je vous contacte depuis votre boutique en ligne.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Location & Hours Card */}
        <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/70 text-xs space-y-2">
          <div className="flex items-center gap-2 text-slate-700">
            <Clock className="w-3.5 h-3.5 text-amber-700 shrink-0" />
            <span>Du Lundi au Samedi : 09h00 - 19h30</span>
          </div>
          
          <div className="flex items-start gap-2 text-slate-700">
            <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
            <span>{settings?.address || 'Boulevard Jean-Paul II, Tokoin-Wuiti, Lomé, Togo'}</span>
          </div>

          <div className="pt-1">
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:underline"
            >
              <span>Ouvrir l'itinéraire sur Google Maps</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium transition-colors"
        >
          Fermer
        </button>

      </div>
    </div>
  );
}
