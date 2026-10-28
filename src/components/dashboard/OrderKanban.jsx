import React, { useState } from 'react';
import { 
  Scissors, 
  Search, 
  Plus, 
  Clock, 
  Printer, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle2, 
  GripVertical, 
  DollarSign, 
  Calendar,
  Check,
  Trash2,
  Bell,
  FileText
} from 'lucide-react';
import { api } from '../../services/api';
import JobCardModal from './JobCardModal';
import CustomConfirmModal from '../common/CustomConfirmModal';
import AtelierReceiptModal from '../AtelierReceiptModal';

export default function OrderKanban({ 
  orders, 
  stages, 
  settings, 
  onRefresh, 
  onOpenCreateOrder 
}) {
  const currency = settings?.currency || 'FCFA';

  const [search, setSearch] = useState('');
  const [selectedJobSlip, setSelectedJobSlip] = useState(null);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);
  const [draggedOrderId, setDraggedOrderId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  
  // Payment modal state
  const [paymentModalOrder, setPaymentModalOrder] = useState(null);
  const [paymentInput, setPaymentInput] = useState('');

  // Timeline / Days Adjustment modal
  const [timelineModalOrder, setTimelineModalOrder] = useState(null);
  const [daysRemainingInput, setDaysRemainingInput] = useState(5);

  // Accept Order modal
  const [acceptingOrder, setAcceptingOrder] = useState(null);
  const [acceptDaysInput, setAcceptDaysInput] = useState(5);

  // Custom in-app Confirmation & Notification Modal (replaces browser-native popups)
  const [confirmModalConfig, setConfirmModalConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    previewText: null,
    confirmText: 'Oui, Notifier sur WhatsApp',
    cancelText: 'Non, Ne pas Notifier',
    variant: 'whatsapp',
    singleButton: false,
    onConfirm: null,
    onCancel: null
  });

  // Filter orders by search
  const filteredOrders = orders.filter(o => 
    !search || 
    o.id.toLowerCase().includes(search.toLowerCase()) || 
    o.customerName.toLowerCase().includes(search.toLowerCase()) || 
    (o.customerPhone && o.customerPhone.includes(search))
  );

  // Separate pending acceptance orders
  const pendingAcceptanceOrders = filteredOrders.filter(o => !o.isAcceptedByTailor);

  // Group confirmed orders by stage
  const ordersByStage = {};
  stages.forEach(s => {
    ordersByStage[s.name] = filteredOrders.filter(o => o.isAcceptedByTailor && o.tailoringStage === s.name);
  });

  // Drag handlers
  const handleDragStart = (e, orderId) => {
    setDraggedOrderId(orderId);
    e.dataTransfer.setData('text/plain', orderId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, stageName) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== stageName) {
      setDragOverColumn(stageName);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e, targetStageName) => {
    e.preventDefault();
    setDragOverColumn(null);
    const orderId = e.dataTransfer.getData('text/plain') || draggedOrderId;
    if (!orderId) return;

    const order = orders.find(o => o.id === orderId);
    if (!order || order.tailoringStage === targetStageName) return;

    try {
      const res = await api.updateOrderStage(orderId, targetStageName, `Déplacé par glisser-déposer vers ${targetStageName}`);
      onRefresh();

      if (res.whatsappUrl) {
        setConfirmModalConfig({
          isOpen: true,
          title: "Notifier le Client de l'Avancement",
          message: `La commande N° ${orderId} de ${order.customerName} a été déplacée vers l'étape « ${targetStageName} ».\n\nSouhaitez-vous notifier le client de cette avancée par message WhatsApp ?`,
          previewText: `Bonjour ${order.customerName},\nVotre tenue chez TAY Collections est passée à l'étape : ${targetStageName}.\nSuivez en direct votre confection sur : https://maison-toheeb-couture.onrender.com`,
          confirmText: "Oui, Notifier sur WhatsApp",
          cancelText: "Non, Ne pas Notifier",
          variant: "whatsapp",
          singleButton: false,
          onConfirm: () => {
            window.open(res.whatsappUrl, '_blank');
            setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
          },
          onCancel: () => {
            setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
          }
        });
      }
    } catch (err) {
      setConfirmModalConfig({
        isOpen: true,
        title: "Erreur de Mise à Jour",
        message: "Une erreur est survenue lors du déplacement de la commande : " + (err.message || "Erreur inconnue"),
        confirmText: "Compris",
        cancelText: null,
        variant: "danger",
        singleButton: true,
        onConfirm: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } finally {
      setDraggedOrderId(null);
    }
  };

  // Accept order by tailor
  const handleConfirmAcceptOrder = async (e) => {
    e.preventDefault();
    if (!acceptingOrder) return;
    const targetOrder = acceptingOrder;
    const daysSet = Number(acceptDaysInput);

    try {
      const res = await api.acceptOrder(targetOrder.id, daysSet);
      setAcceptingOrder(null);
      onRefresh();

      if (res.whatsappUrl) {
        setConfirmModalConfig({
          isOpen: true,
          title: "Confirmation d'Acceptation & Notification",
          message: `La commande N° ${targetOrder.id} pour ${targetOrder.customerName} a été acceptée avec succès (Délai fixé : ${daysSet} jours).\n\nSouhaitez-vous envoyer la confirmation officielle sur WhatsApp au client ?`,
          previewText: `Bonjour ${targetOrder.customerName},\nVotre commande N° ${targetOrder.id} a été validée et acceptée par notre atelier !\nDélai estimé de confection : ${daysSet} jours.\nTAY Collections Haute Couture`,
          confirmText: "Oui, Notifier sur WhatsApp",
          cancelText: "Non, Ne pas Notifier",
          variant: "whatsapp",
          singleButton: false,
          onConfirm: () => {
            window.open(res.whatsappUrl, '_blank');
            setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
          },
          onCancel: () => {
            setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
          }
        });
      }
    } catch (err) {
      setConfirmModalConfig({
        isOpen: true,
        title: "Erreur d'Acceptation",
        message: "Une erreur est survenue lors de l'acceptation de la commande : " + (err.message || "Erreur"),
        confirmText: "Fermer",
        variant: "danger",
        singleButton: true,
        onConfirm: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  // Adjust remaining days & Confection Timeline
  const handleSaveTimeline = async (e) => {
    e.preventDefault();
    if (!timelineModalOrder) return;
    const targetOrder = timelineModalOrder;
    const days = Number(daysRemainingInput);

    try {
      const targetDate = new Date(Date.now() + days * 86400000).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      await api.updateOrderTimeline(targetOrder.id, days, targetDate);
      setTimelineModalOrder(null);
      onRefresh();

      const phone = (targetOrder.customerPhone || '').replace(/\D/g, '');
      const cleanPhone = phone.startsWith('00') ? phone.slice(2) : phone;
      const msg = `Bonjour ${targetOrder.customerName},\nIci l'Atelier TAY Collections. Le délai de confection de votre tenue (Commande N° ${targetOrder.id}) a été actualisé : livraison estimée dans *${days} jours ouvrés* (date cible : *${targetDate}*).\nSuivi en direct : https://maison-toheeb-couture.onrender.com`;
      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

      setConfirmModalConfig({
        isOpen: true,
        title: "Délai Atelier Actualisé",
        message: `Le délai de confection pour ${targetOrder.customerName} a été fixé à ${days} jours (Date estimée : ${targetDate}).\n\nSouhaitez-vous notifier le client de cette nouvelle date estimée sur WhatsApp ?`,
        previewText: msg,
        confirmText: "Oui, Notifier sur WhatsApp",
        cancelText: "Non, Ne pas Notifier",
        variant: "whatsapp",
        singleButton: false,
        onConfirm: () => {
          window.open(waUrl, '_blank');
          setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
        },
        onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    } catch (err) {
      setConfirmModalConfig({
        isOpen: true,
        title: "Erreur",
        message: "Erreur lors de l'ajustement du délai de confection.",
        confirmText: "Fermer",
        variant: "danger",
        singleButton: true,
        onConfirm: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleSavePayment = async (e) => {
    e.preventDefault();
    if (!paymentModalOrder) return;
    const paid = Number(paymentInput);
    if (isNaN(paid)) return;

    try {
      await api.updateOrder(paymentModalOrder.id, {
        amountPaid: paid,
        balanceOwed: Math.max(0, (paymentModalOrder.totalAmount || 0) - paid)
      });
      setPaymentModalOrder(null);
      onRefresh();
    } catch (err) {
      setConfirmModalConfig({
        isOpen: true,
        title: "Erreur",
        message: "Erreur lors de l'enregistrement du règlement client.",
        confirmText: "Fermer",
        variant: "danger",
        singleButton: true,
        onConfirm: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleDeleteOrder = (order) => {
    setConfirmModalConfig({
      isOpen: true,
      title: "Supprimer la Commande",
      message: `Êtes-vous sûr de vouloir supprimer définitivement la commande N° ${order.id} au nom de ${order.customerName} ?\n\nCette action est irréversible et supprimera le suivi de confection.`,
      previewText: null,
      confirmText: "Oui, Supprimer Définitivement",
      cancelText: "Non, Conserver",
      variant: "danger",
      singleButton: false,
      onConfirm: async () => {
        try {
          await api.deleteOrder(order.id);
          setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
          onRefresh();
        } catch (err) {
          setConfirmModalConfig({
            isOpen: true,
            title: "Erreur",
            message: "Impossible de supprimer la commande : " + (err.message || ""),
            confirmText: "Fermer",
            variant: "danger",
            singleButton: true,
            onConfirm: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false })),
            onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
          });
        }
      },
      onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleManualNotifyWhatsApp = (order) => {
    const phone = (order.customerPhone || '').replace(/\D/g, '');
    const cleanPhone = phone.startsWith('00') ? phone.slice(2) : phone;
    const msg = `Bonjour ${order.customerName},\nIci l'Atelier TAY Collections. Votre tenue (Commande N° ${order.id}) est actuellement à l'étape : *${order.tailoringStage}*.\nIl reste environ *${order.daysRemaining ?? 5} jours* de confection.\nSuivi en ligne : https://maison-toheeb-couture.onrender.com\nMerci pour votre confiance !`;
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    setConfirmModalConfig({
      isOpen: true,
      title: "Notifier le Client sur WhatsApp",
      message: `Souhaitez-vous envoyer un message de suivi à ${order.customerName} concernant l'avancement de sa tenue (Étape actuelle : ${order.tailoringStage}) ?`,
      previewText: msg,
      confirmText: "Oui, Notifier sur WhatsApp",
      cancelText: "Non, Annuler",
      variant: "whatsapp",
      singleButton: false,
      onConfirm: () => {
        window.open(waUrl, '_blank');
        setConfirmModalConfig(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmModalConfig(prev => ({ ...prev, isOpen: false }))
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Filter and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900">
            Tableau Kanban des Confections
          </h2>
          <p className="text-xs text-slate-500">
            Validez les demandes entrantes, fixez vos délais selon votre charge de travail et glissez-déposez les cartes au fil de la confection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher référence ou client..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>

          <button
            onClick={onOpenCreateOrder}
            className="py-2 px-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nouvelle Commande</span>
          </button>
        </div>
      </div>

      {/* PENDING ACCEPTANCE ORDERS BANNER */}
      {pendingAcceptanceOrders.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
              <Bell className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>{pendingAcceptanceOrders.length} Nouvelle(s) Demande(s) en Attente de Confirmation de Confection</span>
            </div>
            <span className="text-[11px] text-amber-800">
              Le client verra le statut "Accepté" dès votre validation.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pendingAcceptanceOrders.map((ord) => (
              <div key={ord.id} className="p-3.5 rounded-xl bg-white border border-amber-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-slate-900">ID: {ord.id}</span>
                  <span className="text-[10px] text-slate-500">{ord.orderDate}</span>
                </div>

                <div>
                  <h4 className="font-serif text-xs font-bold text-slate-900">{ord.customerName}</h4>
                  <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                    {ord.items?.map(i => `${i.name} (${i.material || 'Tissu sélectionné'})`).join(', ')}
                  </p>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    Total : {Number(ord.totalAmount).toLocaleString()} {currency}
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    {ord.customerPhone}
                  </span>

                  <button
                    onClick={() => {
                      setAcceptingOrder(ord);
                      setAcceptDaysInput(ord.daysRemaining || 5);
                    }}
                    className="py-1 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Accepter la Commande</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Horizontal Scrollable Kanban Columns */}
      <div className="flex gap-3 overflow-x-auto pb-4 pt-1 items-start min-h-[520px] scrollbar-thin">
        {stages.map((stg) => {
          const columnOrders = ordersByStage[stg.name] || [];
          const isOver = dragOverColumn === stg.name;

          return (
            <div
              key={stg.id}
              onDragOver={(e) => handleDragOver(e, stg.name)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, stg.name)}
              className={`w-72 shrink-0 rounded-2xl flex flex-col max-h-[75vh] border transition-colors ${
                isOver 
                  ? 'bg-slate-100 border-dashed border-slate-900 ring-2 ring-slate-900/10' 
                  : 'bg-slate-50/80 border-slate-200'
              }`}
            >
              {/* Column Header */}
              <div className="p-3.5 border-b border-slate-200 bg-white/80 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-xs font-bold text-slate-900">{stg.name}</h3>
                  <span className="text-[10px] text-slate-400 line-clamp-1">{stg.description}</span>
                </div>
                <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                  {columnOrders.length}
                </span>
              </div>

              {/* Order Cards Container */}
              <div className="p-2 space-y-2.5 overflow-y-auto flex-1">
                {columnOrders.length === 0 ? (
                  <div className="py-8 text-center text-slate-300 text-[11px] border border-dashed border-slate-200 rounded-xl">
                    Déposer une commande ici
                  </div>
                ) : (
                  columnOrders.map((ord) => {
                    const hasDebt = (ord.balanceOwed || 0) > 0;
                    const isCollectedWithDebt = hasDebt && (
                      ord.custodyState?.toLowerCase().includes('récupéré') ||
                      ord.tailoringStage === 'Livré & Récupéré'
                    );

                    return (
                      <div
                        key={ord.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, ord.id)}
                        className={`p-3.5 rounded-xl border bg-white shadow-sm hover:shadow cursor-grab active:cursor-grabbing transition-all space-y-2.5 ${
                          isCollectedWithDebt 
                            ? 'border-red-300 ring-1 ring-red-400/30' 
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* Card Top */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                            {ord.id}
                          </span>
                          <div className="flex items-center gap-1 text-slate-400">
                            <GripVertical className="w-3.5 h-3.5 text-slate-300" />
                          </div>
                        </div>

                        {/* Customer & Item */}
                        <div>
                          <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-1">
                            {ord.customerName}
                          </h4>
                          <p className="text-[11px] text-slate-600 line-clamp-1 mt-0.5">
                            {ord.items?.map(i => `${i.name} (${i.color || 'Couleur au choix'})`).join(', ')}
                          </p>
                        </div>

                        {/* Timeline & Remaining Days (Configurable by tailor) */}
                        <div className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" />
                            <strong>{ord.daysRemaining ?? 5} j restants</strong>
                          </span>
                          <button
                            onClick={() => {
                              setTimelineModalOrder(ord);
                              setDaysRemainingInput(ord.daysRemaining ?? 5);
                            }}
                            className="text-[10px] text-slate-900 underline hover:text-slate-600 font-medium"
                          >
                            Ajuster délai
                          </button>
                        </div>

                        {/* Debt Status */}
                        <div className="text-[10px] text-slate-500 flex items-center justify-between pt-1">
                          <span className="font-serif text-xs font-bold text-slate-900">
                            {Number(ord.totalAmount).toLocaleString()} {currency}
                          </span>

                          {isCollectedWithDebt ? (
                            <span className="font-bold text-red-700 bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              Doit {ord.balanceOwed.toLocaleString()} {currency}
                            </span>
                          ) : hasDebt ? (
                            <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              Reste : {ord.balanceOwed.toLocaleString()} {currency}
                            </span>
                          ) : (
                            <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Soldé
                            </span>
                          )}
                        </div>

                        {/* Card Bottom Actions */}
                        <div className="flex items-center justify-end gap-1 pt-1.5 border-t border-slate-100">
                          <button
                            onClick={() => handleManualNotifyWhatsApp(ord)}
                            title="Notifier client par WhatsApp"
                            className="p-1 rounded text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedReceiptOrder(ord)}
                            title="Générer Reçu Officiel & Facture PDF / WhatsApp"
                            className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                          >
                            <FileText className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setSelectedJobSlip(ord)}
                            title="Imprimer fiche de coupe"
                            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                          >
                            <Printer className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setPaymentModalOrder(ord);
                              setPaymentInput(ord.amountPaid);
                            }}
                            title="Règlement financier"
                            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteOrder(ord)}
                            title="Supprimer"
                            className="p-1 rounded text-slate-300 hover:text-red-500 hover:bg-slate-100"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                    );
                  })
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Accept Order Modal */}
      {acceptingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Accepter & Lancer la Confection
            </h3>
            <p className="text-xs text-slate-600">
              Commande N° <strong>{acceptingOrder.id}</strong> pour <strong>{acceptingOrder.customerName}</strong>.
            </p>

            <form onSubmit={handleConfirmAcceptOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">
                  Fixer le délai de confection selon votre disponibilité (jours restants) :
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  required
                  value={acceptDaysInput}
                  onChange={(e) => setAcceptDaysInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono text-sm"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Le client verra immédiatement la date estimée et le statut "Accepté" sur son espace web.
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAcceptingOrder(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium"
                >
                  Confirmer l'Acceptation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timeline / Days Adjustment Modal */}
      {timelineModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Ajuster le Délai de Confection
            </h3>
            <p className="text-xs text-slate-500">
              Réglez le nombre de jours restants selon votre temps libre actuel à l'atelier.
            </p>

            <form onSubmit={handleSaveTimeline} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Nombre de jours restants :</label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  required
                  value={daysRemainingInput}
                  onChange={(e) => setDaysRemainingInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setTimelineModalOrder(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium"
                >
                  Mettre à Jour
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Adjustment Modal */}
      {paymentModalOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Règlement Client ({paymentModalOrder.id})
            </h3>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span>Total Facturé :</span>
                <strong>{paymentModalOrder.totalAmount?.toLocaleString()} {currency}</strong>
              </div>
              <div className="flex justify-between">
                <span>Déjà Réglé :</span>
                <span>{paymentModalOrder.amountPaid?.toLocaleString()} {currency}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-semibold">
                <span>Reste à Payer :</span>
                <span>{paymentModalOrder.balanceOwed?.toLocaleString()} {currency}</span>
              </div>
            </div>

            <form onSubmit={handleSavePayment} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 block mb-1">Montant Total Reçu à ce jour ({currency}) :</label>
                <input
                  type="number"
                  required
                  value={paymentInput}
                  onChange={(e) => setPaymentInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalOrder(null)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Printable Job Slip */}
      {selectedJobSlip && (
        <JobCardModal
          order={selectedJobSlip}
          settings={settings}
          onClose={() => setSelectedJobSlip(null)}
        />
      )}

      {/* Printable Official Receipt & PDF Invoicing Modal */}
      {selectedReceiptOrder && (
        <AtelierReceiptModal
          order={selectedReceiptOrder}
          settings={settings}
          onClose={() => setSelectedReceiptOrder(null)}
        />
      )}

      {/* Custom Yes / No In-App Confirmation & Notification Modal */}
      <CustomConfirmModal
        isOpen={confirmModalConfig.isOpen}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        previewText={confirmModalConfig.previewText}
        confirmText={confirmModalConfig.confirmText}
        cancelText={confirmModalConfig.cancelText}
        variant={confirmModalConfig.variant}
        singleButton={confirmModalConfig.singleButton}
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={confirmModalConfig.onCancel}
      />

    </div>
  );
}
