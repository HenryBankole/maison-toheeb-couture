# TOHEEB BESPOKE HAUTE COUTURE
### Master African Tailoring, Bespoke Kaftans, Filas & Artisanal Fragrances

A full-stack bespoke tailoring e-commerce storefront and operations management system tailored specifically for West African bespoke tailoring enterprises.

---

## 🌟 Key Features

### 1. Storefront & E-Commerce Catalog
- **Good Luck Garments**: Senator suits, presidential ceremonial outfits, Agbada 3-piece regalias.
- **Bespoke Kaftans**: Modern cut kaftans, Austrian Guinea brocades, Irish linen jalabiyas.
- **Filars / Filas**: Traditional Yoruba Aso-Oke handwoven caps, embroidered Gobi, and royal Abeti-Aja flap caps.
- **Perfumes & Fragrances**: Rare Cambodian agarwood extracts (Oud Al-Maliki), alcohol-free pure oil attars, and Bakhoor garment mists.
- **Portfolio & Lookbook**: Showcase of dignitary commissions, weddings, and couture archives.
- **Interactive Measurement Guide**: Illustrated instructions for neck, chest, shoulder, sleeve, kaftan length, and cap circumference.

### 2. Automated WhatsApp Order Dispatcher
- Customers select garments, fabrics, and either standard sizing or exact custom measurements.
- Real-time message preview formatted with royal atelier branding.
- Clicking **"Order via WhatsApp"**:
  1. Instantly logs the order in the backend database with a unique tracking code (e.g. `TB-1055`).
  2. Dispatches a clean pre-filled WhatsApp message directly to the Master Tailor's phone number configured in Settings.

### 3. Public Live Order Tracker (Customer Self-Service)
- Customers enter their **Order Reference** (e.g. `TB-1045`) or WhatsApp phone number.
- Displays an interactive **9-stage visual progress stepper**:
  1. Fabric Received
  2. Measurements Verified
  3. Pattern Cutting
  4. Sewing & Stitching
  5. Embroidery & Detailing
  6. Ready for Fitting
  7. Quality Control & Ironing
  8. Ready for Pickup
  9. Delivered
- Tailor notes and direct master artisan WhatsApp button.

### 4. Tailor Business Operations Dashboard (Backend)
- **Tailoring Stage Pipeline & Kanban**:
  - Filter by Order ID, Tailoring Stage, or Payment Status (inspired by clean mobile UI).
  - **1-Click "Advance Stage"**: Automatically moves the garment to the next stage, adds a log note, and creates an automated WhatsApp status notification for the customer.
  - **Printable "Artisan Job Card & Cutting Slip"**: One-click printable cutting slip for sewing workshop apprentices with customer measurements and sketch notes.
- **Model & Catalog Manager**:
  - Add new garment or perfume models.
  - Edit prices, turnaround times, and descriptions.
  - Change photos by uploading local images, picking from the built-in curated luxury presets, or pasting external URLs.
- **Fabric Rolls & Material Stock Control**:
  - Track yards/meters in stock for Italian wool, Irish linen, Brocade, Cashmere, and Aso-Oke.
  - Low stock warning badges.
  - Quick adjust buttons (`+5 yds`, `-4 yds`).
- **Customer CRM & Debt Ledger**:
  - Customer directory with full order histories.
  - **⚠️ Urgent Debt Recovery Flag**: High-visibility warning for clients who have **collected their garments but still owe money**.
  - **1-Click WhatsApp Payment Reminder**: Automatically generates a courteous, itemized invoice with the atelier's bank transfer credentials.
  - **Digital Body Measurements Vault**: Permanent digital measurement card for every customer.

---

## 🚀 Running the Project

### Development Mode (Concurrent Frontend & Backend)
```bash
npm run dev
```
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:5000`

### Production Mode (Single Port 5000)
```bash
npm run build
npm run server
```
- Complete application served directly at `http://localhost:5000`.

---

## ⚙️ Configuration

In the Tailor Dashboard under **"WhatsApp & Settings"**, you can configure:
- **WhatsApp Phone Number**: Format `2348012345678` (no `+` or spaces).
- **Atelier Name & Tagline**.
- **Bank Name, Account Number & Account Name** for payment reminders.
- **Currency Symbol** (₦, $, £).
