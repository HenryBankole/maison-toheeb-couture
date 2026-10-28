import React, { useState } from 'react';
import { MessageSquare, Phone, MessageCircle, Trash2, Clock, User, CheckCircle } from 'lucide-react';
import { api } from '../../services/api';
import CustomConfirmModal from '../common/CustomConfirmModal';

export default function MessagesInbox({ messages, onRefresh }) {
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Oui, Supprimer',
    cancelText: 'Non, Annuler',
    variant: 'danger',
    singleButton: false,
    onConfirm: null,
    onCancel: null
  });

  const handleDelete = (msg) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer le Message",
      message: `Voulez-vous supprimer ce message reçu de ${msg.senderName} ?`,
      previewText: msg.content,
      confirmText: "Oui, Supprimer",
      cancelText: "Non, Conserver",
      variant: "danger",
      singleButton: false,
      onConfirm: async () => {
        try {
          await api.deleteMessage(msg.id);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          onRefresh();
        } catch (err) {
          setConfirmModal({
            isOpen: true,
            title: "Erreur",
            message: "Impossible de supprimer ce message : " + (err.message || ""),
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

  return (
    <div className="space-y-4 animate-fadeIn">
      
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between">
        <div>
          <h2 className="font-serif text-lg font-semibold text-slate-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-slate-700" />
            <span>Messages Reçus depuis le Site Web</span>
          </h2>
          <p className="text-xs text-slate-500">
            Messages et demandes envoyés directement par les clients via le formulaire en ligne.
          </p>
        </div>
        <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          {messages.length} message(s)
        </span>
      </div>

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="py-16 text-center text-slate-400 bg-white rounded-xl border border-slate-200">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-xs">Aucun message reçu pour le moment.</p>
          </div>
        ) : (
          messages.map((msg) => {
            const cleanPhone = (msg.phone || '').replace(/[^0-9]/g, '');

            return (
              <div 
                key={msg.id} 
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif text-sm font-bold text-slate-900">{msg.senderName}</h4>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {msg.date}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono mt-0.5">
                      {msg.phone}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs flex items-center gap-1 transition-colors"
                      title="Appeler le client"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>
                    <a
                      href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Bonjour ${msg.senderName}, suite à votre message sur notre site TAY Collections :`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs flex items-center gap-1 transition-colors"
                      title="Répondre sur WhatsApp"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => handleDelete(msg)}
                      className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-slate-100 transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 leading-relaxed border border-slate-100">
                  {msg.content}
                </div>
              </div>
            );
          })
        )}
      </div>

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
