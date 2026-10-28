import React from 'react';
import { X, Printer, Scissors, User, Calendar, CheckSquare } from 'lucide-react';

export default function JobCardModal({ order, settings, onClose }) {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const m = order.customMeasurements || {};

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden my-6 print:border-none print:shadow-none print:m-0">
        
        {/* Header - Not printed */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Scissors className="w-4 h-4 text-slate-700" />
            <h2 className="font-serif text-sm font-semibold text-slate-900">
              Fiche de Coupe & Patronage Atelier
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Slip */}
        <div className="p-6 sm:p-8 space-y-6 text-slate-900 print:p-0">
          
          {/* Header */}
          <div className="border-b-2 border-slate-900 pb-3 flex justify-between items-start">
            <div className="flex items-center gap-3">
              <img src="/tay-logo-highres.png" alt="TAY Collections" className="w-10 h-10 object-contain drop-shadow-sm" />
              <div>
                <h1 className="font-serif text-xl font-bold tracking-wide text-slate-900">
                  {settings?.atelierName || 'TAY COLLECTIONS'}
                </h1>
                <p className="text-[11px] text-slate-500">
                  Fiche d'exécution atelier &bull; Patronage, découpe et montage artisanal &bull; Lomé, Togo
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="font-mono text-base font-bold text-slate-900 border border-slate-900 px-2.5 py-0.5 rounded">
                {order.id}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">
                Livraison : <strong>{order.estimatedCompletionDate || order.dueDate}</strong>
              </p>
            </div>
          </div>

          {/* Client & Artisan info */}
          <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-400 block uppercase text-[10px]">Client</span>
              <strong className="text-sm text-slate-900">{order.customerName}</strong>
              <div className="text-slate-600 mt-0.5">{order.customerPhone}</div>
            </div>
            <div>
              <span className="text-slate-400 block uppercase text-[10px]">Artisan Modéliste</span>
              <strong className="text-sm text-slate-900">{order.assignedArtisan || 'Maître Rasheed'}</strong>
              <div className="text-slate-600 mt-0.5">Date commande : {order.orderDate}</div>
            </div>
          </div>

          {/* Garments to sew */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Pièces à Confectionner
            </h3>
            <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs space-y-1">
              {order.items?.map((it, idx) => (
                <div key={idx} className="flex justify-between font-medium text-slate-900">
                  <span>&bull; {it.name}</span>
                  <span className="font-mono">Qté : {it.qty}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-100 text-slate-600 flex justify-between">
                <span>Tissu employé :</span>
                <strong>{order.fabricStatus}</strong>
              </div>
            </div>
          </div>

          {/* Body Measurements Matrix */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Barème des Mesures (Système Métrique : {m.unit || 'cm'})
            </h3>
            <div className="grid grid-cols-4 gap-2 text-xs text-center">
              {[
                { l: 'Col', v: m.neck },
                { l: 'Poitrine', v: m.chest },
                { l: 'Épaules', v: m.shoulder },
                { l: 'Manches', v: m.sleeveLength },
                { l: 'Long. Kaftan', v: m.kaftanLength },
                { l: 'Taille', v: m.waist },
                { l: 'Pantalon', v: m.trouserLength },
                { l: 'Tour Tête', v: m.capSize },
              ].map(f => (
                <div key={f.l} className="p-2 rounded bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block">{f.l}</span>
                  <span className="font-mono font-bold text-xs text-slate-900">{f.v ? `${f.v} cm` : '-'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tailoring Notes */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-500">Consignes Particulières :</span>
            <p className="text-slate-800 italic">
              {order.notes || 'Confection standard selon la coupe et les finitions de la Maison.'}
            </p>
          </div>

          {/* Signoff checkboxes */}
          <div className="pt-2 border-t border-slate-300 grid grid-cols-4 gap-2 text-[10px] text-slate-500 text-center">
            <div className="border border-slate-200 p-2 rounded bg-white">
              <span className="block font-bold text-slate-800">1. Coupe</span>
              <span className="block mt-4 border-t border-dashed border-slate-300 pt-1">Date &bull; Visa</span>
            </div>
            <div className="border border-slate-200 p-2 rounded bg-white">
              <span className="block font-bold text-slate-800">2. Couture</span>
              <span className="block mt-4 border-t border-dashed border-slate-300 pt-1">Date &bull; Visa</span>
            </div>
            <div className="border border-slate-200 p-2 rounded bg-white">
              <span className="block font-bold text-slate-800">3. Broderie</span>
              <span className="block mt-4 border-t border-dashed border-slate-300 pt-1">Date &bull; Visa</span>
            </div>
            <div className="border border-slate-200 p-2 rounded bg-white">
              <span className="block font-bold text-slate-800">4. Repassage</span>
              <span className="block mt-4 border-t border-dashed border-slate-300 pt-1">Date &bull; Visa</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
