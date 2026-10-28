import React from 'react';
import { X, Printer, MessageCircle, CheckCircle2, ShieldCheck, Download, Share2 } from 'lucide-react';

export default function AtelierReceiptModal({ order, settings, onClose }) {
  if (!order) return null;

  const currency = settings?.currency || 'FCFA';
  const m = order.customMeasurements || {};
  const hasMeasurements = m.neck || m.chest || m.shoulder || m.waist || m.trouserLength;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const cleanPhone = (order.customerPhone || '').replace(/\D/g, '');
    const phone = cleanPhone.startsWith('00') ? cleanPhone.slice(2) : cleanPhone;

    let msg = `👑 *REÇU OFFICIEL DE CONFECTION - ${settings?.atelierName || 'TAY COLLECTIONS'}* 👑\n`;
    msg += `N° de Commande / Réf : *${order.id}*\n`;
    msg += `Date : ${order.orderDate}\n`;
    msg += `Client : *${order.customerName}*\n`;
    msg += `------------------------------------\n`;
    
    order.items?.forEach((it, idx) => {
      msg += `• *${it.name}* (x${it.qty || 1})\n`;
      if (it.material) msg += `  Matière : ${it.material}\n`;
      if (it.color) msg += `  Coloris : ${it.color}\n`;
      msg += `  Prix : ${Number(it.price || 0).toLocaleString()} ${currency}\n`;
    });

    if (hasMeasurements) {
      msg += `\n📏 *Mesures Prises (Système Métrique Ouest-Africain cm) :*\n`;
      if (m.neck) msg += `• Col : ${m.neck} cm | Poitrine : ${m.chest} cm\n`;
      if (m.shoulder) msg += `• Épaules : ${m.shoulder} cm | Manches : ${m.sleeveLength} cm\n`;
      if (m.kaftanLength) msg += `• Long. Boubou/Kaftan : ${m.kaftanLength} cm | Taille : ${m.waist} cm\n`;
      if (m.trouserLength) msg += `• Pantalon : ${m.trouserLength} cm | Tour Tête : ${m.capSize || '-'} cm\n`;
    }

    msg += `------------------------------------\n`;
    msg += `💰 *DÉCOMPTE FINANCIER :*\n`;
    msg += `• Total Facturé : ${Number(order.totalAmount || 0).toLocaleString()} ${currency}\n`;
    msg += `• Acompte Réglé : ${Number(order.amountPaid || 0).toLocaleString()} ${currency}\n`;
    msg += `• *Solde Dû : ${Number(order.balanceOwed || 0).toLocaleString()} ${currency}* ${order.balanceOwed === 0 ? '(Entièrement Soldé ✅)' : ''}\n\n`;

    msg += `Statut Confection : *${order.tailoringStage || 'Prêt au Retrait'}*\n`;
    msg += `Suivi en ligne : ${settings?.previewUrl || 'https://maison-toheeb-couture.onrender.com'}\n\n`;
    msg += `Merci pour votre confiance en l'excellence artisanale de TAY Collections !`;

    const url = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 print:border-none print:shadow-none print:m-0 print:p-0 print:w-full print:max-w-none cursor-default"
      >
        
        {/* Top Control Bar - Hidden on print */}
        <div className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-800" />
            <h2 className="font-serif text-xs font-bold text-slate-900 tracking-wide uppercase">
              Reçu de Confection & Facture Client
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              title="Envoyer le reçu directement au client sur WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Partager sur WhatsApp</span>
            </button>

            <button
              onClick={handlePrint}
              className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs rounded-xl flex items-center gap-1.5 transition-colors shadow-sm"
              title="Télécharger / Imprimer en PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Télécharger / Imprimer PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Receipt Sheet */}
        <div className="p-8 sm:p-10 space-y-7 text-slate-900 bg-white print:p-8">
          
          {/* Atelier Brand Header */}
          <div className="border-b-2 border-slate-900 pb-5 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div className="flex items-start gap-4">
              <img 
                src="/tay-logo-highres.png" 
                alt="TAY Collections Logo" 
                className="w-16 h-16 object-contain shrink-0 drop-shadow-sm mt-0.5" 
              />
              <div>
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-slate-400 block mb-1">
                  Atelier Haute Couture &bull; Confection Traditionnelle
                </span>
                <h1 className="font-serif text-2xl font-bold tracking-tight text-slate-900">
                  {settings?.atelierName || 'TAY COLLECTIONS'}
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  {settings?.address || 'Boulevard Jean-Paul II, Tokoin-Wuiti, Lomé, Togo'}
                </p>
                <p className="text-xs text-slate-500">
                  Tél / WhatsApp : <strong>{settings?.displayPhone || '+228 90 60 38 01 / +228 93 17 20 01'}</strong> &bull; {settings?.email || 'contact@tay-collections.com'}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block bg-slate-900 text-white font-mono text-xs font-bold px-3 py-1 rounded">
                REÇU N° {order.id}
              </div>
              <div className="text-[11px] text-slate-500 pt-1">
                Date d'émission : <strong>{order.orderDate}</strong>
              </div>
              <div className="text-[11px] text-slate-500">
                Livraison : <strong>{order.estimatedCompletionDate || 'Livraison immédiate'}</strong>
              </div>
            </div>
          </div>

          {/* Client & Atelier Details 2-Column Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Destinataire / Client
              </span>
              <h3 className="font-serif text-sm font-bold text-slate-900">
                {order.customerName}
              </h3>
              <p className="text-slate-600 font-mono text-xs">{order.customerPhone}</p>
              <p className="text-slate-500 text-[11px] pt-1">
                {order.deliveryAddress || 'Retrait direct au Showroom Cotonou'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Exécution & Statut Confection
              </span>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-900 text-xs">
                  {order.tailoringStage || 'Confection Achevée'}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Maître Tailleur référent : <strong>{order.assignedArtisan || 'Maître Rasheed'}</strong>
              </p>
              <p className="text-slate-500 text-[11px]">
                Règlement : <strong>{order.paymentMethod || 'Virement / Espèces'}</strong>
              </p>
            </div>
          </div>

          {/* Detailed Job Done Breakdown Table */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5">
              Désignation des Travaux & Confection
            </h3>
            
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-medium">
                  <tr>
                    <th className="py-2.5 px-4 text-left">Article / Confection</th>
                    <th className="py-2.5 px-3 text-left">Matière & Coloris</th>
                    <th className="py-2.5 px-3 text-center">Qté</th>
                    <th className="py-2.5 px-4 text-right">Montant ({currency})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items?.map((it, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="font-serif font-bold text-slate-900 text-xs">{it.name}</div>
                        {it.category && (
                          <span className="text-[10px] text-slate-400">{it.category}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-700">
                        <div>{it.material || order.fabricStatus || 'Fourniture Atelier'}</div>
                        {it.color && <span className="text-[10px] text-slate-500">Coloris : {it.color}</span>}
                      </td>
                      <td className="py-3 px-3 text-center font-mono font-medium">
                        {it.qty || 1}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {Number(it.price || (order.totalAmount / (order.items.length || 1))).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Measurements Applied (French West African Centimeters) */}
          {hasMeasurements && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Fiche de Mesures Appliquée (Système Métrique Ouest-Africain &bull; Centimètres)
                </span>
                <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Unité : cm
                </span>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 text-center text-xs">
                {[
                  { l: 'Col', v: m.neck },
                  { l: 'Poitrine', v: m.chest },
                  { l: 'Épaules', v: m.shoulder },
                  { l: 'Manches', v: m.sleeveLength },
                  { l: 'Boubou', v: m.kaftanLength },
                  { l: 'Taille', v: m.waist },
                  { l: 'Pantalon', v: m.trouserLength },
                  { l: 'Fila', v: m.capSize }
                ].map((item) => (
                  <div key={item.l} className="bg-white p-2 rounded-xl border border-slate-200">
                    <span className="text-[10px] text-slate-400 block">{item.l}</span>
                    <strong className="font-mono text-xs text-slate-900">
                      {item.v ? `${item.v} cm` : '-'}
                    </strong>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Financial Summary & Balance Statement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end pt-2">
            
            {/* Bank details & stamp */}
            <div className="text-xs text-slate-500 space-y-1.5 p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Certification Atelier TAY Collections</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Ce reçu fait foi d'exécution des travaux de couture sur mesure ou de vente au showroom. 
                Banque : {settings?.bankName || 'Ecobank / Coris Bank Togo'} &bull; Compte : {settings?.accountNumber || '010023456789'}.
              </p>
            </div>

            {/* Total Math Table */}
            <div className="p-4 rounded-2xl bg-white border border-slate-300 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Facturé :</span>
                <span className="font-mono font-medium">{Number(order.totalAmount || 0).toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Acompte Réglé :</span>
                <span className="font-mono font-medium">{Number(order.amountPaid || 0).toLocaleString()} {currency}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline font-bold text-sm text-slate-900">
                <span>Solde Restant Dû :</span>
                <span className={`font-mono ${order.balanceOwed > 0 ? 'text-red-700' : 'text-emerald-700'}`}>
                  {Number(order.balanceOwed || 0).toLocaleString()} {currency}
                </span>
              </div>
              {order.balanceOwed === 0 ? (
                <div className="text-center font-bold text-[10px] text-emerald-700 bg-emerald-50 py-1 rounded border border-emerald-200 tracking-wider uppercase">
                  ✓ Facture Entièrement Soldée
                </div>
              ) : (
                <div className="text-center text-[10px] text-amber-800 bg-amber-50 py-1 rounded border border-amber-200">
                  Solde exigible à la livraison
                </div>
              )}
            </div>

          </div>

          {/* Signature & Quality guarantee footer */}
          <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-400">
            <span>TAY Collections &bull; Lomé, Togo</span>
            <span>Document certifié &bull; Traçabilité : {order.id}</span>
          </div>

        </div>

      </div>
    </div>
  );
}
