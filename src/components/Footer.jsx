import React from 'react';
import { Scissors, Phone, MessageSquare, MapPin, Mail, Clock } from 'lucide-react';

export default function Footer({ 
  settings, 
  onOpenCallModal, 
  onOpenMessageModal, 
  onOpenTracker, 
  onSelectCategory 
}) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-900 font-serif font-bold text-base">
              <Scissors className="w-4 h-4" />
              <span>{settings?.atelierName || 'MAISON TOHEEB'}</span>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Maison de haute couture traditionnelle d'Afrique de l'Ouest. Grands Boubous d'Honneur, Kaftans sur mesure, bonnets Filas et créations de parfumerie orientale.
            </p>
          </div>

          {/* Showroom Collections */}
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Le Showroom
            </h4>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li>
                <button onClick={() => onSelectCategory("Boubous d'Honneur & Senator")} className="hover:text-slate-900">
                  Boubous d'Honneur & Senator
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("Kaftans Sur Mesure")} className="hover:text-slate-900">
                  Kaftans & Bazin Riche
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("Bonnets & Filas")} className="hover:text-slate-900">
                  Bonnets & Filas Aso-Oke
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory("Parfums & Ouds")} className="hover:text-slate-900">
                  Extraits de Oud & Attars
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Direct */}
          <div>
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Services & Contact
            </h4>
            <ul className="space-y-2 text-slate-500 text-xs">
              <li>
                <button onClick={onOpenCallModal} className="hover:text-slate-900 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  <span>Appeler le Maître Tailleur</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenMessageModal} className="hover:text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Envoyer un Message Web</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-slate-900">
                  Suivre une Commande en Cours
                </button>
              </li>
              <li>
                <span>Délai standard : 4 à 6 jours ouvrés</span>
              </li>
            </ul>
          </div>

          {/* Atelier Location */}
          <div className="space-y-2 text-[11px] text-slate-500">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Atelier
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>{settings?.address || 'Boulevard de la Marina, Cotonou'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{settings?.displayPhone || '+229 97 00 00 00'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{settings?.email || 'contact@toheeb-couture.com'}</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            &copy; {currentYear} {settings?.atelierName || 'MAISON TOHEEB'}. Tous droits réservés.
          </div>
          <div>
            Confection artisanale de prestige &bull; Devises en Franc CFA (FCFA)
          </div>
        </div>
      </div>
    </footer>
  );
}
