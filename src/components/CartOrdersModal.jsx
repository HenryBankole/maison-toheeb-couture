import React, { useState } from 'react';
import { X, ShoppingBag, Clock, Trash2, ArrowRight, CheckCircle2, MessageCircle, Calendar } from 'lucide-react';

export default function CartOrdersModal({ 
  cartItems, 
  userOrders = [], 
  settings, 
  onRemoveFromCart, 
  onCheckoutCart, 
  onTrackOrder, 
  onClose 
}) {
  const [activeTab, setActiveTab] = useState('cart'); // 'cart' | 'orders'
  const currency = settings?.currency || 'FCFA';

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  // Maximum turnaround days among items in cart
  const maxTurnaroundDays = cartItems.reduce((max, item) => {
    return Math.max(max, Number(item.turnaroundDays) || 5);
  }, 4);

  // Calculate estimated completion date if worked on instantly
  const calculateEstimatedDate = (days) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const estimatedDeliveryText = calculateEstimatedDate(maxTurnaroundDays);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-xl space-y-5 my-6 cursor-default"
      >
        
        {/* Header with Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('cart')}
              className={`text-sm font-serif font-bold pb-1 transition-colors relative ${
                activeTab === 'cart' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>Mon Panier ({cartItems.length})</span>
              {activeTab === 'cart' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />}
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`text-sm font-serif font-bold pb-1 transition-colors relative ${
                activeTab === 'orders' ? 'text-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              <span>Mes Commandes en Cours ({userOrders.length})</span>
              {activeTab === 'orders' && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />}
            </button>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab 1: Mon Panier */}
        {activeTab === 'cart' && (
          <div className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <ShoppingBag className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Votre panier est actuellement vide.</p>
                <p className="text-[11px] text-slate-400">Explorez le Showroom pour ajouter des pièces sur mesure ou du parfum.</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                        <div>
                          <h4 className="font-serif text-xs font-semibold text-slate-900 line-clamp-1">{item.name}</h4>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {Number(item.price).toLocaleString()} {currency} &bull; Qte: {item.quantity || 1}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => onRemoveFromCart(idx)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Turnaround Time Frame & Delivery Calculation */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-medium text-slate-900">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>Délai de confection garanti :</span>
                    <strong className="text-slate-900">{maxTurnaroundDays} jours ouvrés</strong>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Si les mesures et le règlement/acompte sont validés dès aujourd'hui, votre tenue sera confectionnée et prête le :
                  </p>
                  <div className="flex items-center gap-1.5 font-semibold text-slate-800 text-xs">
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span className="capitalize">{estimatedDeliveryText}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block uppercase">Total Estimé</span>
                    <span className="text-lg font-serif font-bold text-slate-900">
                      {totalPrice.toLocaleString()} {currency}
                    </span>
                  </div>

                  <button
                    onClick={onCheckoutCart}
                    className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-2 transition-colors"
                  >
                    <span>Valider & Commander</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Tab 2: Mes Commandes en Cours */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {userOrders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Vous n'avez pas encore passé de commande récente.</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {userOrders.map((ord) => (
                  <div key={ord.id} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-slate-900">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-medium">
                        {ord.tailoringStage}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 line-clamp-1">
                      {ord.items?.map(i => i.name).join(', ')}
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <span>Total : {Number(ord.totalAmount).toLocaleString()} {currency}</span>
                      <button
                        onClick={() => {
                          onClose();
                          onTrackOrder(ord.id);
                        }}
                        className="text-slate-900 font-semibold hover:underline"
                      >
                        Suivre en direct &rarr;
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
