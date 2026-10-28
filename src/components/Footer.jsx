import React from 'react';
import { Phone, MessageSquare, MapPin, Mail, Clock, ExternalLink } from 'lucide-react';

export default function Footer({ 
  settings, 
  onOpenCallModal, 
  onOpenMessageModal, 
  onOpenTracker, 
  onSelectCategory 
}) {
  const currentYear = new Date().getFullYear();
  const mapsUrl = settings?.mapsUrl || "https://www.google.com/maps?q=6.1628265380859375,1.2342439889907837&z=17&hl=en";

  return (
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 text-xs">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img 
                src="/tay-logo-highres.png" 
                alt="TAY Collections" 
                className="w-12 h-12 object-contain drop-shadow-sm" 
              />
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className="font-['Cinzel',serif] text-lg font-black tracking-wider text-slate-900 leading-none">
                    TAY
                  </span>
                  <span 
                    style={{ fontFamily: "'Alex Brush', cursive" }} 
                    className="text-lg text-amber-700 leading-none"
                  >
                    Collection
                  </span>
                </div>
                <span className="text-[8px] uppercase tracking-[0.24em] text-slate-400 font-semibold mt-0.5">
                  haute couture africaine
                </span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Maison de haute couture traditionnelle & moderne à Lomé, Togo. Grands Boubous d'Honneur, Kaftans sur mesure, ensembles Senator, bonnets Filas et parfumerie d'exception.
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
                <button onClick={onOpenCallModal} className="hover:text-slate-900 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-amber-600" />
                  <span>+228 90 60 38 01</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenCallModal} className="hover:text-slate-900 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>+228 93 17 20 01</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenMessageModal} className="hover:text-slate-900 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                  <span>Envoyer un Message Web</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTracker} className="hover:text-slate-900 flex items-center gap-1.5">
                  <span>Suivre une Commande en Cours</span>
                </button>
              </li>
              <li className="pt-1 text-[11px] text-slate-400">
                <span>Délai standard : 4 à 6 jours ouvrés</span>
              </li>
            </ul>
          </div>

          {/* Boutique Location */}
          <div className="space-y-2 text-[11px] text-slate-500">
            <h4 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Boutique & Atelier
            </h4>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <span>{settings?.address || 'Boulevard Jean-Paul II, Tokoin-Wuiti, Lomé, Togo'}</span>
            </div>
            
            <div className="pt-1">
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-[11px] font-semibold transition-colors"
                title="Ouvrir sur Google Maps"
              >
                <MapPin className="w-3 h-3 text-amber-600" />
                <span>Ouvrir sur Google Maps &rarr;</span>
              </a>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{settings?.email || 'contact@tay-collections.com'}</span>
            </div>
          </div>

        </div>

        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div>
            &copy; {currentYear} {settings?.atelierName || 'TAY COLLECTIONS'}. Tous droits réservés.
          </div>
          <div>
            Lomé, Togo &bull; Haute Couture Africaine &bull; Devises en Franc CFA (FCFA)
          </div>
        </div>
      </div>
    </footer>
  );
}
