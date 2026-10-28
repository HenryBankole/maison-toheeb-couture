import React, { useState } from 'react';
import { 
  User, 
  Search, 
  Plus, 
  MessageCircle, 
  Ruler, 
  DollarSign, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Phone, 
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import CustomConfirmModal from '../common/CustomConfirmModal';

export default function CustomerManager({ customers, orders, settings, onRefresh }) {
  const currency = settings?.currency || 'FCFA';

  const [search, setSearch] = useState('');
  const [filterCustody, setFilterCustody] = useState('All');
  const [selectedMeasurementCust, setSelectedMeasurementCust] = useState(null);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [editingCust, setEditingCust] = useState(null);
  const [customerError, setCustomerError] = useState(null);

  // Custom in-app Confirmation & Notification Modal (replaces browser popups)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    previewText: null,
    confirmText: 'Oui, Confirmer',
    cancelText: 'Non, Annuler',
    variant: 'whatsapp',
    singleButton: false,
    onConfirm: null,
    onCancel: null
  });

  const [custForm, setCustForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    totalBilled: 0,
    totalPaid: 0,
    balanceOwed: 0,
    custodyStatus: 'Livré & Soldé',
    notes: '',
    measurements: {
      neck: 42,
      chest: 106,
      shoulder: 48,
      sleeveLength: 64,
      kaftanLength: 135,
      waist: 90,
      trouserLength: 102,
      capSize: 58,
      unit: 'cm'
    }
  });

  const filteredCustomers = customers.filter(c => {
    const matchesSearch = !search || 
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      (c.address && c.address.toLowerCase().includes(search.toLowerCase()));

    let matchesCustody = true;
    if (filterCustody === 'OwesDebt') {
      matchesCustody = (c.balanceOwed || 0) > 0;
    } else if (filterCustody === 'CollectedOwes') {
      matchesCustody = (c.balanceOwed || 0) > 0 && c.custodyStatus?.toLowerCase().includes('récupéré');
    } else if (filterCustody === 'Cleared') {
      matchesCustody = (c.balanceOwed || 0) <= 0;
    }

    return matchesSearch && matchesCustody;
  });

  const handleSendReminder = (cust) => {
    const cleanPhone = cust.whatsapp || cust.phone.replace(/[^0-9]/g, '');
    let msg = `Bonjour ${cust.name} ! ✨\n\n`;
    msg += `Message de courtoisie de *${settings?.atelierName || 'TAY COLLECTIONS'}* concernant votre relevé de compte atelier.\n\n`;
    msg += `📊 *État de compte :*\n`;
    msg += `• Total Facturé : ${Number(cust.totalBilled || 0).toLocaleString()} ${currency}\n`;
    msg += `• Acomptes reçus : ${Number(cust.totalPaid || 0).toLocaleString()} ${currency}\n`;
    msg += `• *Solde restant à solder : ${Number(cust.balanceOwed || 0).toLocaleString()} ${currency}*\n\n`;
    msg += `🏦 *Coordonnées bancaires / Virement :*\n`;
    msg += `Banque : ${settings?.bankName || 'BOA / Ecobank'}\n`;
    msg += `N° de Compte : *${settings?.accountNumber || '010023456789'}*\n`;
    msg += `Titulaire : ${settings?.accountName || 'TAY Collections SARL'}\n\n`;
    msg += `Merci de nous faire parvenir le reçu de virement une fois effectué. Nous vous remercions pour votre précieuse confiance !`;

    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;

    setConfirmModal({
      isOpen: true,
      title: "Relancer le Client sur WhatsApp",
      message: `Souhaitez-vous envoyer le relevé de créance officiel (${Number(cust.balanceOwed || 0).toLocaleString()} ${currency}) à ${cust.name} ?`,
      previewText: msg,
      confirmText: "Oui, Envoyer sur WhatsApp",
      cancelText: "Non, Annuler",
      variant: "whatsapp",
      singleButton: false,
      onConfirm: () => {
        window.open(url, '_blank');
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleOpenAdd = () => {
    setCustomerError(null);
    setEditingCust(null);
    setCustForm({
      name: '',
      phone: '',
      email: '',
      address: '',
      totalBilled: 0,
      totalPaid: 0,
      balanceOwed: 0,
      custodyStatus: 'Tissu à l’Atelier (En cours)',
      notes: '',
      measurements: {
        neck: 42,
        chest: 106,
        shoulder: 48,
        sleeveLength: 64,
        kaftanLength: 135,
        waist: 90,
        trouserLength: 102,
        capSize: 58,
        unit: 'cm'
      }
    });
    setIsEditingCustomer(true);
  };

  const handleOpenEdit = (cust) => {
    setCustomerError(null);
    setEditingCust(cust);
    setCustForm({
      name: cust.name,
      phone: cust.phone,
      email: cust.email || '',
      address: cust.address || '',
      totalBilled: cust.totalBilled || 0,
      totalPaid: cust.totalPaid || 0,
      balanceOwed: cust.balanceOwed || 0,
      custodyStatus: cust.custodyStatus || 'Livré & Soldé',
      notes: cust.notes || '',
      measurements: cust.measurements || { unit: 'cm' }
    });
    setIsEditingCustomer(true);
  };

  const handleSaveCustomer = async (e) => {
    e.preventDefault();
    setCustomerError(null);
    try {
      const billed = Number(custForm.totalBilled) || 0;
      const paid = Number(custForm.totalPaid) || 0;
      const owed = Math.max(0, billed - paid);

      const payload = {
        ...custForm,
        totalBilled: billed,
        totalPaid: paid,
        balanceOwed: owed,
        whatsapp: custForm.phone.replace(/[^0-9]/g, '')
      };

      if (editingCust) {
        await api.updateCustomer(editingCust.id, payload);
      } else {
        await api.createCustomer(payload);
      }
      setIsEditingCustomer(false);
      onRefresh();
    } catch (err) {
      setCustomerError("Erreur lors de l'enregistrement du client : " + (err.message || ''));
    }
  };

  const handleDelete = (cust) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer du Fichier Client",
      message: `Êtes-vous sûr de vouloir supprimer définitivement ${cust.name} de votre répertoire client ?`,
      previewText: null,
      confirmText: "Oui, Supprimer",
      cancelText: "Non, Conserver",
      variant: "danger",
      singleButton: false,
      onConfirm: async () => {
        try {
          await api.deleteCustomer(cust.id);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          onRefresh();
        } catch (err) {
          setConfirmModal({
            isOpen: true,
            title: "Erreur",
            message: "Impossible de supprimer ce client.",
            confirmText: "Fermer",
            variant: "danger",
            singleButton: true,
            onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
            onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
          });
        }
      },
      onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleSaveMeasurements = async (e) => {
    e.preventDefault();
    if (!selectedMeasurementCust) return;

    try {
      await api.updateCustomer(selectedMeasurementCust.id, {
        measurements: selectedMeasurementCust.measurements
      });
      setSelectedMeasurementCust(null);
      onRefresh();
    } catch (err) {
      setConfirmModal({
        isOpen: true,
        title: "Erreur",
        message: "Erreur lors de l'enregistrement des mesures.",
        confirmText: "Fermer",
        variant: "danger",
        singleButton: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="font-serif text-lg font-semibold text-slate-900">
            Fichier Clients & Carnet des Créances
          </h2>
          <p className="text-xs text-slate-500">
            Suivi des paiements, clients ayant retiré leurs habits avec solde impayé, et fiches de mesures corporelles.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-1.5 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau Client</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterCustody('All')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterCustody === 'All' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tous ({customers.length})
          </button>
          <button
            onClick={() => setFilterCustody('CollectedOwes')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1 ${
              filterCustody === 'CollectedOwes' 
                ? 'bg-red-600 text-white' 
                : 'text-red-600 bg-red-50 hover:bg-red-100'
            }`}
          >
            <AlertTriangle className="w-3 h-3" />
            <span>Habits Récupérés & Reste Solde</span>
          </button>
          <button
            onClick={() => setFilterCustody('OwesDebt')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterCustody === 'OwesDebt' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Soldes Restants
          </button>
          <button
            onClick={() => setFilterCustody('Cleared')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              filterCustody === 'Cleared' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Soldés
          </button>
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher nom, téléphone..."
            className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCustomers.map((c) => {
          const hasDebt = (c.balanceOwed || 0) > 0;
          const isCollectedWithDebt = hasDebt && c.custodyStatus?.toLowerCase().includes('récupéré');

          return (
            <div
              key={c.id}
              className={`p-4 rounded-xl border bg-white flex flex-col justify-between space-y-3 transition-colors ${
                isCollectedWithDebt 
                  ? 'border-red-300 ring-1 ring-red-400/30' 
                  : 'border-slate-200'
              }`}
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-serif text-sm font-bold text-slate-900">{c.name}</h3>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">{c.phone}</div>
                  </div>

                  {isCollectedWithDebt ? (
                    <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-red-50 text-red-700 border border-red-200 shrink-0">
                      Récupéré &bull; Doit {c.balanceOwed.toLocaleString()} {currency}
                    </span>
                  ) : hasDebt ? (
                    <span className="px-2 py-0.5 text-[9px] font-semibold uppercase rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      Reste à Payer
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 text-[9px] font-semibold uppercase rounded bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                      Soldé
                    </span>
                  )}
                </div>

                {/* Ledger mini matrix */}
                <div className="grid grid-cols-3 gap-1 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center text-xs">
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Facturé</span>
                    <span className="font-mono text-xs font-semibold text-slate-800">
                      {Number(c.totalBilled || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Réglé</span>
                    <span className="font-mono text-xs font-semibold text-emerald-700">
                      {Number(c.totalPaid || 0).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-[9px] text-slate-400 block uppercase">Reste</span>
                    <span className={`font-mono text-xs font-bold ${hasDebt ? 'text-amber-700' : 'text-slate-400'}`}>
                      {Number(c.balanceOwed || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-100 flex items-center justify-between">
                  <span>Statut : <strong>{c.custodyStatus}</strong></span>
                  <span className="text-slate-400">{c.totalOrders || 1} cde(s)</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => setSelectedMeasurementCust(c)}
                  className="py-1 px-2.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium flex items-center gap-1.5"
                >
                  <Ruler className="w-3.5 h-3.5 text-slate-500" />
                  <span>Fiche Mesures</span>
                </button>

                <div className="flex items-center gap-1">
                  {hasDebt && (
                    <button
                      onClick={() => handleSendReminder(c)}
                      className="py-1 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1"
                      title="Envoyer relance WhatsApp"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>Relancer</span>
                    </button>
                  )}
                  <button onClick={() => handleOpenEdit(c)} className="p-1 text-slate-400 hover:text-slate-900 rounded">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(c)} className="p-1 text-slate-300 hover:text-red-600 rounded">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Measurement Modal */}
      {selectedMeasurementCust && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-900">
                  Fiche de Mesures : {selectedMeasurementCust.name}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">Unité : Centimètres (cm) &bull; Ruban Métrique</span>
              </div>
              <button onClick={() => setSelectedMeasurementCust(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMeasurements} className="space-y-4">
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { l: 'Col (cm)', k: 'neck' },
                  { l: 'Poitrine (cm)', k: 'chest' },
                  { l: 'Épaules (cm)', k: 'shoulder' },
                  { l: 'Manches (cm)', k: 'sleeveLength' },
                  { l: 'Long. Boubou (cm)', k: 'kaftanLength' },
                  { l: 'Taille (cm)', k: 'waist' },
                  { l: 'Pantalon (cm)', k: 'trouserLength' },
                  { l: 'Tour Tête (cm)', k: 'capSize' }
                ].map(f => (
                  <div key={f.k}>
                    <label className="text-[10px] text-slate-500 block mb-1 font-medium">{f.l}</label>
                    <input
                      type="number"
                      step="0.5"
                      value={selectedMeasurementCust.measurements?.[f.k] || ''}
                      onChange={(e) => {
                        setSelectedMeasurementCust({
                          ...selectedMeasurementCust,
                          measurements: {
                            ...selectedMeasurementCust.measurements,
                            [f.k]: e.target.value
                          }
                        });
                      }}
                      className="w-full px-2 py-1 rounded border border-slate-200 font-mono text-center text-xs"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedMeasurementCust(null)}
                  className="px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 text-xs"
                >
                  Fermer
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs"
                >
                  Sauvegarder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add / Edit Customer Modal */}
      {isEditingCustomer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                {editingCust ? 'Modifier Client' : 'Nouveau Profil Client'}
              </h3>
              <button onClick={() => setIsEditingCustomer(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="space-y-3 text-xs">
              {customerError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{customerError}</span>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Nom Complet *</label>
                  <input
                    type="text"
                    required
                    value={custForm.name}
                    onChange={(e) => setCustForm({ ...custForm, name: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Téléphone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={custForm.phone}
                    onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Adresse ou Ville</label>
                <input
                  type="text"
                  value={custForm.address}
                  onChange={(e) => setCustForm({ ...custForm, address: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Total Facturé ({currency})</label>
                  <input
                    type="number"
                    value={custForm.totalBilled}
                    onChange={(e) => setCustForm({ ...custForm, totalBilled: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Total Réglé ({currency})</label>
                  <input
                    type="number"
                    value={custForm.totalPaid}
                    onChange={(e) => setCustForm({ ...custForm, totalPaid: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Statut Garde & Tissu</label>
                <select
                  value={custForm.custodyStatus}
                  onChange={(e) => setCustForm({ ...custForm, custodyStatus: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900"
                >
                  <option value="Tissu à l’Atelier (En cours)">Tissu à l’Atelier (En cours)</option>
                  <option value="Vêtement Prêt au Retrait">Vêtement Prêt au Retrait</option>
                  <option value="Vêtement Récupéré - Reste Solde à Payer">⚠️ Vêtement Récupéré - Reste Solde à Payer</option>
                  <option value="Livré & Soldé">Livré & Soldé</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditingCustomer(false)}
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

      {/* Custom Confirmation Modal */}
      <CustomConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        previewText={confirmModal.previewText}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        variant={confirmModal.variant}
        singleButton={confirmModal.singleButton}
        onConfirm={confirmModal.onConfirm}
        onCancel={confirmModal.onCancel}
      />

    </div>
  );
}
