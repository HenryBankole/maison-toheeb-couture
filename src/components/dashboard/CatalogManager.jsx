import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Image as ImageIcon, 
  Upload, 
  Check, 
  Scissors, 
  X,
  AlertCircle
} from 'lucide-react';
import { api } from '../../services/api';
import { luxuryImagePresets } from '../../data/presets';
import CustomConfirmModal from '../common/CustomConfirmModal';

export default function CatalogManager({ products = [], categories = [], settings, onRefresh }) {
  const currency = settings?.currency || 'FCFA';

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [form, setForm] = useState({
    name: '',
    section: 'bespoke',
    category: "Boubous d'Honneur & Senator",
    price: 150000,
    image: '/uploads/cat_boubous.jpg',
    description: '',
    isCustomMade: true,
    turnaroundDays: 5,
    fabricRequirements: '4.5 Mètres',
    stockQuantity: 10,
    featured: false,
    tags: 'Bespoke, Cérémonie'
  });

  // Custom in-app confirmation modal (replaces browser popup)
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
  const [formError, setFormError] = useState(null);

  // Dynamically derive category options from db categories & existing products
  const availableCategoryNames = Array.from(new Set([
    "Boubous d'Honneur & Senator", 
    'Kaftans Sur Mesure', 
    'Coiffes & Bonnets', 
    'Parfums & Ouds',
    'Kaftans & Boubous',
    'Tissus & Matières',
    'Ceintures',
    'Chaussures & Babouches',
    ...categories.map(c => c.name),
    ...products.map(p => p.category).filter(Boolean)
  ]));

  const filterCategoryList = ['Tous', ...availableCategoryNames];

  const filteredProducts = products.filter(p => {
    const matchesCat = selectedCategory === 'Tous' || (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenAdd = () => {
    setFormError(null);
    setEditingProduct(null);
    setForm({
      name: '',
      section: 'bespoke',
      category: "Boubous d'Honneur & Senator",
      price: 150000,
      image: '/uploads/cat_boubous.jpg',
      description: '',
      isCustomMade: true,
      turnaroundDays: 5,
      fabricRequirements: '4.5 Mètres',
      stockQuantity: 10,
      featured: false,
      tags: 'Bespoke, Cérémonie'
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (p) => {
    setFormError(null);
    setEditingProduct(p);
    setForm({
      name: p.name,
      section: p.section || (p.isCustomMade ? 'bespoke' : 'ready_to_wear'),
      category: p.category,
      price: p.price,
      image: p.image || '/uploads/cat_boubous.jpg',
      description: p.description || '',
      isCustomMade: p.isCustomMade ?? (p.section === 'bespoke'),
      turnaroundDays: p.turnaroundDays || 5,
      fabricRequirements: p.fabricRequirements || '4.5 Mètres',
      stockQuantity: p.stockQuantity || 1,
      featured: Boolean(p.featured),
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : (p.tags || '')
    });
    setIsEditing(true);
  };

  const handleDelete = (prod) => {
    setConfirmModal({
      isOpen: true,
      title: "Supprimer du Catalogue",
      message: `Êtes-vous sûr de vouloir retirer définitivement le modèle « ${prod.name} » du Showroom ?`,
      confirmText: "Oui, Supprimer",
      cancelText: "Non, Conserver",
      variant: "danger",
      singleButton: false,
      onConfirm: async () => {
        try {
          await api.deleteProduct(prod.id);
          setConfirmModal(prev => ({ ...prev, isOpen: false }));
          onRefresh();
        } catch (err) {
          setConfirmModal({
            isOpen: true,
            title: "Erreur",
            message: "Impossible de supprimer ce modèle : " + (err.message || ""),
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

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setFormError(null);
    try {
      const res = await api.uploadImage(file);
      setForm(prev => ({ ...prev, image: res.url }));
    } catch (err) {
      setFormError('Téléversement échoué : ' + (err.message || ''));
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setFormError(null);
    if (!form.name || !form.price) {
      setFormError('Veuillez renseigner le nom et le tarif.');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      turnaroundDays: Number(form.turnaroundDays) || 5,
      stockQuantity: Number(form.stockQuantity) || 1,
      tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, payload);
      } else {
        await api.createProduct(payload);
      }
      setIsEditing(false);
      onRefresh();
    } catch (err) {
      setFormError("Erreur lors de l'enregistrement : " + (err.message || ''));
    }
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <h2 className="font-serif text-lg font-semibold text-slate-900">
            Gestion des Modèles du Showroom
          </h2>
          <p className="text-xs text-slate-500">
            Ajoutez de nouvelles créations, ajustez les prix en FCFA, les délais et modifiez les visuels.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="py-1.5 px-3.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Ajouter un Modèle</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {filterCategoryList.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-56">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-8 pr-3 py-1 rounded-lg border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-800"
          />
        </div>
      </div>

      {/* Grid of models */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((p) => (
          <div 
            key={p.id}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden flex flex-col justify-between hover:border-slate-300 transition-colors shadow-sm"
          >
            <div>
              <div className="relative aspect-[4/3] bg-slate-50 overflow-hidden group/img">
                <img 
                  src={p.image} 
                  alt={p.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/uploads/cat_boubous.jpg';
                  }}
                  className="w-full h-full object-cover object-top"
                />
                
                {/* Instant image replace button on hover */}
                <label className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-medium gap-1.5 z-10 backdrop-blur-[2px]">
                  <Upload className="w-4 h-4" />
                  <span>Remplacer l'image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const res = await api.uploadImage(file);
                        await api.updateProduct(p.id, { image: res.url });
                        onRefresh();
                      } catch (err) {
                        alert('Erreur lors du téléversement : ' + err.message);
                      }
                    }}
                  />
                </label>

                <div className="absolute top-2 left-2 z-20 pointer-events-none">
                  <span className="px-2 py-0.5 text-[9px] font-semibold uppercase rounded bg-white/95 text-slate-800 border border-slate-200 shadow-sm">
                    {p.category}
                  </span>
                </div>

                <div className="absolute top-2 right-2 z-20 pointer-events-none">
                  <span className="px-2 py-0.5 text-[9px] font-medium rounded bg-white/95 text-slate-700 border border-slate-200 shadow-sm">
                    {p.section === 'bespoke' || p.isCustomMade ? 'Sur Mesure' : 'Prêt-à-Porter'}
                  </span>
                </div>
              </div>

              <div className="p-3.5 space-y-1.5">
                <h4 className="font-serif text-xs font-bold text-slate-900 line-clamp-1">
                  {p.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {p.description}
                </p>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="font-serif text-sm font-bold text-slate-900">
                    {Number(p.price).toLocaleString()} {currency}
                  </span>
                  <span className="text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {p.turnaroundDays || 5} jours
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                Stock : <strong className="text-slate-800">{p.stockQuantity}</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(p)}
                  className="p-1 rounded text-slate-600 hover:text-slate-900 hover:bg-white text-xs flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modifier Prix & Infos</span>
                </button>
                <button
                  onClick={() => handleDelete(p)}
                  className="p-1 rounded text-slate-400 hover:text-red-600 hover:bg-white text-xs"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 border border-slate-200 shadow-xl space-y-4 my-6 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-serif text-base font-bold text-slate-900">
                {editingProduct ? 'Modifier le Modèle & Tarif' : 'Nouveau Modèle de Showroom'}
              </h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Section selection */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-slate-700 font-semibold">Type d'article :</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, section: 'bespoke', isCustomMade: true })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      form.section === 'bespoke' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Sur Mesure (À Coudre)
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, section: 'ready_to_wear', isCustomMade: false })}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      form.section === 'ready_to_wear' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    Prêt-à-Porter (En Stock)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Nom du modèle *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Catégorie *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  >
                    {availableCategoryNames.map(cName => (
                      <option key={cName} value={cName}>{cName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Tarif ({currency}) *</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 font-mono font-bold text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Délai Confection (Jours)</label>
                  <input
                    type="number"
                    value={form.turnaroundDays}
                    onChange={(e) => setForm({ ...form, turnaroundDays: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Métrage requis</label>
                  <input
                    type="text"
                    value={form.fabricRequirements}
                    onChange={(e) => setForm({ ...form, fabricRequirements: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900"
                  />
                </div>
              </div>

              {/* Picture Manager */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <label className="text-slate-700 font-semibold block">Visuel du Modèle</label>
                <div className="flex items-center gap-3">
                  {form.image ? (
                    <img src={form.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-slate-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="text"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Lien URL de l'image..."
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-900 text-xs"
                    />
                    <label className="cursor-pointer py-1 px-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-lg border border-slate-200 text-xs inline-flex items-center gap-1.5">
                      <Upload className="w-3 h-3" />
                      <span>{isUploading ? 'Téléversement...' : 'Téléverser une photo'}</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
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
