import React, { useState } from 'react';
import { 
  Package, 
  Plus, 
  Minus, 
  AlertTriangle, 
  Scissors, 
  Search, 
  Edit3, 
  Trash2, 
  X,
  AlertCircle 
} from 'lucide-react';
import { api } from '../../services/api';
import CustomConfirmModal from '../common/CustomConfirmModal';

export default function StockManager({ fabrics, products, settings, onRefresh }) {
  const currency = settings?.currency || 'FCFA';

  const [search, setSearch] = useState('');
  const [isAddingFabric, setIsAddingFabric] = useState(false);
  const [editingFabric, setEditingFabric] = useState(null);
  const [fabricError, setFabricError] = useState(null);

  // Custom in-app Confirmation & Notification Modal (replaces browser popups)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Oui, Confirmer',
    cancelText: 'Non, Annuler',
    variant: 'danger',
    singleButton: false,
    onConfirm: null,
    onCancel: null
  });

  const [fabricForm, setFabricForm] = useState({
    name: '',
    category: 'Drap de Laine & Suiting',
    yardsInStock: 25,
    costPerYard: 15000,
    retailPricePerYard: 25000,
    color: '#0f172a',
    lowStockThreshold: 10,
    supplier: ''
  });

  const filteredFabrics = fabrics.filter(f => 
    !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.category.toLowerCase().includes(search.toLowerCase())
  );

  const readyMadeProducts = products.filter(p => p.section === 'ready_to_wear' || !p.isCustomMade);

  const handleAdjustYards = async (id, delta) => {
    try {
      await api.adjustFabricStock(id, delta);
      onRefresh();
    } catch (err) {
      setConfirmModal({
        isOpen: true,
        title: "Erreur de Stock",
        message: "Impossible d'ajuster le métrage du tissu.",
        confirmText: "Fermer",
        variant: "danger",
        singleButton: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleAdjustProductStock = async (product, delta) => {
    try {
      const newQty = Math.max(0, (product.stockQuantity || 0) + delta);
      await api.updateProduct(product.id, { stockQuantity: newQty });
      onRefresh();
    } catch (err) {
      setConfirmModal({
        isOpen: true,
        title: "Erreur de Stock",
        message: "Impossible de modifier la quantité en stock.",
        confirmText: "Fermer",
        variant: "danger",
        singleButton: true,
        onConfirm: () => setConfirmModal(prev => ({ ...prev, isOpen: false })),
        onCancel: () => setConfirmModal(prev => ({ ...prev, isOpen: false }))
      });
    }
  };

  const handleSaveFabric = async (e) => {
    e.preventDefault();
    setFabricError(null);
    try {
      const payload = {
        ...fabricForm,
        yardsInStock: Number(fabricForm.yardsInStock),
        costPerYard: Number(fabricForm.costPerYard),
        retailPricePerYard: Number(fabricForm.retailPricePerYard),
        lowStockThreshold: Number(fabricForm.lowStockThreshold)
      };

      if (editingFabric) {
        await api.updateFabric(editingFabric.id, payload);
      } else {
        await api.createFabric(payload);
      }
      setIsAddingFabric(false);
      setEditingFabric(null);
      onRefresh();
    } catch (err) {
      setFabricError("Erreur lors de l'enregistrement du tissu : " + (err.message || ''));
    }
  };

  const handleDeleteFabric = (fab) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer du Stock",
      message: `Êtes-vous sûr de vouloir supprimer définitivement le rouleau « ${fab.name} » de l'inventaire ?`,
      previewText: null,
      confirmText: "Oui, Supprimer",
      cancelText: "Non, Conserver",
      variant: "danger",
      singleButton: false,
      onConfirm: async () => {
        try {
          await api.deleteFabric(fab.id);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          onRefresh();
        } catch (err) {
          setConfirmModal({
            isOpen: true,
            title: "Erreur",
            message: "Impossible de supprimer ce tissu.",
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
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="font-serif text-lg font-semibold text-slate-900">
            Inventaire des Tissus & Matières Premières
          </h2>
          <p className="text-xs text-slate-500">
            Suivi des métrages en stock (Bazin, lin, laines, Aso-Oke) et réassort des flacons et bonnets.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingFabric(null);
            setFabricForm({
              name: '',
              category: 'Drap de Laine & Suiting',
              yardsInStock: 30,
              costPerYard: 15000,
              retailPricePerYard: 25000,
              color: '#1e293b',
              lowStockThreshold: 10,
              supplier: ''
            });
            setIsAddingFabric(true);
          }}
          className="py-1.5 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nouveau Rouleau de Tissu</span>
        </button>
      </div>

      {/* Fabric Rolls Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-sm font-bold text-slate-900">
            Rouleaux de Tissus en Atelier (Mètres disponibles)
          </h3>
          <div className="relative w-56">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un tissu..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredFabrics.map((fab) => {
            const isLow = fab.yardsInStock <= fab.lowStockThreshold;

            return (
              <div 
                key={fab.id}
                className={`p-4 rounded-xl border bg-white flex flex-col justify-between space-y-3 transition-colors ${
                  isLow ? 'border-amber-300 ring-1 ring-amber-300/40' : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" 
                        style={{ backgroundColor: fab.color || '#946b2d' }} 
                      />
                      <div>
                        <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-1">{fab.name}</h4>
                        <span className="text-[10px] text-slate-500 uppercase">{fab.category}</span>
                      </div>
                    </div>

                    {isLow && (
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                        Alerte Stock Bas
                      </span>
                    )}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Métrage Restant</span>
                      <strong className="text-sm font-mono text-slate-900">{fab.yardsInStock} m</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Prix / Mètre</span>
                      <span className="text-xs font-mono text-slate-700">{Number(fab.retailPricePerYard || 0).toLocaleString()} {currency}</span>
                    </div>
                  </div>
                </div>

                {/* Quick adjustment buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleAdjustYards(fab.id, -4)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium"
                      title="Déduire 4 mètres pour un costume Senator"
                    >
                      -4m
                    </button>
                    <button
                      onClick={() => handleAdjustYards(fab.id, -1)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                      title="Déduire 1 mètre"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAdjustYards(fab.id, 1)}
                      className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs"
                      title="Ajouter 1 mètre"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleAdjustYards(fab.id, 5)}
                      className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-medium"
                      title="Ajouter rouleau de 5 mètres"
                    >
                      +5m
                    </button>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setEditingFabric(fab);
                        setFabricForm({ ...fab });
                        setIsAddingFabric(true);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-900 rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFabric(fab)}
                      className="p-1 text-slate-300 hover:text-red-500 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Finished Goods Stock */}
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <h3 className="font-serif text-sm font-bold text-slate-900">
          Pièces Prêtes & Flacons de Parfums (Unités disponibles)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {readyMadeProducts.map((p) => (
            <div key={p.id} className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                <div>
                  <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{p.name}</h4>
                  <span className="text-[10px] text-slate-500">{Number(p.price).toLocaleString()} {currency}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleAdjustProductStock(p, -1)}
                  className="p-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <Minus className="w-3 h-3" />
                </button>
                <span className="font-mono text-xs font-bold text-slate-900 px-1">
                  {p.stockQuantity || 0}
                </span>
                <button
                  onClick={() => handleAdjustProductStock(p, 1)}
                  className="p-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Fabric Modal */}
      {isAddingFabric && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                {editingFabric ? 'Modifier le Rouleau' : 'Nouveau Rouleau de Tissu'}
              </h3>
              <button onClick={() => setIsAddingFabric(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFabric} className="space-y-3.5 text-xs">
              {fabricError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{fabricError}</span>
                </div>
              )}
              <div>
                <label className="text-slate-600 block mb-1">Nom du Tissu & Coloris *</label>
                <input
                  type="text"
                  required
                  value={fabricForm.name}
                  onChange={(e) => setFabricForm({ ...fabricForm, name: e.target.value })}
                  placeholder="ex: Bazin Riche Getzner Blanc"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Catégorie</label>
                  <input
                    type="text"
                    value={fabricForm.category}
                    onChange={(e) => setFabricForm({ ...fabricForm, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Pastille Couleur</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={fabricForm.color}
                      onChange={(e) => setFabricForm({ ...fabricForm, color: e.target.value })}
                      className="w-9 h-8 rounded border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={fabricForm.color}
                      onChange={(e) => setFabricForm({ ...fabricForm, color: e.target.value })}
                      className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-600 block mb-1">Métrage (m)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={fabricForm.yardsInStock}
                    onChange={(e) => setFabricForm({ ...fabricForm, yardsInStock: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Prix Vente / m</label>
                  <input
                    type="number"
                    value={fabricForm.retailPricePerYard}
                    onChange={(e) => setFabricForm({ ...fabricForm, retailPricePerYard: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Alerte Stock Bas</label>
                  <input
                    type="number"
                    value={fabricForm.lowStockThreshold}
                    onChange={(e) => setFabricForm({ ...fabricForm, lowStockThreshold: e.target.value })}
                    className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddingFabric(false)}
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
