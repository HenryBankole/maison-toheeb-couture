import React, { useState } from 'react';
import { 
  Upload, 
  Image as ImageIcon, 
  Save, 
  Check, 
  Sparkles, 
  Layers, 
  Plus, 
  Trash2, 
  Eye, 
  AlertCircle,
  RefreshCw,
  X
} from 'lucide-react';
import { api } from '../../services/api';

export default function ShowroomMediaManager({ 
  categories = [], 
  heroSlides = [], 
  settings, 
  onRefresh 
}) {
  const [activeSection, setActiveSection] = useState('categories'); // 'categories' | 'hero'
  const [uploadingId, setUploadingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // Adding category state
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCatForm, setNewCatForm] = useState({
    name: '',
    section: 'bespoke',
    image: '/uploads/cat_boubous.jpg'
  });

  // Local state for categories to allow smooth editing
  const [localCategories, setLocalCategories] = useState(categories);
  const [localSlides, setLocalSlides] = useState(heroSlides);

  // Sync when props change
  React.useEffect(() => {
    if (categories && categories.length > 0) setLocalCategories(categories);
  }, [categories]);

  React.useEffect(() => {
    if (heroSlides && heroSlides.length > 0) setLocalSlides(heroSlides);
  }, [heroSlides]);

  const showNotification = (msg, isError = false) => {
    if (isError) {
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(null), 4000);
    } else {
      setSuccessMessage(msg);
      setTimeout(() => setSuccessMessage(null), 3000);
    }
  };

  // 1. CATEGORY ACTIONS
  const handleCategoryFieldChange = (index, field, value) => {
    setLocalCategories(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleCategoryFileUpload = async (index, file) => {
    if (!file) return;
    setUploadingId(`cat-${index}`);
    try {
      const res = await api.uploadImage(file);
      handleCategoryFieldChange(index, 'image', res.url);
      showNotification('Photo de catégorie téléversée ! Cliquez sur « Enregistrer » pour valider.');
    } catch (err) {
      showNotification('Erreur téléversement : ' + err.message, true);
    } finally {
      setUploadingId(null);
    }
  };

  const handleNewCategoryFileUpload = async (file) => {
    if (!file) return;
    setUploadingId('new-cat');
    try {
      const res = await api.uploadImage(file);
      setNewCatForm(prev => ({ ...prev, image: res.url }));
      showNotification('Photo de la nouvelle catégorie prête !');
    } catch (err) {
      showNotification('Erreur téléversement : ' + err.message, true);
    } finally {
      setUploadingId(null);
    }
  };

  const handleSaveCategory = async (cat) => {
    try {
      await api.updateCategory(cat.id, cat);
      showNotification(`Catégorie « ${cat.name} » mise à jour avec succès sur le site !`);
      if (onRefresh) onRefresh();
    } catch (err) {
      showNotification('Erreur enregistrement : ' + err.message, true);
    }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!newCatForm.name.trim()) {
      showNotification('Veuillez saisir un nom pour la catégorie.', true);
      return;
    }

    try {
      await api.createCategory({
        name: newCatForm.name.trim(),
        section: newCatForm.section,
        image: newCatForm.image || '/uploads/cat_boubous.jpg'
      });
      showNotification(`Nouvelle catégorie « ${newCatForm.name} » ajoutée et immédiatement active !`);
      setIsAddingCategory(false);
      setNewCatForm({ name: '', section: 'bespoke', image: '/uploads/cat_boubous.jpg' });
      if (onRefresh) onRefresh();
    } catch (err) {
      showNotification('Erreur lors de la création : ' + err.message, true);
    }
  };

  const handleDeleteCategory = async (cat) => {
    const ok = window.confirm(`Êtes-vous sûr de vouloir supprimer la catégorie « ${cat.name} » ? Elle sera retirée du showroom.`);
    if (!ok) return;

    try {
      await api.deleteCategory(cat.id);
      showNotification(`Catégorie « ${cat.name} » supprimée.`);
      if (onRefresh) onRefresh();
    } catch (err) {
      showNotification('Erreur suppression : ' + err.message, true);
    }
  };

  // 2. HERO SLIDE ACTIONS
  const handleSlideFieldChange = (index, field, value) => {
    setLocalSlides(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleSlideModelUpload = async (index, file) => {
    if (!file) return;
    setUploadingId(`slide-model-${index}`);
    try {
      const res = await api.uploadImage(file);
      handleSlideFieldChange(index, 'modelImage', res.url);
      showNotification('Visuel mannequin téléversé avec succès !');
    } catch (err) {
      showNotification('Erreur téléversement : ' + err.message, true);
    } finally {
      setUploadingId(null);
    }
  };

  const handleSaveSlide = async (slide) => {
    try {
      await api.updateHeroSlide(slide.id, slide);
      showNotification(`Bannière ${slide.id} enregistrée et active sur la page d'accueil !`);
      if (onRefresh) onRefresh();
    } catch (err) {
      showNotification('Erreur enregistrement : ' + err.message, true);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Top Header Card */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-slate-700" />
            <span>Gestion des Catégories & Bannières du Showroom</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ajoutez, modifiez ou supprimez vos catégories de vêtements et personnalisez les bannières d'accueil avec vos propres photos.
          </p>
        </div>

        {/* Section switcher pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setActiveSection('categories')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'categories'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Catégories ({localCategories.length})
          </button>

          <button
            onClick={() => setActiveSection('hero')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeSection === 'hero'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Bannières Accueil ({localSlides.length})
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2 shadow-sm animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 bg-red-50 text-red-800 text-xs rounded-xl border border-red-200 flex items-center gap-2 shadow-sm animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* TAB 1: CATEGORIES MANAGEMENT */}
      {activeSection === 'categories' && (
        <div className="space-y-5">
          
          {/* Subheader with Add Category Button */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-slate-900 block font-semibold">
                Bulles circulaires & Filtres de catégories
              </strong>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Ces catégories s'affichent dans la section circulaire « Nouveautés Récentes » et génèrent automatiquement les filtres du Showroom.
              </p>
            </div>

            <button
              onClick={() => setIsAddingCategory(true)}
              className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une Catégorie</span>
            </button>
          </div>

          {/* New Category Modal / Drawer */}
          {isAddingCategory && (
            <div className="p-5 bg-white border-2 border-slate-900 rounded-2xl shadow-lg space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-serif text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-slate-700" />
                  <span>Nouvelle Catégorie de Showroom</span>
                </h3>
                <button 
                  onClick={() => setIsAddingCategory(false)}
                  className="p-1 text-slate-400 hover:text-slate-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Nom de la catégorie *
                    </label>
                    <input 
                      type="text"
                      required
                      value={newCatForm.name}
                      onChange={(e) => setNewCatForm({ ...newCatForm, name: e.target.value })}
                      placeholder="Ex: Grands Boubous, Costumes Senator..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-900"
                    />
                  </div>

                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Section Showroom *
                    </label>
                    <select
                      value={newCatForm.section}
                      onChange={(e) => setNewCatForm({ ...newCatForm, section: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 bg-white"
                    >
                      <option value="bespoke">1. Sur Mesure (À Coudre en Atelier)</option>
                      <option value="ready_to_wear">2. Prêt-à-Porter & Boutique (En Stock Immédiat)</option>
                    </select>
                  </div>
                </div>

                {/* Picture Upload */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-300 shrink-0">
                    <img 
                      src={newCatForm.image} 
                      alt="Aperçu"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-1">
                    <span className="text-[11px] font-semibold text-slate-700 block">
                      Photo de la Catégorie
                    </span>
                    <label className="py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingId === 'new-cat' ? 'Téléversement...' : 'Choisir une photo locale'}</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={uploadingId === 'new-cat'}
                        onChange={(e) => handleNewCategoryFileUpload(e.target.files?.[0])}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="py-2 px-4 rounded-xl text-slate-600 hover:bg-slate-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm"
                  >
                    Créer la Catégorie
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Category Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {localCategories.map((cat, idx) => (
              <div 
                key={cat.id || idx}
                className="bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  
                  {/* Category Circular Preview (Filling Edge-to-Edge) */}
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-slate-200 shadow-sm shrink-0">
                      <img 
                        src={cat.image} 
                        alt={cat.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/uploads/cat_boubous.jpg';
                        }}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="space-y-1.5 flex-1 min-w-0">
                      <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                        Nom de la Catégorie
                      </label>
                      <input 
                        type="text"
                        value={cat.name}
                        onChange={(e) => handleCategoryFieldChange(idx, 'name', e.target.value)}
                        className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 focus:outline-none focus:border-slate-800 text-slate-900"
                      />
                    </div>
                  </div>

                  {/* Section Assignment */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-500 block">
                      Section Showroom
                    </label>
                    <select
                      value={cat.section || 'bespoke'}
                      onChange={(e) => handleCategoryFieldChange(idx, 'section', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 text-slate-800 bg-white"
                    >
                      <option value="bespoke">Sur Mesure (À Coudre)</option>
                      <option value="ready_to_wear">Prêt-à-Porter & Boutique (En Stock)</option>
                    </select>
                  </div>

                  {/* Upload Image Button */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-medium text-slate-500 block">
                      Remplacer la Photo
                    </label>
                    <label className="w-full py-2 px-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{uploadingId === `cat-${idx}` ? 'Téléversement...' : 'Choisir une photo locale'}</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={uploadingId === `cat-${idx}`}
                        onChange={(e) => handleCategoryFileUpload(idx, e.target.files?.[0])}
                        className="hidden" 
                      />
                    </label>
                  </div>

                </div>

                {/* Actions: Delete & Save */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleDeleteCategory(cat)}
                    className="py-2 px-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-medium flex items-center gap-1 transition-colors"
                    title="Supprimer la catégorie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Supprimer</span>
                  </button>

                  <button
                    onClick={() => handleSaveCategory(cat)}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Enregistrer</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 2: HERO BANNER SLIDES */}
      {activeSection === 'hero' && (
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
            Personnalisez ici les bannières géantes qui défilent sur la page d'accueil avec les textes, les photos des mannequins et les boutons d'appel à l'action.
          </div>

          <div className="space-y-6">
            {localSlides.map((slide, sIdx) => (
              <div 
                key={slide.id || sIdx}
                className="bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-900 text-white font-mono text-xs font-bold flex items-center justify-center">
                      {sIdx + 1}
                    </span>
                    <h3 className="font-serif text-base font-bold text-slate-900">
                      Bannière Slide {sIdx + 1} : {slide.titleLine1} {slide.titleLine2}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleSaveSlide(slide)}
                    className="py-1.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Enregistrer cette Bannière</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Left: Model Image Upload & Preview */}
                  <div className="lg:col-span-4 space-y-3">
                    <label className="text-xs font-semibold text-slate-700 block">
                      Photo du Mannequin / Modèle Principal
                    </label>

                    <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#edf4f2] border border-slate-200 shadow-sm flex items-center justify-center">
                      <img 
                        src={slide.modelImage} 
                        alt="Aperçu Bannière"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/uploads/hero_slide_1.jpg';
                        }}
                        className="w-full h-full object-cover object-top"
                      />
                    </div>

                    <label className="w-full py-2.5 px-3 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-colors">
                      <Upload className="w-4 h-4 text-slate-600" />
                      <span>{uploadingId === `slide-model-${sIdx}` ? 'Téléversement...' : 'Téléverser photo mannequin'}</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        disabled={uploadingId === `slide-model-${sIdx}`}
                        onChange={(e) => handleSlideModelUpload(sIdx, e.target.files?.[0])}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {/* Center & Right: Text inputs & CTAs */}
                  <div className="lg:col-span-8 space-y-4">
                    
                    {/* Tag / Category */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Surtitre / Tag de Collection
                      </label>
                      <input 
                        type="text"
                        value={slide.tag || ''}
                        onChange={(e) => handleSlideFieldChange(sIdx, 'tag', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900"
                        placeholder="Ex: Collection Cérémonie & Prestige"
                      />
                    </div>

                    {/* Headline lines 1 & 2 */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">
                          Titre Ligne 1 (Gros caractères)
                        </label>
                        <input 
                          type="text"
                          value={slide.titleLine1 || ''}
                          onChange={(e) => handleSlideFieldChange(sIdx, 'titleLine1', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                          placeholder="Ex: L'Honneur & la Grâce"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">
                          Titre Ligne 2
                        </label>
                        <input 
                          type="text"
                          value={slide.titleLine2 || ''}
                          onChange={(e) => handleSlideFieldChange(sIdx, 'titleLine2', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:border-slate-900"
                          placeholder="Ex: Haute Couture Homme"
                        />
                      </div>
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Description / Sous-titre
                      </label>
                      <textarea 
                        rows={2}
                        value={slide.subtitle || ''}
                        onChange={(e) => handleSlideFieldChange(sIdx, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-slate-900 resize-none"
                      />
                    </div>

                    {/* CTA Buttons labels */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">
                          Texte Bouton Noir (Principal)
                        </label>
                        <input 
                          type="text"
                          value={slide.primaryCta || ''}
                          onChange={(e) => handleSlideFieldChange(sIdx, 'primaryCta', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-slate-600 block mb-1">
                          Texte Bouton Blanc (Secondaire)
                        </label>
                        <input 
                          type="text"
                          value={slide.secondaryCta || ''}
                          onChange={(e) => handleSlideFieldChange(sIdx, 'secondaryCta', e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900"
                        />
                      </div>
                    </div>

                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
}
