import React, { useState } from 'react';
import { 
  Scissors, 
  Package, 
  User, 
  Settings, 
  ShoppingBag, 
  MessageSquare, 
  Store, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Layers,
  Copy,
  ExternalLink
} from 'lucide-react';
import OrderKanban from '../components/dashboard/OrderKanban';
import CatalogManager from '../components/dashboard/CatalogManager';
import ShowroomMediaManager from '../components/dashboard/ShowroomMediaManager';
import StockManager from '../components/dashboard/StockManager';
import CustomerManager from '../components/dashboard/CustomerManager';
import MessagesInbox from '../components/dashboard/MessagesInbox';
import AtelierSettings from '../components/dashboard/AtelierSettings';

export default function DashboardView({ 
  orders, 
  stages, 
  products, 
  customers, 
  fabrics, 
  categories = [],
  heroSlides = [],
  messages = [], 
  settings, 
  analytics, 
  onRefresh, 
  onSwitchToStorefront,
  onOpenCreateOrder 
}) {
  const [activeTab, setActiveTab] = useState('kanban'); // 'kanban' | 'catalog' | 'media' | 'stock' | 'customers' | 'messages' | 'settings'
  const currency = settings?.currency || 'FCFA';

  const debtAlertCount = customers.filter(c => (c.balanceOwed || 0) > 0 && c.custodyStatus?.toLowerCase().includes('récupéré')).length;
  const unreadMessagesCount = messages.filter(m => m.status === 'non-lu').length;

  const tabs = [
    { id: 'kanban', label: 'Kanban Confections', icon: Scissors, badge: orders.length },
    { id: 'catalog', label: 'Modèles & Prix', icon: ShoppingBag, badge: products.length },
    { id: 'media', label: 'Bannières & Catégories', icon: Layers, badge: categories.length },
    { id: 'stock', label: 'Stocks de Tissus', icon: Package },
    { id: 'customers', label: 'Clients & Créances', icon: User, alertBadge: debtAlertCount },
    { id: 'messages', label: 'Messages Web', icon: MessageSquare, badge: messages.length, unread: unreadMessagesCount },
    { id: 'settings', label: 'Configuration & WhatsApp', icon: Settings },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Minimalist Sub-Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="font-serif text-2xl font-bold text-slate-900">
            Espace Maître Tailleur & Gestion Atelier
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Suivi de confection par glisser-déposer, réapprovisionnement de tissus et relances créances.
          </p>
        </div>

        {/* Financial recap pills */}
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block text-[10px] uppercase">Encaissé</span>
            <span className="font-mono font-bold text-emerald-700">
              {analytics?.totalCollected?.toLocaleString() || '0'} {currency}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white">
            <span className="text-slate-400 block text-[10px] uppercase">Solde Dû</span>
            <span className="font-mono font-bold text-amber-700">
              {analytics?.totalDebtsOwed?.toLocaleString() || '0'} {currency}
            </span>
          </div>

          <button
            onClick={onSwitchToStorefront}
            className="py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium flex items-center gap-1.5 transition-colors"
          >
            <Store className="w-3.5 h-3.5" />
            <span>Showroom</span>
          </button>
        </div>
      </div>

      {/* Live Preview Share Banner */}
      {settings?.previewUrl && (
        <div className="p-3.5 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
          <div className="flex items-center gap-3">
            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0 ring-4 ring-emerald-100" />
            <div>
              <div className="flex items-center gap-2">
                <strong className="text-emerald-950 font-semibold text-xs">
                  Lien de Prévisualisation Client en Direct
                </strong>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.2 rounded-full border border-emerald-300">
                  En Ligne &bull; Accès Public Sécurisé
                </span>
              </div>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                Envoyez ce lien unique à votre client. Toutes vos modifications (tarifs, photos, étapes de confection) y sont synchronisées instantanément.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                navigator.clipboard.writeText(settings.previewUrl);
                alert('Lien de prévisualisation live copié dans le presse-papier !\n\n' + settings.previewUrl);
              }}
              className="py-1.5 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copier le Lien</span>
            </button>

            <a
              href={settings.previewUrl}
              target="_blank"
              rel="noreferrer"
              className="py-1.5 px-3 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-medium text-xs flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ouvrir</span>
            </a>
          </div>
        </div>
      )}

      {/* Minimal Navigation Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>

              {tab.alertBadge > 0 ? (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                  {tab.alertBadge} dette
                </span>
              ) : tab.badge !== undefined ? (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'kanban' && (
          <OrderKanban
            orders={orders}
            stages={stages}
            settings={settings}
            onRefresh={onRefresh}
            onOpenCreateOrder={onOpenCreateOrder}
          />
        )}

        {activeTab === 'catalog' && (
          <CatalogManager
            products={products}
            categories={categories}
            settings={settings}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'media' && (
          <ShowroomMediaManager
            categories={categories}
            heroSlides={heroSlides}
            settings={settings}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'stock' && (
          <StockManager
            fabrics={fabrics}
            products={products}
            settings={settings}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'customers' && (
          <CustomerManager
            customers={customers}
            orders={orders}
            settings={settings}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'messages' && (
          <MessagesInbox
            messages={messages}
            onRefresh={onRefresh}
          />
        )}

        {activeTab === 'settings' && (
          <AtelierSettings
            settings={settings}
            onRefresh={onRefresh}
          />
        )}
      </div>

    </div>
  );
}
