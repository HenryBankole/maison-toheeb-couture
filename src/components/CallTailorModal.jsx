import React from 'react';
import { X, Phone, Clock, MapPin, Check } from 'lucide-react';

export default function CallTailorModal({ settings, onClose }) {
  const phone = settings?.callPhone || settings?.phone || '+229 97 00 00 00';
  const displayPhone = settings?.displayPhone || '+229 97 00 00 00';

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-5 cursor-default"
      >
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-serif text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Phone className="w-4 h-4 text-slate-700" />
            <span>Appeler l'Atelier</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-center space-y-2 py-2">
          <p className="text-xs text-slate-500">
            Échangez directement avec le Maître Tailleur pour vos prises de mesures, choix de tissus ou rendez-vous privés.
          </p>
          <div className="font-mono text-xl font-bold text-slate-900 py-1">
            {displayPhone}
          </div>
        </div>

        <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 text-xs text-slate-600 space-y-1.5">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Du Lundi au Samedi : 09h00 - 19h30</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{settings?.address || 'Showroom Cotonou / Lagos'}</span>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <a
            href={`tel:${phone}`}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs text-center flex items-center justify-center gap-2 transition-colors"
          >
            <Phone className="w-4 h-4" />
            <span>Composer le Numéro</span>
          </a>
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-medium"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
