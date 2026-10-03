# LoomLedger — Basic Edition
*Inventory, POS billing, exhibitions & Shopify export for premium handloom saree retailers · by MS Tech Services*

Interactive demo of the **Basic package**. Runs entirely in the browser (data lives in `localStorage`), so every visitor gets a private copy to click through.

## What's in the Basic package
| Area | Included |
|---|---|
| **Masters** | Items (serial-tracked), vendors/weavers, customers, locations & plants (state-wise GSTIN), **Exhibition Master** with a unique code per exhibition, users |
| **Procurement** | Purchase orders (manual + **Excel/CSV upload with validation**), **GRN with QC and auto-generated serial numbers + printable tags**, purchase returns with debit note, local purchase |
| **Inventory** | Stock explorer, stock transfer (with challan), **exhibition reconciliation** (balance returns to Main), damage write-off & quarantine |
| **POS & Cash** | POS billing (scan/search, split payments, discounts, hold/resume), GST invoices, sales returns & exchanges with credit notes, **cash drawer, day-end / Z-report, petty cash** |
| **Shopify** | Sync queue + **file export** (orders, inventory, customers) in Shopify import format |
| **Reports** | 30 essential reports with filters, charts and CSV / Excel / print export |

### 7-step demo script
1. **Purchase Orders → Upload PO (Excel)** → *Use sample file* → note the validation errors → *Create POs*.
2. **GRN** → choose the PO → receive, reject one piece → *Post* → serial numbers + **Print tags**.
3. **POS Billing** → tap sarees → split Cash + UPI → *Complete sale* → GST invoice.
4. **Exhibition Master → Festive Weaves Hyderabad** (live) → switch location in the top bar and bill from the exhibition plant.
5. **Close exhibition → Reconcile** → mark damaged / missing → *Post* → stock returns to Main.
6. **Cash Drawer → Day End** → count denominations → close → Z-report.
7. **Shopify Sync → File export** → download orders / inventory / customers · **Reports Hub**.

*Settings → Reset demo data* restores the original dataset.

## Run locally
```bash
python -m http.server 8080   # then open http://localhost:8080
```

## Editions & white-labelling (internal notes)
- The edition is set in `js/edition.js` (`V.EDITION='basic'`). The full product keeps every module and all 117 reports (`main` branch); Basic hides premium screens, columns and reports entirely.
- Branding (name, tagline, logo, colours) is configurable. In the Basic build the branding panel is an internal tool — open **Settings** with `?admin` in the URL (e.g. `…/index.html?admin#/settings`). Defaults live in `js/brand.js`.

## Tech
Vanilla JS, Chart.js and SheetJS from cdnjs, Google Fonts. No build step; hash routing; relative paths so it works under any GitHub Pages sub-path.
