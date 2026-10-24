import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { initialData } from './data/initialData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Disable caching for all API requests to ensure real-time showroom sync
app.use('/api', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Setup static uploads directory
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Serve static build from dist if available
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
}

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Database JSON file setup
const dbFilePath = path.join(__dirname, 'data', 'database.json');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

function loadDB() {
  if (!fs.existsSync(dbFilePath)) {
    saveDB(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }
  try {
    const raw = fs.readFileSync(dbFilePath, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.messages) parsed.messages = initialData.messages || [];
    if (!parsed.categories) parsed.categories = initialData.categories || [];
    if (!parsed.heroSlides) parsed.heroSlides = initialData.heroSlides || [];
    return parsed;
  } catch (err) {
    console.error('Failed to parse database.json, resetting to initialData', err);
    saveDB(initialData);
    return JSON.parse(JSON.stringify(initialData));
  }
}

function saveDB(data) {
  fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

// ----------------- API ROUTES -----------------

// Settings
app.get('/api/settings', (req, res) => {
  const db = loadDB();
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  const db = loadDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json(db.settings);
});

// Categories (Recent Added Circular Pods)
app.get('/api/categories', (req, res) => {
  const db = loadDB();
  res.json(db.categories || []);
});

app.put('/api/categories/:id', (req, res) => {
  const db = loadDB();
  const idStr = decodeURIComponent(req.params.id);
  const index = (db.categories || []).findIndex(c => c.id === idStr || c.name === idStr);
  if (index === -1) {
    return res.status(404).json({ error: 'Catégorie introuvable : ' + req.params.id });
  }
  const oldName = db.categories[index].name;
  db.categories[index] = { ...db.categories[index], ...req.body };
  if (req.body.name && req.body.name !== oldName) {
    (db.products || []).forEach(p => {
      if (p.category === oldName || p.category === idStr) {
        p.category = req.body.name;
      }
    });
  }
  saveDB(db);
  res.json(db.categories[index]);
});

app.post('/api/categories', (req, res) => {
  const db = loadDB();
  if (!db.categories) db.categories = [];
  const name = (req.body.name || 'Nouvelle Catégorie').trim();
  const newCat = {
    id: req.body.id || name,
    name: name,
    image: req.body.image || '/uploads/cat_boubous.jpg',
    section: req.body.section || 'bespoke'
  };
  db.categories.push(newCat);
  saveDB(db);
  res.status(201).json(newCat);
});

app.delete('/api/categories/:id', (req, res) => {
  const db = loadDB();
  const idStr = decodeURIComponent(req.params.id);
  db.categories = (db.categories || []).filter(c => c.id !== idStr && c.name !== idStr);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Hero Slides (Homepage Customization)
app.get('/api/hero-slides', (req, res) => {
  const db = loadDB();
  res.json(db.heroSlides || []);
});

app.put('/api/hero-slides/:id', (req, res) => {
  const db = loadDB();
  const idNum = Number(req.params.id);
  const index = (db.heroSlides || []).findIndex(s => s.id === idNum || String(s.id) === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Slide introuvable' });
  }
  db.heroSlides[index] = { ...db.heroSlides[index], ...req.body };
  saveDB(db);
  res.json(db.heroSlides[index]);
});

app.put('/api/hero-slides', (req, res) => {
  const db = loadDB();
  if (Array.isArray(req.body)) {
    db.heroSlides = req.body;
    saveDB(db);
    return res.json(db.heroSlides);
  }
  res.status(400).json({ error: 'Format attendu : tableau de slides' });
});

// Products / Showroom Models
app.get('/api/products', (req, res) => {
  const db = loadDB();
  const { category, search } = req.query;
  let items = db.products || [];

  if (category && category !== 'Tous' && category !== 'All') {
    items = items.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const term = search.toLowerCase();
    items = items.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term) ||
      (p.tags && p.tags.some(t => t.toLowerCase().includes(term)))
    );
  }

  res.json(items);
});

app.post('/api/products', (req, res) => {
  const db = loadDB();
  const newProduct = {
    id: `prod-${Date.now().toString(36)}`,
    ...req.body,
    price: Number(req.body.price) || 0,
    turnaroundDays: Number(req.body.turnaroundDays) || 5,
    stockQuantity: Number(req.body.stockQuantity) || 1,
    featured: Boolean(req.body.featured)
  };
  db.products.unshift(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const db = loadDB();
  const idStr = decodeURIComponent(req.params.id);
  const index = db.products.findIndex(p => p.id === idStr || p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Modèle introuvable : ' + req.params.id });

  const updatedSection = req.body.section || db.products[index].section || (req.body.isCustomMade ? 'bespoke' : 'ready_to_wear');
  const isCustom = updatedSection === 'bespoke';

  db.products[index] = { 
    ...db.products[index], 
    ...req.body,
    section: updatedSection,
    isCustomMade: isCustom,
    price: Number(req.body.price ?? db.products[index].price),
    turnaroundDays: Number(req.body.turnaroundDays ?? db.products[index].turnaroundDays ?? 5),
    stockQuantity: Number(req.body.stockQuantity ?? db.products[index].stockQuantity)
  };
  saveDB(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', (req, res) => {
  const db = loadDB();
  db.products = db.products.filter(p => p.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Stages for Kanban
app.get('/api/stages', (req, res) => {
  const db = loadDB();
  res.json(db.stages || []);
});

// Orders & Tailoring Progress
app.get('/api/orders', (req, res) => {
  const db = loadDB();
  res.json(db.orders || []);
});

// Public Track Order by ID or Phone
app.get('/api/orders/track/:query', (req, res) => {
  const db = loadDB();
  const query = req.params.query.trim().toLowerCase();
  
  const found = (db.orders || []).find(o => 
    o.id.toLowerCase() === query || 
    (o.customerPhone && o.customerPhone.replace(/[^0-9]/g, '').includes(query.replace(/[^0-9]/g, '')))
  );

  if (!found) {
    return res.status(404).json({ error: 'Aucune commande trouvée pour la référence : ' + req.params.query });
  }

  res.json({
    order: found,
    stages: db.stages,
    atelier: {
      name: db.settings.atelierName,
      phone: db.settings.phone,
      displayPhone: db.settings.displayPhone,
      address: db.settings.address
    }
  });
});

// Accept / Confirm Order by Tailor
app.put('/api/orders/:id/accept', (req, res) => {
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });

  const daysRemaining = Number(req.body.daysRemaining) || order.daysRemaining || 5;
  const targetDate = new Date(Date.now() + daysRemaining * 86400000).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  order.isAcceptedByTailor = true;
  order.acceptedDate = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
  order.daysRemaining = daysRemaining;
  order.estimatedCompletionDate = req.body.estimatedCompletionDate || targetDate;
  order.tailoringStage = 'Commande Confirmée';
  order.stageIndex = 0;
  order.custodyState = 'Commande Acceptée - En Confection';

  if (!order.stageHistory) order.stageHistory = [];
  order.stageHistory.push({
    stage: 'Commande Confirmée',
    date: order.acceptedDate,
    note: req.body.note || `Commande acceptée par le tailleur. Délai estimé : ${daysRemaining} jours.`
  });

  saveDB(db);

  // Return WhatsApp URL to notify customer
  const cleanPhone = order.whatsapp || (order.customerPhone || '').replace(/[^0-9]/g, '');
  const greeting = `Bonjour ${order.customerName} ! Excellente nouvelle de la ${db.settings.atelierName} :`;
  const acceptMsg = `Votre commande [N° ${order.id}] a été *ACCEPTÉE & CONFIRMÉE* par notre Maître Tailleur.\n`;
  const timeMsg = `⏱️ Délai ajusté : *${daysRemaining} jours restants* (Livraison estimée : ${order.estimatedCompletionDate}).\n`;
  const balanceMsg = order.balanceOwed > 0 
    ? `💰 Acompte/Solde restant : ${order.balanceOwed.toLocaleString()} ${db.settings.currency}.\n` 
    : `✅ Règlement : Intégralement soldé.\n`;
  const measureMsg = `📍 Vous pouvez également passer à notre atelier pour votre séance de prise de mesures si nécessaire.\n`;
  const closing = `Merci de votre confiance !`;

  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`${greeting}\n\n${acceptMsg}${timeMsg}${balanceMsg}${measureMsg}\n${closing}`)}`;

  res.json({
    order,
    whatsappUrl: waUrl,
    suggestedMessage: `${greeting}\n\n${acceptMsg}${timeMsg}${balanceMsg}${measureMsg}\n${closing}`
  });
});

// Update Days Remaining & Timeline by Tailor
app.put('/api/orders/:id/timeline', (req, res) => {
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });

  if (req.body.daysRemaining !== undefined) {
    order.daysRemaining = Math.max(0, Number(req.body.daysRemaining));
  }
  if (req.body.estimatedCompletionDate) {
    order.estimatedCompletionDate = req.body.estimatedCompletionDate;
  }

  saveDB(db);
  res.json(order);
});

// Create Order (Calculates exact turnaround & estimated delivery timeframe)
app.post('/api/orders', (req, res) => {
  const db = loadDB();
  // 13-digit realistic ID matching the uploaded image (e.g. 3354654654526)
  const timestamp = Date.now().toString();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
  const orderId = `${timestamp.slice(0, 9)}${randomSuffix}`;
  
  const totalAmount = Number(req.body.totalAmount) || 0;
  const amountPaid = Number(req.body.amountPaid) || 0;
  const balanceOwed = Math.max(0, totalAmount - amountPaid);

  const turnaroundDays = Number(req.body.turnaroundDays) || 5;
  const targetDateObj = new Date(Date.now() + turnaroundDays * 86400000);
  const targetDateFormatted = targetDateObj.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const isAcceptedByTailor = Boolean(req.body.isAcceptedByTailor);

  const newOrder = {
    id: orderId,
    customerName: req.body.customerName || 'Client Bespoke',
    customerPhone: req.body.customerPhone || '',
    whatsapp: (req.body.customerPhone || '').replace(/[^0-9]/g, ''),
    items: req.body.items || [],
    totalAmount,
    amountPaid,
    balanceOwed,
    discount: Number(req.body.discount) || 0,
    deliveryFee: Number(req.body.deliveryFee) || 0,
    tax: 0,
    paymentMethod: req.body.paymentMethod || 'Acompte Virement / Espèces Atelier',
    paymentCard: req.body.paymentCard || 'Règlement Showroom',
    fabricStatus: req.body.fabricStatus || 'Tissu sélectionné au Showroom',
    tailoringStage: isAcceptedByTailor ? 'Commande Confirmée' : 'Demande en Attente',
    stageIndex: isAcceptedByTailor ? 0 : -1,
    isAcceptedByTailor,
    acceptedDate: isAcceptedByTailor ? new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : null,
    orderDate: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }),
    daysRemaining: turnaroundDays,
    estimatedCompletionDate: req.body.estimatedCompletionDate || targetDateFormatted,
    custodyState: isAcceptedByTailor ? 'En Confection à l\'Atelier' : 'En Attente de Confirmation',
    deliveryAddress: req.body.deliveryAddress || 'Retrait direct au Showroom Atelier',
    assignedArtisan: req.body.assignedArtisan || 'Maître Tailleur Rasheed',
    stageHistory: [
      {
        stage: isAcceptedByTailor ? 'Commande Confirmée' : 'Demande Envoyée',
        date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
        note: isAcceptedByTailor ? 'Commande validée par l\'atelier' : 'Demande reçue via le Showroom digital'
      }
    ],
    notes: req.body.notes || '',
    customMeasurements: req.body.customMeasurements || null
  };

  db.orders.unshift(newOrder);

  // Check / update Customer in CRM
  let customer = db.customers.find(c => 
    c.phone.replace(/[^0-9]/g, '') === (newOrder.customerPhone || '').replace(/[^0-9]/g, '')
  );

  if (customer) {
    customer.totalOrders = (customer.totalOrders || 0) + 1;
    customer.totalBilled = (customer.totalBilled || 0) + totalAmount;
    customer.totalPaid = (customer.totalPaid || 0) + amountPaid;
    customer.balanceOwed = (customer.balanceOwed || 0) + balanceOwed;
    if (newOrder.customMeasurements) {
      customer.measurements = { ...customer.measurements, ...newOrder.customMeasurements };
    }
  } else if (newOrder.customerName && newOrder.customerPhone) {
    db.customers.unshift({
      id: `cust-${Date.now().toString(36)}`,
      name: newOrder.customerName,
      phone: newOrder.customerPhone,
      whatsapp: newOrder.whatsapp,
      email: '',
      address: req.body.deliveryAddress || '',
      totalOrders: 1,
      totalBilled: totalAmount,
      totalPaid: amountPaid,
      balanceOwed: balanceOwed,
      custodyStatus: newOrder.custodyState,
      notes: `Commande ${orderId} créée le ${newOrder.orderDate}`,
      measurements: newOrder.customMeasurements || null
    });
  }

  saveDB(db);
  res.status(201).json(newOrder);
});

// Update order details / payments
app.put('/api/orders/:id', (req, res) => {
  const db = loadDB();
  const index = db.orders.findIndex(o => o.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Commande introuvable' });

  const existing = db.orders[index];
  const totalAmount = Number(req.body.totalAmount ?? existing.totalAmount);
  const amountPaid = Number(req.body.amountPaid ?? existing.amountPaid);
  const balanceOwed = Math.max(0, totalAmount - amountPaid);

  let stageHistory = existing.stageHistory || [];
  if (req.body.tailoringStage && req.body.tailoringStage !== existing.tailoringStage) {
    stageHistory.push({
      stage: req.body.tailoringStage,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      note: req.body.stageNote || `Statut mis à jour : ${req.body.tailoringStage}`
    });
  }

  db.orders[index] = {
    ...existing,
    ...req.body,
    totalAmount,
    amountPaid,
    balanceOwed,
    stageHistory
  };

  saveDB(db);
  res.json(db.orders[index]);
});

// Drag and drop Kanban stage change endpoint
app.put('/api/orders/:id/stage', (req, res) => {
  const db = loadDB();
  const order = db.orders.find(o => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: 'Commande introuvable' });

  const newStage = req.body.stage;
  const stages = db.stages || [];
  const stageIdx = stages.findIndex(s => s.name === newStage);

  order.tailoringStage = newStage;
  order.stageIndex = stageIdx >= 0 ? stageIdx : order.stageIndex;

  if (newStage === 'Repassage & Prêt au Retrait') {
    order.custodyState = order.balanceOwed > 0 ? 'Prêt à Retirer - Reste Solde' : 'Prêt au Retrait';
  } else if (newStage === 'Livré & Récupéré') {
    order.custodyState = order.balanceOwed > 0 ? 'Vêtement Récupéré - Reste Solde à Payer' : 'Livré & Soldé';
  }

  if (!order.stageHistory) order.stageHistory = [];
  order.stageHistory.push({
    stage: newStage,
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    note: req.body.note || `Déplacé sur le tableau Kanban vers: ${newStage}`
  });

  saveDB(db);

  // Return formatted WhatsApp message link for tailor
  const cleanPhone = order.whatsapp || (order.customerPhone || '').replace(/[^0-9]/g, '');
  const greeting = `Bonjour ${order.customerName} ! Message de ${db.settings.atelierName} :`;
  const statusLine = `Votre commande [${order.id}] est passée à l'étape : *${newStage}*.`;
  const balanceLine = order.balanceOwed > 0 
    ? `\n💰 Solde restant à régler : ${order.balanceOwed.toLocaleString()} ${db.settings.currency}\nBanque : ${db.settings.bankName} - ${db.settings.accountNumber}`
    : `\n✅ Paiement : Intégralement soldé.`;
  const closing = `\nMerci de votre confiance. Pour toute question : ${db.settings.displayPhone}`;

  const waText = encodeURIComponent(`${greeting}\n\n${statusLine}${balanceLine}\n${closing}`);
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${waText}`;

  res.json({
    order,
    whatsappUrl,
    suggestedMessage: `${greeting}\n\n${statusLine}${balanceLine}\n${closing}`
  });
});

app.delete('/api/orders/:id', (req, res) => {
  const db = loadDB();
  db.orders = db.orders.filter(o => o.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Customers CRM
app.get('/api/customers', (req, res) => {
  const db = loadDB();
  res.json(db.customers || []);
});

app.post('/api/customers', (req, res) => {
  const db = loadDB();
  const newCust = {
    id: `cust-${Date.now().toString(36)}`,
    ...req.body,
    totalOrders: Number(req.body.totalOrders) || 0,
    totalBilled: Number(req.body.totalBilled) || 0,
    totalPaid: Number(req.body.totalPaid) || 0,
    balanceOwed: Number(req.body.balanceOwed) || 0,
    measurements: req.body.measurements || { unit: 'pouces' }
  };
  db.customers.unshift(newCust);
  saveDB(db);
  res.status(201).json(newCust);
});

app.put('/api/customers/:id', (req, res) => {
  const db = loadDB();
  const index = db.customers.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Client introuvable' });

  db.customers[index] = {
    ...db.customers[index],
    ...req.body,
    totalBilled: Number(req.body.totalBilled ?? db.customers[index].totalBilled),
    totalPaid: Number(req.body.totalPaid ?? db.customers[index].totalPaid),
    balanceOwed: Number(req.body.balanceOwed ?? db.customers[index].balanceOwed)
  };
  saveDB(db);
  res.json(db.customers[index]);
});

app.delete('/api/customers/:id', (req, res) => {
  const db = loadDB();
  db.customers = db.customers.filter(c => c.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// In-App Web Messages (User sends message through web app)
app.get('/api/messages', (req, res) => {
  const db = loadDB();
  res.json(db.messages || []);
});

app.post('/api/messages', (req, res) => {
  const db = loadDB();
  if (!db.messages) db.messages = [];

  const newMsg = {
    id: `msg-${Date.now().toString(36)}`,
    senderName: req.body.senderName || 'Visiteur Showroom',
    phone: req.body.phone || '',
    content: req.body.content || '',
    date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    status: 'non-lu'
  };

  db.messages.unshift(newMsg);
  saveDB(db);
  res.status(201).json(newMsg);
});

app.delete('/api/messages/:id', (req, res) => {
  const db = loadDB();
  db.messages = (db.messages || []).filter(m => m.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Fabrics & Materials Stock
app.get('/api/fabrics', (req, res) => {
  const db = loadDB();
  res.json(db.fabrics || []);
});

app.post('/api/fabrics', (req, res) => {
  const db = loadDB();
  const newFabric = {
    id: `fab-${Date.now().toString(36)}`,
    ...req.body,
    yardsInStock: Number(req.body.yardsInStock) || 0,
    costPerYard: Number(req.body.costPerYard) || 0,
    retailPricePerYard: Number(req.body.retailPricePerYard) || 0,
    lowStockThreshold: Number(req.body.lowStockThreshold) || 10
  };
  db.fabrics.unshift(newFabric);
  saveDB(db);
  res.status(201).json(newFabric);
});

app.put('/api/fabrics/:id', (req, res) => {
  const db = loadDB();
  const index = db.fabrics.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Tissu introuvable' });

  db.fabrics[index] = {
    ...db.fabrics[index],
    ...req.body,
    yardsInStock: Number(req.body.yardsInStock ?? db.fabrics[index].yardsInStock),
    costPerYard: Number(req.body.costPerYard ?? db.fabrics[index].costPerYard),
    retailPricePerYard: Number(req.body.retailPricePerYard ?? db.fabrics[index].retailPricePerYard),
    lowStockThreshold: Number(req.body.lowStockThreshold ?? db.fabrics[index].lowStockThreshold)
  };
  saveDB(db);
  res.json(db.fabrics[index]);
});

app.post('/api/fabrics/:id/adjust-stock', (req, res) => {
  const db = loadDB();
  const index = db.fabrics.findIndex(f => f.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Tissu introuvable' });

  const delta = Number(req.body.delta) || 0;
  db.fabrics[index].yardsInStock = Math.max(0, (db.fabrics[index].yardsInStock || 0) + delta);
  saveDB(db);
  res.json(db.fabrics[index]);
});

app.delete('/api/fabrics/:id', (req, res) => {
  const db = loadDB();
  db.fabrics = db.fabrics.filter(f => f.id !== req.params.id);
  saveDB(db);
  res.json({ success: true, id: req.params.id });
});

// Multer & Base64 Upload
app.post('/api/upload', upload.single('image'), (req, res) => {
  if (req.file) {
    const fileUrl = `/uploads/${req.file.filename}`;
    return res.json({ url: fileUrl, filename: req.file.filename });
  }

  // Base64 data URL upload support
  if (req.body && (req.body.dataUrl || req.body.imageBase64)) {
    try {
      const raw = req.body.dataUrl || req.body.imageBase64;
      const matches = raw.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches.length === 3) {
        const ext = matches[1].split('/')[1]?.replace('jpeg', 'jpg') || 'jpg';
        const buffer = Buffer.from(matches[2], 'base64');
        const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
        const filePath = path.join(uploadsDir, filename);
        fs.writeFileSync(filePath, buffer);
        const fileUrl = `/uploads/${filename}`;
        return res.json({ url: fileUrl, filename });
      }
    } catch (e) {
      return res.status(500).json({ error: 'Erreur décodage base64 : ' + e.message });
    }
  }

  res.status(400).json({ error: 'Aucun fichier téléchargé' });
});

// Analytics & Financial Snapshot
app.get('/api/analytics', (req, res) => {
  const db = loadDB();
  const orders = db.orders || [];
  const customers = db.customers || [];
  const fabrics = db.fabrics || [];

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const totalCollected = orders.reduce((sum, o) => sum + (o.amountPaid || 0), 0);
  const totalDebtsOwed = customers.reduce((sum, c) => sum + (c.balanceOwed || 0), 0);

  // Clients qui ont récupéré leurs vêtements mais doivent encore de l'argent
  const collectedWithDebt = orders.filter(o => 
    (o.custodyState && o.custodyState.toLowerCase().includes('récupéré') && (o.balanceOwed || 0) > 0) ||
    (o.tailoringStage === 'Livré & Récupéré' && (o.balanceOwed || 0) > 0)
  );

  const activeOrdersInShop = orders.filter(o => 
    o.tailoringStage !== 'Livré & Récupéré'
  );

  const lowStockFabrics = fabrics.filter(f => 
    (f.yardsInStock || 0) <= (f.lowStockThreshold || 10)
  );

  res.json({
    totalRevenue,
    totalCollected,
    totalDebtsOwed,
    activeOrdersCount: activeOrdersInShop.length,
    collectedWithDebtCount: collectedWithDebt.length,
    collectedWithDebtTotal: collectedWithDebt.reduce((sum, o) => sum + (o.balanceOwed || 0), 0),
    collectedWithDebtList: collectedWithDebt,
    lowStockFabricsCount: lowStockFabrics.length,
    lowStockFabrics
  });
});

// Fallback to index.html for client routing
app.get('*', (req, res) => {
  const indexHtml = path.join(__dirname, '..', 'dist', 'index.html');
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    res.status(404).send('Atelier API active.');
  }
});

app.listen(PORT, () => {
  console.log(`Maison Toheeb Bespoke API Server active on port ${PORT}`);
});
