import React, { useState } from 'react';
import { Settings, Save, Check, ExternalLink } from 'lucide-react';
import { api } from '../../services/api';

export default function AtelierSettings({ settings, onRefresh }) {
  const [form, setForm] = useState({
    atelierName: settings?.atelierName || 'TAY COLLECTIONS',
    tagline: settings?.tagline || "Haute Couture Africaine, Boubous d'Honneur, Kaftans, Prêt-à-Porter & Parfums Rares",
    phone: settings?.phone || '22890603801',
    phone2: settings?.phone2 || '22893172001',
    displayPhone: settings?.displayPhone || '+228 90 60 38 01 / +228 93 17 20 01',
    callPhone: settings?.callPhone || '+22890603801',
    email: settings?.email || 'contact@tay-collections.com',
    address: settings?.address || 'Boulevard Jean-Paul II, Tokoin-Wuiti, Lomé, Togo',
    mapsUrl: settings?.mapsUrl || 'https://www.google.com/maps?q=6.1628265380859375,1.2342439889907837&z=17&hl=en',
    currency: settings?.currency || 'FCFA',
    bankName: settings?.bankName || 'Ecobank / Coris Bank Togo',
    accountNumber: settings?.accountNumber || '010023456789',
    accountName: settings?.accountName || 'TAY Collections SARL',
    leadTimeDays: settings?.leadTimeDays || '4 à 6 Jours Ouvrés'
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    setSaveError(null);

    try {
      const sanitizedPhone = form.phone.replace(/[^0-9]/g, '');
      const payload = {
        ...form,
        phone: sanitizedPhone
      };

      await api.updateSettings(payload);
      setSavedSuccess(true);
      onRefresh();
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      setSaveError("Erreur lors de l'enregistrement : " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const testWhatsAppConnection = () => {
    const cleanPhone = form.phone.replace(/[^0-9]/g, '');
    const testMsg = `✨ Test de validation WhatsApp pour TAY Collections. Vos commandes et notifications de confection arriveront ici.`;
    window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(testMsg)}`, '_blank');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="font-serif text-lg font-semibold text-slate-900 flex items-center gap-2">
            <Settings className="w-4 h-4 text-slate-700" />
            <span>Paramètres de l'Atelier & Numéro de Réception</span>
          </h2>
          <p className="text-xs text-slate-500">
            Configurez le numéro WhatsApp qui recevra les commandes directes et les informations de paiement.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-emerald-200 animate-fadeIn">
            <Check className="w-3.5 h-3.5" />
            <span>Enregistré !</span>
          </span>
        )}
        {saveError && (
          <span className="px-3 py-1 rounded-lg bg-red-50 text-red-700 text-xs font-semibold flex items-center gap-1 border border-red-200 animate-fadeIn">
            <span>{saveError}</span>
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-4 text-xs">
        
        {/* WhatsApp Phone Card */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h3 className="font-serif text-sm font-bold text-slate-900">
            Numéro WhatsApp Destinataire des Commandes
          </h3>
          <p className="text-slate-500 text-[11px]">
            Chaque fois qu'un client clique sur "Commander" dans le Showroom, son récapitulatif complet et ses mesures atterrissent sur ce numéro.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">
                Numéro WhatsApp (Format international sans '+' ni espaces) *
              </label>
              <input
                type="text"
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="ex: 22997000000"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-slate-800"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Exemple Bénin/Togo : 22997000000, Sénégal : 22177000000</span>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">
                Téléphone Public Affiché (En-tête et pied de page)
              </label>
              <input
                type="text"
                value={form.displayPhone}
                onChange={(e) => setForm({ ...form, displayPhone: e.target.value })}
                placeholder="ex: +229 97 00 00 00"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 text-xs focus:outline-none focus:border-slate-800"
              />
            </div>
          </div>

          <div className="pt-1 flex justify-end">
            <button
              type="button"
              onClick={testWhatsAppConnection}
              className="py-1.5 px-3 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium text-xs flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Tester la réception WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Identity & Bank details */}
        <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
          <h3 className="font-serif text-sm font-bold text-slate-900">
            Identité de la Maison & Coordonnées Bancaires
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Nom de la Maison / Atelier</label>
              <input
                type="text"
                value={form.atelierName}
                onChange={(e) => setForm({ ...form, atelierName: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-serif"
              />
            </div>
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Devise</label>
              <input
                type="text"
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value })}
                placeholder="FCFA"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-slate-600 block mb-1 font-medium">Adresse physique de l'Atelier</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] text-slate-500 font-medium block mb-2">
              Coordonnées bancaires pour virements clients :
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-slate-500 block mb-0.5">Banque</label>
                <input
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setForm({ ...form, bankName: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 text-xs"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">N° Compte / RIB</label>
                <input
                  type="text"
                  value={form.accountNumber}
                  onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-500 block mb-0.5">Titulaire</label>
                <input
                  type="text"
                  value={form.accountName}
                  onChange={(e) => setForm({ ...form, accountName: e.target.value })}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="py-2.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Enregistrement...' : 'Enregistrer les Paramètres'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
