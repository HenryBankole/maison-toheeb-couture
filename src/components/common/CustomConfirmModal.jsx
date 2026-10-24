import React from 'react';
import { X, MessageCircle, HelpCircle, Check, AlertCircle } from 'lucide-react';

export default function CustomConfirmModal({
  isOpen,
  title = "Notification Client",
  message = "Souhaitez-vous envoyer une notification au client ?",
  previewText = null,
  confirmText = "Oui, Notifier sur WhatsApp",
  cancelText = "Non, Ne pas Notifier",
  variant = "whatsapp", // 'whatsapp' | 'danger' | 'info'
  singleButton = false,
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onCancel}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5 my-6 animate-scaleUp cursor-default"
      >
        
        {/* Header with Icon */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${
              variant === 'whatsapp' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' 
                : variant === 'danger'
                ? 'bg-red-50 text-red-700 border border-red-100'
                : 'bg-slate-100 text-slate-800 border border-slate-200'
            }`}>
              {variant === 'whatsapp' ? (
                <MessageCircle className="w-5 h-5 fill-current" />
              ) : variant === 'danger' ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <HelpCircle className="w-5 h-5" />
              )}
            </div>

            <div>
              <h3 className="font-serif text-base font-bold text-slate-900 leading-snug">
                {title}
              </h3>
              <span className="text-[11px] text-slate-400">
                {singleButton ? 'Information Atelier' : 'Action requise • Question Oui / Non'}
              </span>
            </div>
          </div>

          <button 
            onClick={onCancel || onConfirm}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message body */}
        <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
          {message}
        </p>

        {/* Optional preview text of the message being sent */}
        {previewText && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-700 max-h-36 overflow-y-auto space-y-1">
            <div className="text-[10px] text-slate-400 font-sans uppercase font-semibold">
              Aperçu du message WhatsApp :
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-slate-600">
              {previewText}
            </pre>
          </div>
        )}

        {/* Yes / No buttons matching UI/UX */}
        <div className={`pt-2 border-t border-slate-100 ${singleButton ? 'flex justify-end' : 'grid grid-cols-2 gap-2.5'}`}>
          {!singleButton && cancelText && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-medium text-xs text-center transition-colors"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={onConfirm}
            className={`py-2.5 px-4 rounded-xl font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm ${
              singleButton ? 'w-auto min-w-[120px]' : 'w-full'
            } ${
              variant === 'whatsapp'
                ? 'bg-slate-900 hover:bg-slate-800 text-white'
                : variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            {variant === 'whatsapp' && <MessageCircle className="w-3.5 h-3.5" />}
            {variant === 'danger' && <AlertCircle className="w-3.5 h-3.5" />}
            {variant === 'info' && <Check className="w-3.5 h-3.5" />}
            <span>{confirmText}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
