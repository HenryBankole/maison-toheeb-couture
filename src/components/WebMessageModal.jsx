import React, { useState } from 'react';
import { X, Send, MessageSquare, Check, User, Phone } from 'lucide-react';
import { api } from '../services/api';

export default function WebMessageModal({ onClose, onMessageSent }) {
  const [senderName, setSenderName] = useState('');
  const [phone, setPhone] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!senderName || !phone || !content) return;

    setSubmitting(true);
    try {
      await api.sendMessage({ senderName, phone, content });
      setSent(true);
      if (onMessageSent) onMessageSent();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setErrorMessage("Erreur lors de l'envoi du message : " + (err.message || ''));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4 cursor-default"
      >
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-serif text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-slate-700" />
            <span>Écrire à l'Atelier</span>
          </h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
              <Check className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-base font-bold text-slate-900">Message Transmis avec Succès</h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Votre demande a été envoyée au maître tailleur. Nous vous recontacterons dans les plus brefs délais.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {errorMessage && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {errorMessage}
              </div>
            )}
            <div>
              <label className="text-slate-600 block mb-1 font-medium">Votre Nom Complet *</label>
              <input
                type="text"
                required
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="ex: M. Abdoulaye Touré"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Numéro de Téléphone / WhatsApp *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="ex: +229 97 12 34 56"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-medium">Votre Message ou Question *</label>
              <textarea
                rows={4}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Précisez votre demande : confection sur mesure, disponibilité d'un tissu, rendez-vous d'essayage..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium flex items-center gap-1.5 disabled:opacity-50 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Envoi...' : 'Envoyer le Message'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
