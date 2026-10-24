import React from 'react';
import { 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  Clock, 
  Truck, 
  Printer, 
  MessageCircle, 
  Phone, 
  Calendar,
  ExternalLink,
  ShieldCheck,
  Scissors
} from 'lucide-react';

export default function OrderDetailTracker({ 
  order, 
  settings, 
  onClose, 
  onOpenCallModal,
  onOpenMessageModal 
}) {
  if (!order) return null;

  const currency = settings?.currency || 'FCFA';

  // 5 Step Stages matching clothing workflow inspired by the screenshot
  const trackingSteps = [
    { key: "confirmed", name: "Commande Confirmée", sub: order.isAcceptedByTailor ? (order.acceptedDate || order.orderDate) : "En attente", index: 0 },
    { key: "pattern", name: "Tissu & Patron", sub: "Découpe", index: 1 },
    { key: "sewing", name: "Couture & Assemblage", sub: "Atelier", index: 2 },
    { key: "embroidery", name: "Broderie & Repassage", sub: "Finitions", index: 3 },
    { key: "ready", name: "Prêt au Retrait / Livré", sub: `Estimé : ${order.estimatedCompletionDate || order.dueDate}`, index: 4 }
  ];

  // Determine current active step
  const stageName = order.tailoringStage || '';
  let currentStepIndex = 0;
  if (!order.isAcceptedByTailor) {
    currentStepIndex = -1; // Before step 0
  } else if (stageName.includes('Tissu') || stageName.includes('Patron') || stageName.includes('Coupe')) {
    currentStepIndex = 1;
  } else if (stageName.includes('Couture') || stageName.includes('Assemblage')) {
    currentStepIndex = 2;
  } else if (stageName.includes('Broderie') || stageName.includes('Repassage') || stageName.includes('Essayage')) {
    currentStepIndex = 3;
  } else if (stageName.includes('Prêt') || stageName.includes('Livré') || stageName.includes('Récupéré')) {
    currentStepIndex = 4;
  }

  const handlePrintReceipt = () => {
    window.print();
  };

  const cleanPhone = (order.whatsapp || order.customerPhone || '').replace(/[^0-9]/g, '');

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6 print:border-none print:shadow-none print:m-0 cursor-default"
      >
        
        {/* Top Breadcrumb & Close Bar */}
        <div className="no-print px-6 sm:px-8 pt-6 pb-4 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="hover:text-slate-900 flex items-center gap-1 font-medium">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Showroom</span>
            </button>
            <span>&gt;</span>
            <span className="text-slate-500">Commandes</span>
            <span>&gt;</span>
            <span className="font-mono text-slate-800 font-semibold">ID {order.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintReceipt}
              className="py-1 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimer Reçu</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8 max-h-[85vh] overflow-y-auto print:p-0 print:max-h-none">
          
          {/* Order Header matching the user screenshot */}
          <div className="space-y-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Order ID: {order.id}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <div>
                Order date: <strong className="text-slate-900 font-semibold">{order.orderDate}</strong>
              </div>
              <span className="text-slate-300">&bull;</span>
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Date de livraison estimée : {order.estimatedCompletionDate || order.dueDate}</span>
                {order.daysRemaining !== undefined && (
                  <span className="ml-1 text-[11px] font-mono bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                    {order.daysRemaining} jour{order.daysRemaining > 1 ? 's' : ''} restant{order.daysRemaining > 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>

            {/* Tailor Acceptance Banner */}
            {order.isAcceptedByTailor ? (
              <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Commande Acceptée par le Maître Tailleur</strong> (Validée le {order.acceptedDate || order.orderDate}). La coupe et la confection sont programmées.
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shrink-0">
                  En Confection
                </span>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    <strong>Demande Transmise au Tailleur</strong> : En attente de confirmation de disponibilité par l'atelier. Vous recevrez une alerte dès validation.
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-amber-700 bg-white px-2.5 py-1 rounded-lg border border-amber-200 shrink-0">
                  En Attente
                </span>
              </div>
            )}
          </div>

          {/* Stepper matching the screenshot */}
          <div className="pt-2 pb-6 border-b border-slate-100">
            <div className="relative">
              {/* Stepper bar line */}
              <div className="absolute top-3.5 left-4 right-4 h-0.5 bg-slate-200 -z-0" />
              <div 
                className="absolute top-3.5 left-4 h-0.5 bg-emerald-500 transition-all duration-500 -z-0"
                style={{ 
                  width: currentStepIndex < 0 
                    ? '0%' 
                    : `${Math.min(100, (currentStepIndex / (trackingSteps.length - 1)) * 100)}%` 
                }}
              />

              {/* Steps */}
              <div className="relative z-10 flex justify-between">
                {trackingSteps.map((step) => {
                  const isDone = currentStepIndex >= step.index;
                  const isCurrent = currentStepIndex === step.index;

                  return (
                    <div key={step.key} className="flex flex-col items-center text-center max-w-[120px]">
                      {/* Step Circle */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        isDone 
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-50' 
                          : isCurrent 
                          ? 'bg-slate-900 text-white ring-4 ring-slate-100'
                          : 'bg-white text-slate-300 border-2 border-slate-300'
                      }`}>
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-[11px] font-bold">{step.index + 1}</span>
                        )}
                      </div>

                      {/* Step labels */}
                      <span className={`text-xs mt-2.5 font-medium leading-tight ${
                        isCurrent ? 'text-slate-900 font-bold' : isDone ? 'text-emerald-700' : 'text-slate-400'
                      }`}>
                        {step.name}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                        {step.sub}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Items List matching screenshot */}
          <div className="space-y-4">
            <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-800">
              Articles & Vêtements en Confection
            </h3>

            <div className="space-y-3">
              {(order.items || []).map((item, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center justify-between p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img 
                      src={item.image || "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=300&auto=format&fit=crop"} 
                      alt={item.name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="space-y-1">
                      <h4 className="font-serif text-sm sm:text-base font-bold text-slate-900">
                        {item.name}
                      </h4>
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        {item.material && <span>Tissu : <strong className="text-slate-700">{item.material}</strong></span>}
                        {item.material && item.color && <span>&bull;</span>}
                        {item.color && (
                          <span className="flex items-center gap-1">
                            <span>Couleur :</span>
                            <strong className="text-slate-700">{item.color}</strong>
                          </span>
                        )}
                        <span>&bull;</span>
                        <span>
                          {order.customMeasurements 
                            ? `Sur Mesure (${order.customMeasurements.neck || ''}cm col, ${order.customMeasurements.chest || ''}cm poitrine)`
                            : (item.size || 'Taille Standard')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif text-base sm:text-lg font-bold text-slate-900 block">
                      {Number(item.price).toLocaleString()} {currency}
                    </span>
                    <span className="text-xs text-slate-400">
                      Qty: {item.qty || 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 4-Column Grid: Payment | Delivery | Need Help | Order Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 border-t border-slate-100 text-xs">
            
            {/* Payment Block */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Payment</h4>
              <div className="text-slate-600 space-y-1">
                <div className="font-medium text-slate-900">{order.paymentCard || 'Visa **56'}</div>
                <div>Mode : {order.paymentMethod || 'Acompte Atelier / Virement'}</div>
                <div className="pt-1">
                  {order.balanceOwed <= 0 ? (
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px]">
                      Intégralement Soldé
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold text-[11px]">
                      Solde Dû : {order.balanceOwed.toLocaleString()} {currency}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Block */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Delivery</h4>
              <div className="text-slate-600 space-y-0.5 leading-relaxed">
                <span className="text-[10px] text-slate-400 uppercase block">Address</span>
                <div className="font-medium text-slate-900">{order.customerName}</div>
                <div>{order.deliveryAddress || 'Retrait direct au Showroom Cotonou'}</div>
                <div className="text-slate-500 font-mono mt-1">{order.customerPhone}</div>
              </div>
            </div>

            {/* Need Help Block */}
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Need Help</h4>
              <ul className="space-y-1.5 text-slate-600">
                <li>
                  <button 
                    onClick={onOpenCallModal}
                    className="hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Appeler le Maître Tailleur</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </li>
                <li>
                  <a
                    href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Bonjour Maître Tailleur, j'ai une question concernant ma commande N° [${order.id}].`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Contacter sur WhatsApp</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                </li>
                <li>
                  <button 
                    onClick={onOpenMessageModal}
                    className="hover:text-slate-900 flex items-center gap-1.5 transition-colors"
                  >
                    <span>Prendre RDV en atelier</span>
                    <ExternalLink className="w-3 h-3 text-slate-400" />
                  </button>
                </li>
              </ul>
            </div>

            {/* Order Summary Block */}
            <div className="space-y-2 bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Order Summary</h4>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Sous-total</span>
                  <span className="font-mono text-slate-900">{order.totalAmount.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Acompte versé</span>
                  <span className="font-mono">- {order.amountPaid.toLocaleString()} {currency}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Livraison</span>
                  <span className="font-mono text-emerald-700">0 {currency}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Solde Restant</span>
                  <span className="font-mono text-amber-700">{order.balanceOwed.toLocaleString()} {currency}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Tailor Appointment Note for In-House Measurements */}
          <div className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <Scissors className="w-5 h-5 text-slate-700" />
              </div>
              <div className="text-xs">
                <strong className="text-slate-900 block font-serif">Séance de Prise de Mesure à l'Atelier</strong>
                <span className="text-slate-500">
                  Vous pouvez vous rendre directement à notre showroom pour une prise de mesure professionnelle par le Maître Tailleur.
                </span>
              </div>
            </div>

            <button
              onClick={onOpenCallModal}
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs whitespace-nowrap transition-colors"
            >
              Planifier ma Visite
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
