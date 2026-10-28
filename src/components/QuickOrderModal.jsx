import React, { useState } from 'react';
import { 
  X, 
  MessageCircle, 
  Check, 
  Copy, 
  Ruler, 
  Scissors, 
  Clock, 
  Printer, 
  Calendar,
  MapPin,
  Sparkles,
  ArrowRight,
  ShoppingBag
} from 'lucide-react';
import { api } from '../services/api';

export default function QuickOrderModal({ 
  product, 
  settings, 
  onClose, 
  onOrderPlaced,
  onOpenOrderTracker 
}) {
  const currency = settings?.currency || 'FCFA';
  const targetWhatsApp = settings?.phone || '22890603801';
  const isBespoke = product?.isCustomMade;

  const [quantity, setQuantity] = useState(1);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [validationError, setValidationError] = useState(null);

  // Ready-to-wear size selection
  const getAvailableReadySizes = () => {
    if (product?.availableSizes && product.availableSizes.length > 0) {
      return product.availableSizes;
    }
    const cat = product?.category || '';
    if (cat.includes('Coiffes') || cat.includes('Bonnets')) {
      return ["56 cm", "57 cm", "58 cm (Standard)", "59 cm", "60 cm"];
    }
    if (cat.includes('Chaussures') || cat.includes('Babouches')) {
      return ["40", "41", "42", "43", "44", "45"];
    }
    if (cat.includes('Ceintures')) {
      return ["85 cm", "90 cm", "95 cm", "100 cm", "105 cm"];
    }
    if (cat.includes('Parfums')) {
      return ["12 ml (Attar pur)", "50 ml", "100 ml"];
    }
    if (cat.includes('Tissus')) {
      return ["Coupon 4 Mètres", "Coupon 5 Mètres", "Coupon 10 Mètres"];
    }
    return ["S (38-40)", "M (42-44)", "L (46-48)", "XL (50-52)", "XXL (54-56)"];
  };

  const availableReadySizes = getAvailableReadySizes();
  const [selectedReadySize, setSelectedReadySize] = useState(availableReadySizes[0] || 'L');

  // Bespoke material and color selection
  const defaultMaterial = product?.availableMaterials?.[0]?.name || "Laine Vierge Italienne Super 140s";
  const [selectedMaterial, setSelectedMaterial] = useState(defaultMaterial);

  const defaultColor = product?.availableColors?.[0]?.name || "Noir Onyx";
  const [selectedColor, setSelectedColor] = useState(defaultColor);

  // Measurement mode for bespoke: 'in_house' (visit tailor) | 'custom' | 'standard'
  const [sizeMode, setSizeMode] = useState('in_house');
  const [standardSize, setStandardSize] = useState('L (Tour de poitrine 104-108 cm)');

  // French West African metric system: strictly in Centimeters (cm)
  const [measurements, setMeasurements] = useState({
    neck: '42',
    chest: '106',
    shoulder: '48',
    sleeveLength: '64',
    kaftanLength: '135',
    waist: '90',
    trouserLength: '102',
    capSize: '58',
    unit: 'cm'
  });

  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  // Material extra cost
  const selectedMaterialObj = product.availableMaterials?.find(m => m.name === selectedMaterial);
  const extraMaterialPrice = isBespoke ? (selectedMaterialObj?.extraPrice || 0) : 0;
  const unitPrice = (product.price || 0) + extraMaterialPrice;
  const totalPrice = unitPrice * quantity;
  const turnaroundDays = isBespoke ? (Number(product.turnaroundDays) || 5) : 0;

  const computeDeliveryDate = () => {
    if (!isBespoke) return "Disponible immédiatement";
    const d = new Date();
    d.setDate(d.getDate() + turnaroundDays);
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const deliveryTargetFormatted = computeDeliveryDate();

  const generateMessage = (orderId = 'EN-ATTENTE') => {
    if (isBespoke) {
      let msg = `👑 *COMMANDE CONFECTION SUR MESURE - ${settings?.atelierName || 'TAY COLLECTIONS'}* 👑\n`;
      msg += `Réf. Commande : *${orderId}*\n`;
      msg += `------------------------------------\n`;
      msg += `🛍️ *Modèle :* ${product.name}\n`;
      msg += `🧵 *Matière Choisie :* ${selectedMaterial}\n`;
      msg += `🎨 *Couleur Choisie :* ${selectedColor}\n`;
      msg += `🔢 *Quantité :* ${quantity}\n`;
      msg += `💰 *Montant Total :* ${totalPrice.toLocaleString()} ${currency}\n`;
      msg += `⏱️ *Délai Estimé :* ${turnaroundDays} jours ouvrés (Cible : ${deliveryTargetFormatted})\n\n`;

      msg += `👤 *CLIENT :*\n`;
      msg += `• Nom : ${customerName || '[Nom]'}\n`;
      msg += `• Téléphone : ${customerPhone || '[Téléphone]'}\n`;
      msg += `• Adresse : ${deliveryAddress || "Retrait Showroom Cotonou"}\n\n`;

      msg += `📏 *PRISE DE MESURE (Système Métrique Ouest-Africain &bull; Centimètres) :*\n`;
      if (sizeMode === 'in_house') {
        msg += `• Mode : Le client passera directement à l'Atelier Showroom pour sa prise de mesure.\n`;
      } else if (sizeMode === 'custom') {
        msg += `• Mesures fournies en ligne (Unité : ${measurements.unit}) :\n`;
        msg += `  - Col : ${measurements.neck} cm | Poitrine : ${measurements.chest} cm\n`;
        msg += `  - Épaules : ${measurements.shoulder} cm | Manches : ${measurements.sleeveLength} cm\n`;
        msg += `  - Long. Kaftan : ${measurements.kaftanLength} cm | Taille : ${measurements.waist} cm\n`;
        msg += `  - Long. Pantalon : ${measurements.trouserLength} cm | Fila : ${measurements.capSize} cm\n`;
      } else {
        msg += `• Taille standard choisie : ${standardSize}\n`;
      }

      if (specialNotes) {
        msg += `\n📝 *Notes Particulières :* ${specialNotes}\n`;
      }

      msg += `\n------------------------------------\n`;
      msg += `Merci de bien vouloir confirmer la disponibilité de l'atelier et valider la commande.`;
      return msg;
    } else {
      // Ready-to-wear direct purchase message (no custom delay or sewing measurements)
      let msg = `🛍️ *ACHAT BOUTIQUE PRÊT-À-PORTER - ${settings?.atelierName || 'TAY COLLECTIONS'}* 🛍️\n`;
      msg += `Réf. Commande : *${orderId}*\n`;
      msg += `------------------------------------\n`;
      msg += `📦 *Article :* ${product.name}\n`;
      msg += `🏷️ *Catégorie :* ${product.category}\n`;
      msg += `📏 *Taille / Format sélectionné :* ${selectedReadySize}\n`;
      msg += `🔢 *Quantité :* ${quantity}\n`;
      msg += `💰 *Montant Total :* ${totalPrice.toLocaleString()} ${currency}\n`;
      msg += `⚡ *Disponibilité :* En Stock Immédiat en Boutique (Retrait / Livraison sans délai)\n\n`;

      msg += `👤 *CLIENT :*\n`;
      msg += `• Nom : ${customerName || '[Nom]'}\n`;
      msg += `• Téléphone : ${customerPhone || '[Téléphone]'}\n`;
      msg += `• Retrait / Livraison : ${deliveryAddress || "Retrait Showroom Cotonou"}\n\n`;

      if (specialNotes) {
        msg += `📝 *Instructions Client :* ${specialNotes}\n\n`;
      }

      msg += `------------------------------------\n`;
      msg += `Bonjour Maître Tailleur, je souhaite récupérer cet article disponible immédiatement en boutique.`;
      return msg;
    }
  };

  const handleDispatchOrder = async (e) => {
    e.preventDefault();
    setValidationError(null);
    if (!customerName.trim() || !customerPhone.trim()) {
      setValidationError('Veuillez renseigner votre nom et votre numéro de téléphone.');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customerName,
        customerPhone,
        items: [
          {
            name: product.name,
            qty: quantity,
            price: unitPrice,
            image: product.image,
            category: product.category,
            material: isBespoke ? selectedMaterial : null,
            color: isBespoke ? selectedColor : null,
            size: !isBespoke ? selectedReadySize : (sizeMode === 'standard' ? standardSize : null)
          }
        ],
        totalAmount: totalPrice,
        amountPaid: !isBespoke ? totalPrice : 0, // Ready-to-wear is paid in full or on pickup
        fabricStatus: isBespoke ? `Matière sélectionnée : ${selectedMaterial}` : "Produit fini en stock",
        tailoringStage: isBespoke ? "Commande Confirmée" : "Prêt au Retrait / Livré",
        turnaroundDays: turnaroundDays,
        estimatedCompletionDate: isBespoke ? deliveryTargetFormatted : "Disponible immédiatement",
        daysRemaining: turnaroundDays,
        isAcceptedByTailor: !isBespoke, // Ready-to-wear is already prepared
        deliveryAddress: deliveryAddress || "Retrait Showroom Cotonou",
        customMeasurements: isBespoke && sizeMode === 'custom' ? measurements : null,
        notes: specialNotes || (isBespoke ? (sizeMode === 'in_house' ? "Prise de mesure physique programmée à l'Atelier" : "") : `Taille/Format : ${selectedReadySize}`)
      };

      const res = await api.createOrder(orderPayload);
      const orderId = res.order?.id || res.id || 'CMD-' + Date.now().toString().slice(-6);

      const waMsg = generateMessage(orderId);
      const cleanTargetPhone = targetWhatsApp.replace(/[^0-9]/g, '');
      const waUrl = `https://wa.me/${cleanTargetPhone}?text=${encodeURIComponent(waMsg)}`;

      setOrderSuccess({
        orderId,
        whatsappUrl: waUrl,
        message: waMsg,
        order: res.order || orderPayload
      });

      if (onOrderPlaced) onOrderPlaced(res.order || orderPayload);
    } catch (err) {
      setValidationError("Erreur lors de l'enregistrement : " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyText = () => {
    if (orderSuccess?.message) {
      navigator.clipboard.writeText(orderSuccess.message);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-xl w-full p-6 border border-slate-200 shadow-2xl space-y-5 my-6 max-h-[92vh] overflow-y-auto cursor-default"
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              {isBespoke ? 'Haute Couture Sur Mesure' : 'Prêt-à-Porter & Boutique'}
            </span>
            <h3 className="font-serif text-lg font-bold text-slate-900">
              {isBespoke ? 'Commander la Confection' : 'Acheter Immédiatement'}
            </h3>
          </div>

          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Dispatched Success Screen */
          <div className="space-y-5 animate-fadeIn">
            
            <div className="text-center py-4 space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
                <Check className="w-6 h-6" />
              </div>
              <h4 className="font-serif text-lg font-bold text-slate-900">
                Commande Préparée avec Succès !
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Votre référence a été générée. Envoyez-la directement par WhatsApp au maître tailleur pour valider instantanément.
              </p>
              <div className="font-mono text-xl font-bold text-slate-900 bg-white inline-block px-4 py-1.5 rounded-xl border border-slate-200 shadow-sm mt-1">
                {orderSuccess.orderId}
              </div>
            </div>

            {/* Printable Proforma Receipt Slip */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3 text-xs text-slate-800">
              <div className="flex justify-between items-start border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2.5">
                  <img src="/tay-logo-highres.png" alt="TAY Collections" className="w-8 h-8 object-contain" />
                  <div>
                    <strong className="font-serif text-sm block">{settings?.atelierName || 'TAY COLLECTIONS'}</strong>
                    <span className="text-[11px] text-slate-500">Reçu de Commande & Bordereau</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold">{orderSuccess.orderId}</span>
                  <div className="text-[11px] text-slate-500">{new Date().toLocaleDateString('fr-FR')}</div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span>Article : {product.name}</span>
                  <span className="font-mono">{totalPrice.toLocaleString()} {currency}</span>
                </div>
                {isBespoke ? (
                  <>
                    <div className="text-slate-500 text-[11px]">
                      Matière : {selectedMaterial} &bull; Coloris : {selectedColor} &bull; Qté : {quantity}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      Prise de mesure : {sizeMode === 'in_house' ? "Rendez-vous à l'Atelier Showroom" : sizeMode === 'custom' ? `Mesures en cm (Col: ${measurements.neck}cm, Poitrine: ${measurements.chest}cm...)` : standardSize}
                    </div>
                  </>
                ) : (
                  <div className="text-slate-500 text-[11px]">
                    Taille / Format : {selectedReadySize} &bull; Qté : {quantity} &bull; En stock immédiat
                  </div>
                )}
                <div className="text-slate-500 text-[11px]">
                  Client : {customerName} ({customerPhone})
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="no-print flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href={orderSuccess.whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Ouvrir la Commande sur WhatsApp</span>
              </a>

              <button
                onClick={handlePrintReceipt}
                className="py-3 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-800 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Imprimer Reçu</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenOrderTracker && orderSuccess.order) {
                    onOpenOrderTracker(orderSuccess.order);
                  }
                }}
                className="py-3 px-4 rounded-xl border border-slate-900 bg-white text-slate-900 hover:bg-slate-50 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Voir le Suivi Détaillé &rarr;</span>
              </button>
            </div>

          </div>
        ) : (
          /* Order Configuration Form */
          <form onSubmit={handleDispatchOrder} className="space-y-5 text-xs">
            
            {/* Product Summary */}
            <div className="flex items-center gap-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <img 
                src={product.image} 
                alt={product.name} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/uploads/cat_boubous.jpg';
                }}
                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] uppercase font-semibold text-slate-400 block">{product.category}</span>
                <h4 className="font-serif text-sm font-bold text-slate-900 truncate">{product.name}</h4>
                <div className="text-sm font-serif font-bold text-slate-900 mt-0.5">
                  {unitPrice.toLocaleString()} {currency}
                  {extraMaterialPrice > 0 && <span className="text-[10px] font-sans font-normal text-slate-500 ml-1.5">(incluant supplément matière)</span>}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-1 font-bold text-slate-500 hover:text-slate-900"
                >
                  -
                </button>
                <span className="font-mono px-1 font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-1 font-bold text-slate-500 hover:text-slate-900"
                >
                  +
                </button>
              </div>
            </div>

            {/* CASE 1 : PRÊT-À-PORTER / READY-TO-WEAR (NO CONFECTION DELAY, EASY SIZE PICKER) */}
            {!isBespoke && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-slate-800 font-bold block">
                    {product.category?.includes('Parfums') ? 'Format / Volume du Flacon :' :
                     product.category?.includes('Coiffes') || product.category?.includes('Bonnets') ? 'Tour de Tête (Taille Fila en cm) :' :
                     product.category?.includes('Chaussures') ? 'Pointure :' :
                     product.category?.includes('Ceintures') ? 'Longueur Ceinture (cm) :' :
                     product.category?.includes('Tissus') ? 'Métrage / Coupon :' :
                     'Sélectionnez votre Taille :'}
                  </label>
                  <span className="text-[11px] font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {selectedReadySize}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {availableReadySizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedReadySize(sz)}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                        selectedReadySize === sz
                          ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                          : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>

                <div className="pt-2 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-slate-100">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Article prêt à porter disponible en boutique sans aucun délai de confection.</span>
                </div>
              </div>
            )}

            {/* CASE 2 : CONFECTION SUR MESURE (BESPOKE FABRICS, COLORS & METRIC MEASUREMENTS IN CM) */}
            {isBespoke && (
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-4">
                
                {/* 1. Choice of Material */}
                <div>
                  <label className="text-slate-800 font-bold block mb-2 flex items-center justify-between">
                    <span>1. Choisissez la Matière du Tissu :</span>
                    <span className="text-[11px] font-normal text-slate-500">Tissus nobles certifiés</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(product.availableMaterials || [
                      { name: "Laine Vierge Super 140s", extraPrice: 0 },
                      { name: "Bazin Riche Getzner Autriche", extraPrice: 20000 },
                      { name: "Cashmere Impérial", extraPrice: 35000 },
                      { name: "Lin Irlandais Pur", extraPrice: 10000 }
                    ]).map((mat) => (
                      <div
                        key={mat.name}
                        onClick={() => setSelectedMaterial(mat.name)}
                        className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          selectedMaterial === mat.name 
                            ? 'border-slate-900 bg-slate-50 font-semibold' 
                            : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{mat.name}</span>
                        {mat.extraPrice > 0 && (
                          <span className="text-[10px] text-slate-500">+{mat.extraPrice.toLocaleString()} {currency}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. Choice of Colors */}
                <div>
                  <label className="text-slate-800 font-bold block mb-2 flex items-center justify-between">
                    <span>2. Choisissez la Couleur Disponible :</span>
                    <span className="text-[11px] font-semibold text-slate-700">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(product.availableColors || [
                      { name: "Vert Émeraude", hex: "#064e3b" },
                      { name: "Bleu Nuit", hex: "#0f172a" },
                      { name: "Blanc Pur", hex: "#ffffff" },
                      { name: "Noir Onyx", hex: "#18181b" },
                      { name: "Bordeaux Royal", hex: "#831843" }
                    ]).map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setSelectedColor(c.name)}
                        className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition-all ${
                          selectedColor === c.name 
                            ? 'border-slate-900 bg-slate-900 text-white font-medium' 
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 shrink-0" 
                          style={{ backgroundColor: c.hex }} 
                        />
                        <span>{c.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Measurement Options (West African Metric Centimeters) */}
                <div>
                  <label className="text-slate-800 font-bold block mb-2 flex items-center justify-between">
                    <span>3. Prise de Mesures pour la Confection :</span>
                    <span className="text-[10px] text-slate-500 font-mono">Système Métrique Ouest-Africain (cm)</span>
                  </label>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div
                      onClick={() => setSizeMode('in_house')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                        sizeMode === 'in_house' 
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-700" />
                        <span>Visite à l'Atelier</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Passez à notre showroom pour une prise de mesure professionnelle.
                      </p>
                    </div>

                    <div
                      onClick={() => setSizeMode('custom')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                        sizeMode === 'custom' 
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Ruler className="w-3.5 h-3.5 text-slate-700" />
                        <span>Saisir en Ligne (cm)</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Renseignez vos mensurations en centimètres (ruban métrique).
                      </p>
                    </div>

                    <div
                      onClick={() => setSizeMode('standard')}
                      className={`p-3 rounded-xl border cursor-pointer transition-all space-y-1 ${
                        sizeMode === 'standard' 
                          ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900/10' 
                          : 'border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5 text-slate-700" />
                        <span>Taille Prêt-à-Porter</span>
                      </div>
                      <p className="text-[10px] text-slate-500 leading-tight">
                        Choisissez une taille standard (M, L, XL, XXL).
                      </p>
                    </div>
                  </div>

                  {/* Manual metric input in Centimeters */}
                  {sizeMode === 'custom' && (
                    <div className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5 animate-fadeIn">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-800">
                          Mensurations Précises en Centimètres (cm) :
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                          Ruban de couture métrique
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {[
                          { k: 'neck', l: 'Tour de Cou (cm)', hint: 'ex: 42' },
                          { k: 'chest', l: 'Poitrine (cm)', hint: 'ex: 106' },
                          { k: 'shoulder', l: 'Épaules / Carrure (cm)', hint: 'ex: 48' },
                          { k: 'sleeveLength', l: 'Manches (cm)', hint: 'ex: 64' },
                          { k: 'kaftanLength', l: 'Long. Boubou (cm)', hint: 'ex: 135' },
                          { k: 'waist', l: 'Tour de Taille (cm)', hint: 'ex: 90' },
                          { k: 'trouserLength', l: 'Pantalon (cm)', hint: 'ex: 102' },
                          { k: 'capSize', l: 'Tour Tête / Fila (cm)', hint: 'ex: 58' }
                        ].map((f) => (
                          <div key={f.k}>
                            <label className="text-[10px] text-slate-600 block mb-0.5 font-medium">{f.l}</label>
                            <input
                              type="number"
                              step="0.5"
                              value={measurements[f.k]}
                              placeholder={f.hint}
                              onChange={(e) => setMeasurements({ ...measurements, [f.k]: e.target.value })}
                              className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white font-mono text-center text-xs text-slate-900 focus:outline-none focus:border-slate-800"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {sizeMode === 'standard' && (
                    <div className="mt-3 grid grid-cols-2 gap-2 animate-fadeIn">
                      {['M (Poitrine 98-102 cm)', 'L (Poitrine 104-108 cm)', 'XL (Poitrine 110-116 cm)', 'XXL (Poitrine 118+ cm)'].map(s => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setStandardSize(s)}
                          className={`p-2 rounded-lg border text-left text-xs ${standardSize === s ? 'border-slate-900 bg-slate-50 font-semibold' : 'border-slate-200 text-slate-600'}`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            )}

            {/* Timeframe & Availability banner (ONLY FOR BESPOKE) */}
            {isBespoke && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-900">
                  <Clock className="w-3.5 h-3.5 text-slate-700" />
                  <span>Délai de confection : {turnaroundDays} jours ouvrés</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Date de livraison cible : <strong className="text-slate-900 capitalize">{deliveryTargetFormatted}</strong> si acompte validé.
                </p>
              </div>
            )}

            {/* Customer Details */}
            <div className="space-y-2.5">
              {validationError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {validationError}
                </div>
              )}
              <h5 className="font-bold text-slate-900 border-b border-slate-100 pb-1">
                Vos Coordonnées de Contact
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-600 block mb-1">Nom et Prénom *</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="ex: M. Abdoulaye Touré"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-600 block mb-1">Numéro WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="ex: +228 90 12 34 56"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Adresse ou Ville de Livraison (ou Retrait Showroom)</label>
                <input
                  type="text"
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="ex: Retrait au Showroom Cotonou ou livraison Cité Houéyiho"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1">Consignes & Détails Particuliers</label>
                <textarea
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="ex: Broderie col discrète, boutonnières intérieures invisibles..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-slate-800 resize-none"
                />
              </div>
            </div>

            {/* Total Math & Dispatch Button */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-slate-400 block">Total de la commande :</span>
                <span className="font-serif text-lg font-bold text-slate-900">
                  {totalPrice.toLocaleString()} {currency}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto py-3 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? 'Transmission...'
                    : isBespoke
                    ? 'Commander sur Mesure (WhatsApp)'
                    : 'Acheter Immédiatement via WhatsApp'}
                </span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
