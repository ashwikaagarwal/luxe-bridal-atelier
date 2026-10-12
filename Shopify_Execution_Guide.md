# Shopify Execution & Developer Implementation Guide
## Luxe Bridal Atelier — Step-by-Step Technical Blueprint

This guide explains **exactly how to execute and build** each phase of the luxury bridal e-commerce ecosystem on Shopify.

---

## 🛠️ Step 1: Development Environment & Shopify CLI Setup

### 1.1 Create Shopify Partner Account & Dev Store
1. Go to [partners.shopify.com](https://partners.shopify.com/) and register for a free Shopify Partner Account.
2. In your Partner Dashboard, click **Stores ➔ Add Store ➔ Create development store**.
3. Select **"Create a store for a client"** (or Developer Preview with Checkout Extensibility enabled).

### 1.2 Install Shopify CLI
Open your terminal (PowerShell) and install the official Shopify CLI:
```powershell
npm install -g @shopify/cli @shopify/theme
```
Authenticate your CLI with your store:
```powershell
shopify auth login
```

---

## 📦 Step 2: Executing Phase 0 — Metafields & Data Architecture

Before writing code, configure Shopify's data layer in the Admin panel:

### 2.1 Define Product Metafields
Go to **Shopify Admin ➔ Settings ➔ Custom Data ➔ Products ➔ Add Definition**:
* `craftsmanship.hours` (Type: Integer, Description: Total handcrafting hours)
* `craftsmanship.artisan_guild` (Type: Single-line text, Description: Workshop/Region provenance)
* `craftsmanship.lead_time_weeks` (Type: Integer, Default: 6)

### 2.2 Define Order Metafields
Go to **Shopify Admin ➔ Settings ➔ Custom Data ➔ Orders ➔ Add Definition**:
* `bridal.event_date` (Type: Date, Description: Client's wedding date)
* `bridal.sizing_mode` (Type: Single-line text, Values: `STANDARD` | `CUSTOM_BESPOKE`)
* `bridal.measurement_status` (Type: Single-line text, Values: `PENDING` | `SUBMITTED` | `VERIFIED`)
* `bridal.measurements_json` (Type: JSON, Stores 8 anatomical measurements)
* `bridal.assigned_vendor_id` (Type: Single-line text, Identifier for external workshop)
* `bridal.qc_status` (Type: Single-line text, Values: `PENDING` | `PASSED` | `FAILED`)

---

## 🎨 Step 3: Executing Phase 1 — Storefront Theme & Sizing Architecture

### 3.1 Scaffold the Theme
Clone Shopify's Online Store 2.0 reference theme (Dawn):
```powershell
shopify theme init luxe-bridal-theme --clone-url https://github.com/Shopify/dawn.git
cd luxe-bridal-theme
shopify theme dev --store your-bridal-store.myshopify.com
```

### 3.2 Add the Sizing Switcher (Line Item Properties)
Create a new snippet `snippets/bridal-sizing-selector.liquid`:

```liquid
<div class="bridal-sizing-module" data-lead-weeks="{{ product.metafields.craftsmanship.lead_time_weeks.value | default: 6 }}">
  
  <!-- Sizing Mode Toggle -->
  <label class="font-bold text-sm">Select Sizing Option:</label>
  <div class="sizing-toggle-buttons flex gap-2 my-2">
    <button type="button" id="btnStandard" class="active-size-tab px-4 py-2 border text-xs" onclick="setBridalSizing('Standard')">
      Standard Sizes (XS–3XL)
    </button>
    <button type="button" id="btnBespoke" class="px-4 py-2 border text-xs" onclick="setBridalSizing('Custom Bespoke')">
      Custom Bespoke (48-Hr Grace) ✨
    </button>
  </div>

  <!-- Hidden input passed to Shopify Cart as Line Item Property -->
  <input type="hidden" name="properties[_SizingMode]" id="sizingModeInput" value="Standard">

  <!-- Wedding Date Picker -->
  <div class="mt-4 p-3 border rounded bg-slate-50">
    <label class="block text-xs font-semibold uppercase">Your Wedding / Event Date *</label>
    <input type="date" name="properties[Wedding Date]" id="bridalWeddingDate" required 
           class="w-full border p-2 text-xs mt-1" onchange="validateEventBuffer(this.value)">
    <p id="bufferAlertText" class="text-xs text-gray-500 mt-1"></p>
  </div>

  <!-- Mandatory Final Sale Consent -->
  <div class="mt-3 flex items-start gap-2">
    <input type="checkbox" id="finalSaleConsent" required class="mt-1">
    <label for="finalSaleConsent" class="text-xs leading-normal">
      I acknowledge that this couture piece is custom made-to-order and is strictly <strong>Final Sale</strong> (No refunds once artisan crafting commences).
    </label>
  </div>
</div>

<script>
  function setBridalSizing(mode) {
    document.getElementById('sizingModeInput').value = mode;
    document.getElementById('btnStandard').classList.toggle('active-size-tab', mode === 'Standard');
    document.getElementById('btnBespoke').classList.toggle('active-size-tab', mode === 'Custom Bespoke');
  }

  function validateEventBuffer(selectedDate) {
    const eventTime = new Date(selectedDate).getTime();
    const now = new Date().getTime();
    const daysUntilEvent = Math.ceil((eventTime - now) / (1000 * 60 * 60 * 24));
    const alertBox = document.getElementById('bufferAlertText');

    if (daysUntilEvent < 28) {
      alertBox.innerHTML = '<span class="text-red-600 font-bold">⚠️ Rush Order:</span> Minimum 4 weeks needed for artisan production.';
    } else {
      alertBox.innerHTML = `<span class="text-green-600 font-semibold">✓ Guaranteed buffer:</span> Outfit will arrive 10 days before your wedding.`;
    }
  }
</script>
```

Include this snippet inside `sections/main-product.liquid` right above the add-to-cart button.

---

## 🔄 Step 4: Executing Phase 2 — App Proxy & 48-Hour Flow Automation

### 4.1 Scaffold the Custom Shopify App
Run the Shopify App CLI generator:
```powershell
npm create @shopify/app@latest -- --template remix
cd luxe-bridal-app
shopify app dev
```

### 4.2 Configure the App Proxy (Bespoke Measurement Studio)
In your `shopify.app.toml` configuration:
```toml
[app_proxy]
url = "https://your-app-domain.com/api/measurements"
subpath = "measurements"
prefix = "apps"
```
Now, whenever a customer visits `https://your-bridal-store.com/apps/measurements?token=ABC123XYZ`, Shopify proxies the request directly to your Remix app while rendering within the store's header and footer!

### 4.3 Configure the Shopify Flow Automated 48-Hour Sequence
In **Shopify Admin ➔ Apps ➔ Shopify Flow ➔ Create Workflow**:
1. **Trigger:** `Order Created`
2. **Condition:** Check if `order.lineItems.customAttributes` contains `_SizingMode == 'Custom Bespoke'`.
3. **Action 1:** Send HTTP Request to Twilio / WhatsApp API (Sends greeting and secure `/apps/measurements` link).
4. **Action 2 (Wait):** Wait 24 Hours.
5. **Condition 2:** Check if Order Metafield `bridal.measurement_status == 'PENDING'`.
6. **Action 3:** Send WhatsApp reminder (*"24 hours remaining to lock your artisan tailoring timeline"*).
7. **Action 4 (Wait):** Wait 16 Hours.
8. **Action 5:** Urgent WhatsApp nudge (*"8 hours remaining"*).

---

## 🧵 Step 5: Executing Phase 3 — Self-Service Artisan Vendor Portal

### 5.1 Vendor Authentication & Route
Inside your Remix custom app, create the route `app/routes/vendor.$vendorId.tsx`:
* Queries orders using the Shopify Admin GraphQL API:
```graphql
query GetVendorOrders($vendorTag: String!) {
  orders(first: 50, query: $vendorTag) {
    edges {
      node {
        id
        name
        createdAt
        customAttributes {
          key
          value
        }
        metafield(namespace: "bridal", key: "measurements_json") {
          value
        }
        metafield(namespace: "bridal", key: "event_date") {
          value
        }
      }
    }
  }
}
```

### 5.2 1-Click PDF Tech-Pack Generator
Install `pdfkit` in your app:
```bash
npm install pdfkit
```
Create an endpoint `app/routes/api.techpack.$orderId.ts` that generates a printable spec sheet containing:
* Order ID and Client Wedding Date
* Technical Garment Specs & SKU
* The 8 anatomical measurements parsed from `bridal.measurements_json`
* Internal artisan milestone sign-off checklist

---

## 🔍 Step 6: Executing Phase 4 — Central Atelier QC & Courier Dispatch

### 6.1 Central QC Tablet Scanner
Create a staff route `app/routes/admin.qc.tsx`:
* Uses HTML5 Barcode/QR camera scanner (`html5-qrcode` library).
* Scanning the package barcode pulls up the order and displays the 5-point verification checklist:
  1. Bust, Waist, Length tolerance check (±0.5").
  2. Zardozi stitch tension.
  3. Internal seam margins (+3" verified).
  4. Stain & finish inspection.
  5. Fabric weight check.
* Inspector snaps 2 photos via tablet camera.
* Submitting updates the Order Metafield `bridal.qc_status = 'PASSED'`.

### 6.2 Trigger Insured Courier Label (DHL / FedEx)
When `bridal.qc_status` becomes `PASSED`:
* The app calls the Shopify Fulfillment API:
```graphql
mutation fulfillmentCreate($fulfillment: FulfillmentInput!) {
  fulfillmentCreate(fulfillment: $fulfillment) {
    fulfillment {
      id
      status
      trackingInfo {
        number
        url
      }
    }
  }
}
```
* Generates the insured shipping label, updates tracking, and dispatches the standard Shopify shipment notification email to the bride!
