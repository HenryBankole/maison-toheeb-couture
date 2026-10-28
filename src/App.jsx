import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import StorefrontView from './views/StorefrontView';
import DashboardView from './views/DashboardView';
import QuickOrderModal from './components/QuickOrderModal';
import ProductDetailModal from './components/ProductDetailModal';
import OrderTrackerModal from './components/OrderTrackerModal';
import OrderDetailTracker from './components/OrderDetailTracker';
import CallTailorModal from './components/CallTailorModal';
import WebMessageModal from './components/WebMessageModal';
import CartOrdersModal from './components/CartOrdersModal';
import { api } from './services/api';

export default function App() {
  const [activeView, setActiveView] = useState('store'); // 'store' (Showroom) | 'dashboard'
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [storeSection, setStoreSection] = useState('bespoke'); // 'bespoke' | 'ready_to_wear'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals state
  const [quickOrderProduct, setQuickOrderProduct] = useState(null);
  const [detailProduct, setDetailProduct] = useState(null);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [isTrackerOpen, setIsTrackerOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isCreateOrderModalOpen, setIsCreateOrderModalOpen] = useState(false);

  // Cart & Placed Orders (User side)
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('tay_cart') || localStorage.getItem('toheeb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [userOrders, setUserOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('tay_user_orders') || localStorage.getItem('toheeb_user_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Backend Data
  const [settings, setSettings] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stages, setStages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [fabrics, setFabrics] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem('tay_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync user orders to localStorage
  useEffect(() => {
    localStorage.setItem('tay_user_orders', JSON.stringify(userOrders));
  }, [userOrders]);

  // Always reset scroll to top when switching between Atelier and Showroom
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [activeView]);

  // Fetch all atelier data
  const fetchData = async () => {
    try {
      const [
        settingsData,
        productsData,
        categoriesData,
        heroSlidesData,
        ordersData,
        stagesData,
        customersData,
        fabricsData,
        messagesData,
        analyticsData
      ] = await Promise.all([
        api.getSettings(),
        api.getProducts(),
        api.getCategories(),
        api.getHeroSlides(),
        api.getOrders(),
        api.getStages(),
        api.getCustomers(),
        api.getFabrics(),
        api.getMessages(),
        api.getAnalytics()
      ]);

      setSettings(settingsData);
      setProducts(productsData);
      setCategories(categoriesData || []);
      setHeroSlides(heroSlidesData || []);
      setOrders(ordersData);
      setStages(stagesData);
      setCustomers(customersData);
      setFabrics(fabricsData);
      setMessages(messagesData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Erreur chargement données atelier :', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cart actions
  const handleAddToCart = (product) => {
    setCartItems(prev => [...prev, { ...product, quantity: 1 }]);
    setIsCartModalOpen(true);
  };

  const handleRemoveFromCart = (index) => {
    setCartItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheckoutCart = () => {
    if (cartItems.length === 0) return;
    setIsCartModalOpen(false);
    setQuickOrderProduct(cartItems[0]);
  };

  const handleOrderCreated = (order) => {
    setUserOrders(prev => [order, ...prev]);
    // Clear item from cart if matched
    setCartItems([]);
    fetchData();
  };

  // Walk-in order form state for dashboard
  const [walkinForm, setWalkinForm] = useState({
    customerName: '',
    customerPhone: '',
    itemName: "Grand Boubou d'Honneur 'Présidentiel' Émeraude",
    quantity: 1,
    totalAmount: 185000,
    amountPaid: 100000,
    fabricStatus: 'Tissu fourni par le client',
    tailoringStage: 'Tissu Reçu & Mesures',
    turnaroundDays: 5,
    assignedArtisan: 'Maître Tailleur Rasheed',
    notes: ''
  });

  const [createOrderError, setCreateOrderError] = useState(null);

  const handleCreateWalkinOrder = async (e) => {
    e.preventDefault();
    setCreateOrderError(null);
    try {
      await api.createOrder({
        customerName: walkinForm.customerName,
        customerPhone: walkinForm.customerPhone,
        items: [{ name: walkinForm.itemName, qty: Number(walkinForm.quantity) || 1, price: Number(walkinForm.totalAmount) }],
        totalAmount: Number(walkinForm.totalAmount),
        amountPaid: Number(walkinForm.amountPaid),
        fabricStatus: walkinForm.fabricStatus,
        tailoringStage: walkinForm.tailoringStage,
        turnaroundDays: Number(walkinForm.turnaroundDays) || 5,
        assignedArtisan: walkinForm.assignedArtisan,
        notes: walkinForm.notes
      });
      setIsCreateOrderModalOpen(false);
      fetchData();
    } catch (err) {
      setCreateOrderError("Erreur lors de la création de la commande : " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-800">
      
      {/* Navigation Header */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        storeSection={storeSection}
        setStoreSection={setStoreSection}
        cartCount={cartItems.length}
        onOpenCallModal={() => setIsCallModalOpen(true)}
        onOpenMessageModal={() => setIsMessageModalOpen(true)}
        onOpenCartModal={() => setIsCartModalOpen(true)}
        onOpenTrackerModal={() => setIsTrackerOpen(true)}
        settings={settings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full">
        {loading ? (
          <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 py-16">
            <div className="w-8 h-8 rounded-full border-2 border-slate-200 border-t-slate-800 animate-spin" />
            <p className="font-serif text-xs text-slate-500 tracking-wider uppercase">
              Chargement du Showroom...
            </p>
          </div>
        ) : (
          <>
            {activeView === 'store' && (
              <StorefrontView
                products={products}
                categories={categories}
                heroSlides={heroSlides}
                settings={settings}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                storeSection={storeSection}
                setStoreSection={setStoreSection}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onQuickOrder={(prod) => setQuickOrderProduct(prod)}
                onAddToCart={handleAddToCart}
                onViewDetails={(prod) => setDetailProduct(prod)}
                onOpenCallModal={() => setIsCallModalOpen(true)}
                onOpenMessageModal={() => setIsMessageModalOpen(true)}
              />
            )}

            {activeView === 'dashboard' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <DashboardView
                  orders={orders}
                  stages={stages}
                  products={products}
                  categories={categories}
                  heroSlides={heroSlides}
                  customers={customers}
                  fabrics={fabrics}
                  messages={messages}
                  settings={settings}
                  analytics={analytics}
                  onRefresh={fetchData}
                  onSwitchToStorefront={() => setActiveView('store')}
                  onOpenCreateOrder={() => setIsCreateOrderModalOpen(true)}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <Footer
        settings={settings}
        onOpenCallModal={() => setIsCallModalOpen(true)}
        onOpenMessageModal={() => setIsMessageModalOpen(true)}
        onOpenTracker={() => setIsTrackerOpen(true)}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setActiveView('store');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Call Tailor Modal */}
      {isCallModalOpen && (
        <CallTailorModal
          settings={settings}
          onClose={() => setIsCallModalOpen(false)}
        />
      )}

      {/* In-App Web Message Modal */}
      {isMessageModalOpen && (
        <WebMessageModal
          onClose={() => setIsMessageModalOpen(false)}
          onMessageSent={() => fetchData()}
        />
      )}

      {/* Cart & Client Orders Modal */}
      {isCartModalOpen && (
        <CartOrdersModal
          cartItems={cartItems}
          userOrders={userOrders}
          settings={settings}
          onRemoveFromCart={handleRemoveFromCart}
          onCheckoutCart={handleCheckoutCart}
          onTrackOrder={(orderId) => {
            setIsCartModalOpen(false);
            const found = orders.find(o => o.id === orderId) || userOrders.find(o => o.id === orderId);
            if (found) {
              setSelectedOrderDetail(found);
            } else {
              setIsTrackerOpen(true);
            }
          }}
          onClose={() => setIsCartModalOpen(false)}
        />
      )}

      {/* Quick Order via WhatsApp Modal */}
      {quickOrderProduct && (
        <QuickOrderModal
          product={quickOrderProduct}
          settings={settings}
          onClose={() => setQuickOrderProduct(null)}
          onOrderPlaced={handleOrderCreated}
          onOpenOrderTracker={(order) => {
            setSelectedOrderDetail(order);
          }}
        />
      )}

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          product={detailProduct}
          settings={settings}
          onClose={() => setDetailProduct(null)}
          onQuickOrder={(prod) => {
            setDetailProduct(null);
            setQuickOrderProduct(prod);
          }}
          onAddToCart={(prod) => handleAddToCart(prod)}
        />
      )}

      {/* Exact Order Detail Tracker Modal (Matching Screenshot) */}
      {selectedOrderDetail && (
        <OrderDetailTracker
          order={selectedOrderDetail}
          settings={settings}
          onClose={() => setSelectedOrderDetail(null)}
          onOpenCallModal={() => setIsCallModalOpen(true)}
          onOpenMessageModal={() => setIsMessageModalOpen(true)}
        />
      )}

      {/* Live Order Tracker Search Modal */}
      {isTrackerOpen && (
        <OrderTrackerModal
          onClose={() => setIsTrackerOpen(false)}
        />
      )}

      {/* Walk-in Order Creation Modal for Tailor Dashboard */}
      {isCreateOrderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-slate-200 shadow-xl space-y-4 my-6">
            <h3 className="font-serif text-base font-bold text-slate-900">
              Enregistrer une Nouvelle Commande (Client Présentiel)
            </h3>

            <form onSubmit={handleCreateWalkinOrder} className="space-y-3 text-xs">
              {createOrderError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {createOrderError}
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Nom du Client *</label>
                  <input
                    type="text"
                    required
                    value={walkinForm.customerName}
                    onChange={(e) => setWalkinForm({ ...walkinForm, customerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Téléphone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={walkinForm.customerPhone}
                    onChange={(e) => setWalkinForm({ ...walkinForm, customerPhone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Désignation du Vêtement *</label>
                <input
                  type="text"
                  required
                  value={walkinForm.itemName}
                  onChange={(e) => setWalkinForm({ ...walkinForm, itemName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1">Montant Total ({settings?.currency || 'FCFA'})</label>
                  <input
                    type="number"
                    required
                    value={walkinForm.totalAmount}
                    onChange={(e) => setWalkinForm({ ...walkinForm, totalAmount: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Acompte Reçu ({settings?.currency || 'FCFA'})</label>
                  <input
                    type="number"
                    value={walkinForm.amountPaid}
                    onChange={(e) => setWalkinForm({ ...walkinForm, amountPaid: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Délai Confection (Jours)</label>
                  <input
                    type="number"
                    value={walkinForm.turnaroundDays}
                    onChange={(e) => setWalkinForm({ ...walkinForm, turnaroundDays: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Provenance Tissu</label>
                  <input
                    type="text"
                    value={walkinForm.fabricStatus}
                    onChange={(e) => setWalkinForm({ ...walkinForm, fabricStatus: e.target.value })}
                    placeholder="ex: Client a déposé 5m Bazin"
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Étape Initiale</label>
                  <select
                    value={walkinForm.tailoringStage}
                    onChange={(e) => setWalkinForm({ ...walkinForm, tailoringStage: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900"
                  >
                    {stages.map(s => (
                      <option key={s.id} value={s.name}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Consignes & Détails Spéciaux</label>
                <textarea
                  rows={2}
                  value={walkinForm.notes}
                  onChange={(e) => setWalkinForm({ ...walkinForm, notes: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-slate-900 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateOrderModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl text-slate-600 hover:bg-slate-100"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium"
                >
                  Créer la Commande
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
