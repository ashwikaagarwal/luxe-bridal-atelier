# Maison Étoile — Luxe Bridal Atelier

> **Haute Couture Bridal E-Commerce & Artisan Platform on Shopify**  
> An elite digital bridal salon delivering bespoke, handcrafted luxury wedding couture through a hybrid private-label and local artisan workshop model.

---

## 🌟 Architecture & Implemented Modules

```
luxe-bridal/
├── shopify-theme/                   # Shopify Online Store 2.0 Theme Components
│   ├── snippets/
│   │   └── bridal-sizing-selector.liquid    # Dual sizing toggle & wedding date buffer
│   ├── sections/
│   │   └── main-bridal-product.liquid       # Luxury editorial PDP section
│   └── assets/
│       ├── bridal-atelier.css               # Haute couture luxury styling
│       └── bridal-atelier.js                # Buffer validation & final sale gating
├── measurement-studio/              # Shopify App Proxy Portal (/apps/measurements)
│   └── index.html                           # 8-metric client form, 48h countdown & ratio checks
├── vendor-portal/                   # Self-Service Artisan Workshop Portal
│   └── index.html                           # Assigned order queue, 1-click tech-pack & milestones
├── central-qc-hub/                  # Central Atelier Quality Control Station
│   └── index.html                           # Barcode scanner, 5-point QC checklist & DHL label trigger
├── shopify-flow/                    # Workflow Automation
│   └── 48h-reminder-workflow.json           # Importable 48-hour WhatsApp/Email reminder sequence
├── BRD.md                           # Business Requirement Document
├── PRD.md                           # Product Requirement Document
├── Implementation_Plan.md           # 10-Week Shopify Implementation Roadmap
└── Shopify_Execution_Guide.md       # Developer CLI & Technical Execution Guide
```

---

## 🚀 Key Functional Capabilities

1. **48-Hour Flexible Bespoke Sizing (Option C):**
   * Brides can lock their master artisan's production slot immediately with 100% upfront payment, and submit measurements within 48 hours via `/apps/measurements`.
2. **Dynamic Wedding Date Buffer Calculator:**
   * Calculates days until event and alerts customers if their date is comfortable (≥45 days), tight (28–44 days), or requires an express rush fee (<28 days).
3. **Mandatory Final Sale Legal Gating:**
   * Enforced in both theme JavaScript and checkout validation rules to protect custom crafting capital.
4. **Self-Service Artisan Workshop Portal:**
   * Local embroiderers and tailors log in, view assigned orders, download printable PDF tech-packs with exact measurements, and update crafting stages (*Cut ➔ Embroidered ➔ Tailored ➔ Dispatched*).
5. **Central Atelier 5-Point Quality Control:**
   * Physical tape measurement verification (tolerance ±0.5"), stitch tension check, daylight lamp inspection, and mandatory photo archival before automated DHL Express label generation.
6. **Automated Shopify Flow Reminder Pipeline:**
   * Webhook sequence triggering WhatsApp reminders at T+0h, T+24h, and T+40h for pending measurements.

---

## 📖 Documentation Quicklinks

* 📋 **[Product Requirement Document (PRD)](PRD.md)**
* 💼 **[Business Requirement Document (BRD)](BRD.md)**
* 🗺️ **[10-Week Implementation Plan](Implementation_Plan.md)**
* 🛠️ **[Shopify Execution Guide](Shopify_Execution_Guide.md)**
