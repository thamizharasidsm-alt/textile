# LoomLedger — Heritage Saree Inventory, POS & Shopify Sync
*A product of MS Tech Services · white-label ready · interactive demo*

A fully working, **no-backend** web application prototype for a premium handloom saree retailer
(₹25,000+ pieces). Everything runs in the browser; data lives in `localStorage`, so each visitor gets
their own private copy of the demo and can click through real workflows end to end.

> Demo environment — the Shopify connection is simulated (queue, payloads, CSV exports are real in format; nothing is sent anywhere).

## What's inside

| Area | Highlights |
|---|---|
| **Masters** | Item master (serial/batch tracking), vendors/weavers, customer CRM with tiers & preferences, locations/plants with state-wise GSTIN, **Exhibition Master** (unique code per exhibition + auto plant), users & roles |
| **Procurement** | PO with **Excel/CSV upload + row-level validation**, **GRN with QC and auto-generated serial (default) or batch numbers + QR/barcode tags**, purchase returns with debit notes, local purchase, vendor ledger & advances |
| **Inventory** | Stock explorer (gallery/table), **serial life-cycle trace**, stock transfer (e-way bill for inter-state), **exhibition reconciliation** (Opening = Sold + Returned + Damaged + Missing → balance auto-returns to Main), scan-based audit, adjustments, labels |
| **POS & Cash** | Touch-friendly POS (scan/search, split payments, discount limits with manager PIN, hold/resume, advance booking), GST invoices (CGST/SGST vs IGST), approval-on-sight, sales returns/exchanges with credit notes, **cash drawer, day-end/Z-report, petty cash** |
| **Shopify** | API-style sync console (queue, retry, payload viewer, mapping) **or file export** in Shopify CSV format (orders, inventory, customers, products) |
| **Reports Hub** | **117 reports** in 11 families — filter by period/location, chart + table, export CSV / Excel / print |
| **Admin** | Approvals inbox, Excel import centre (items, customers, opening stock), audit trail, GST & e-way register, settings |

Demo data: ~6 months of trading, 4 exhibitions (2 reconciled, **1 live in Hyderabad**, others planned), ~215 invoices, 300+ serial-tracked sarees.

### Suggested demo script (8 minutes)
1. **Dashboard** → "Guided demo path" strip.
2. **Purchase Orders → Upload PO (Excel)** → *Use sample file* → note the validation errors → *Create POs*.
3. **GRN → New GRN** → pick the PO → receive, reject 1 → preview serials → *Post* → **Print tags**.
4. **POS Billing** → scan/tap sarees → add a 10% discount (cashier limit 5% → manager PIN **1234**) → split Cash + UPI → *Complete sale* → invoice.
5. **Exhibitions → Festive Weaves Hyderabad** (live) → bill from the exhibition plant via the location switcher in the top bar.
6. **Exhibitions → Close exhibition → Reconcile** → scan / mark damaged & missing → *Post* → balance returns to Main.
7. **Cash Drawer → Day End** → count denominations → close → bills are released to Shopify.
8. **Shopify Sync** → run sync / download CSVs · **Reports Hub** → show any of the 117 reports.

### White-labelling
**Settings → White-label branding** lets you change the application name, tagline, client business name, "Powered by" line, monogram, **logo upload** and primary/accent colours (with presets and a live preview). It is applied to the sidebar, browser-tab title/favicon, hero, invoices and export file names, and stored separately from demo data (Reset demo data keeps it). **Export / Import brand** moves a brand file between clients; edit `DEF` in `js/brand.js` to ship a pre-branded build.

Use **Settings → Reset demo data** at any time to restore the original dataset.

## Run locally
No build step. Any static file server works:

```bash
python -m http.server 8080
# open http://localhost:8080
```

## Publish on GitHub Pages
1. Create a new GitHub repository and push the contents of this folder (it must contain `index.html` at the root).
2. Repository → **Settings → Pages → Build and deployment → Deploy from a branch** → `main` / `/ (root)`.
3. Wait a minute — the app is live at `https://<user>.github.io/<repo>/`.

All asset paths are relative and routing is hash-based (`#/pos`), so it works under any sub-path and supports deep links.

## Tech notes
- Vanilla JS (no framework / bundler), Chart.js and SheetJS from cdnjs, Google Fonts (Cormorant Garamond + Inter).
- Seeded, deterministic data generator in `js/seed.js`; business rules in `js/logic.js`; reports in `js/reports.js`.
- Light/dark themes, responsive down to phone width, keyboard accessible, `prefers-reduced-motion` respected.

## Not production code
Auth, multi-user concurrency, a real Shopify Admin API client, GST e-invoicing/e-way bill APIs and hardware (printer/scanner/cash drawer) integrations are intentionally out of scope for this prototype.
