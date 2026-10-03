# LoomLedger — Heritage Saree Inventory, POS & Shopify Sync
*A product of MS Tech Services · white-label ready · interactive demo (runs fully in the browser)*

Two editions share one code base; `js/edition.js` decides which one is built:
`V.EDITION='basic'` (first-demo package) or `'premium'` (everything). Premium features are hidden, never locked.

## Demo flow (start from scratch)
1. **Sign in** — pick a demo user or type credentials (demo password for all accounts: `demo123`). Each role sees only its own menus; the Owner can add users, create roles and assign menus under **Users & Roles**.
2. **Settings → Data management → Wipe transactions** (type `WIPE`). Stock, sales and every record go to zero; masters, users and roles stay. *Wipe everything* also clears items, vendors and customers (then press **Load sample masters**). **Reset to default** restores the full sample data at any time.
3. **Purchase Orders → Upload PO** with `samples/Sample_PO_Upload.csv` (or the in-app *Sample PO* download / *Use sample file*).
4. **GRN** → pick the PO → QC → serial numbers + tags.
5. **Exhibition Master → Go live**, **Stock Transfer** Main → exhibition plant (receive it), switch location in the top bar and **bill** from the plant.
6. **Reconcile** the exhibition (balance returns to Main) → **Day End** → **Shopify** file export → **Reports**.

## Feature map
| Area | Basic | Premium adds |
|---|---|---|
| Access | Login, users, roles & per-role menu access | — |
| Masters | Items (serial), vendors, customers, locations, exhibitions (unique code each) | Batch tracking, ratings, tiers & loyalty, targets/P&L |
| Procurement | PO + Excel upload, GRN with serials & tags, purchase returns, local purchase | PO approvals, direct GRN, vendor ledger, batch numbering |
| Inventory | Stock list, transfer + challan, exhibition reconciliation, damage write-off | Gallery, serial trace, stock audit, e-way bills, labels page, repricing |
| POS & cash | Billing, GST invoices, sales returns, cash drawer, day-end, petty cash | Manager-PIN overrides, bookings/holds/trials, WhatsApp share |
| Shopify | File export + queue | API-style console, mapping, retry, payload viewer |
| Reports | 30 essential | all 117 |
| Admin | Settings, data wipe/reset | Approvals, import centre, audit trail, GST & e-way |
| Photos | Optional product photos (Settings toggle) | same |

## Run locally
```bash
python -m http.server 8080   # then open http://localhost:8080
```

## White-label
Name, tagline, logo, colours, client business and owner name are configurable (Settings → White-label branding; in the Basic build open Settings with `?admin` in the URL). Defaults live in `js/brand.js`.

## Tech
Vanilla JS, Chart.js and SheetJS from cdnjs, Google Fonts. No build step; hash routing; relative paths so it works under any GitHub Pages sub-path. Data and sessions live in `localStorage` (authentication is demo-grade, not for production).
