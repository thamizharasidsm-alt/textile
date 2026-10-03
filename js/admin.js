/* Data management: wipe (start from scratch), load sample masters, guided empty-state */
(function(){
const $=V.$;
const TX=['pieces','moves','pos','grns','invoices','transfers','recons','salesReturns','purchaseReturns','drawers','petty','sync','audit','labels','localPurchases','vpay','adjustments','audits','holds','trials','bookings','approvals','wishlist','sessions','exports','heldBills'];
V.isBlank=()=>{const d=V.db;return !d.pos.length&&!d.grns.length&&!d.invoices.length};
V.wipe=mode=>{const d=V.db;TX.forEach(k=>d[k]=[]);d.seq={};
 d.customers.forEach(c=>{c.spend=0;c.loyalty=0;c.credit=0;c.tier='Silver';delete c.last});
 d.exhibitions.forEach(e=>e.status='Planned');d.locations.forEach(l=>{if(l.type==='Exhibition')l.status='Planned'});
 if(mode==='all'){d.items=[];d.vendors=[];d.customers=[];d.exhibitions=[];d.locations=d.locations.filter(l=>l.type!=='Exhibition')}
 d.wiped=mode;d.today=V.iso(new Date());
 d.sessions.push({t:d.today+' '+V.now(),user:V.S.user,ev:'Login',ip:'demo',dev:'Desktop'});
 d.audit.push({t:d.today+' '+V.now(),user:V.S.user,act:mode==='all'?'All data wiped':'Transactions wiped',ref:''});
 V.S.pos=null;V.S.grn=null;V.save();try{localStorage.removeItem('vk_loc')}catch(e){}location.hash='#/dashboard';location.reload()};
V.loadSampleMasters=()=>{const cur=V.db;V.seed();const f=V.db;V.db=cur;
 cur.items=f.items;cur.vendors=f.vendors;cur.customers=f.customers.map(c=>Object.assign(c,{spend:0,loyalty:0,credit:0,tier:'Silver'}));cur.exhibitions=f.exhibitions.map(e=>Object.assign(e,{status:'Planned'}));
 cur.locations=f.locations.map(l=>l.type==='Exhibition'?Object.assign(l,{status:'Planned'}):l);cur.wiped='transactions';V.L.idx();V.save()};
const confirmWipe=(mode,title,txt)=>V.modal({title,body:`<p style="margin-top:0">${txt}</p>${V.field('Type <b>WIPE</b> to confirm','<input id="wipe-c" autocomplete="off" placeholder="WIPE">')}`,foot:[{l:'Cancel'},{l:'Wipe data',cls:'danger',fn:()=>{if($('#wipe-c').value.trim().toUpperCase()!=='WIPE'){V.toast('Type WIPE to confirm','bad');return false}V.wipe(mode)}}]});
V.acts.wipeTx=()=>confirmWipe('tx','Wipe all transactions',"Deletes every purchase order, GRN, stock piece, invoice, transfer, return, cash and sync record — <b>stock and sales become zero</b>. Masters (items, vendors, customers, exhibitions, users, roles) are kept so you can start from <b>uploading a PO</b>. Use <i>Reset to default data</i> any time to bring the demo data back.");
V.acts.wipeAll=()=>confirmWipe('all','Wipe everything',"Deletes all transactions <b>and</b> masters — items, vendors, customers and exhibitions. Only users, roles, settings and your main/vault locations remain. You can add masters by hand or press <i>Load sample masters</i>. Use <i>Reset to default data</i> to restore the full demo.");
V.acts.loadMasters=()=>{V.loadSampleMasters();V.toast('Sample masters loaded — items, vendors, customers, exhibitions');V.refresh()};
V.acts.resetDefault=async()=>{if(await V.confirm('Restore the original demo dataset (six months of trading, 4 exhibitions)? Current data will be replaced.','Reset to default',true))V.resetDemo()};
V.dataCard=()=>V.can('settings')?V.card('Data management','Start every demo from a clean slate — or restore the full sample data',`<div class="g g3" style="gap:14px">
 <div class="card flat"><h4>Reset to default data</h4><p class="mute sm">Restores the complete sample dataset: 6 months of sales, stock, exhibitions and reports.</p><button class="btn" data-act="resetDefault">${V.ic('return')} Reset to default</button></div>
 <div class="card flat" style="border-color:var(--gold)"><span class="ribbon">Recommended for demos</span><h4 style="margin-top:8px">Wipe transactions</h4><p class="mute sm">Zero stock, zero sales. Keeps masters and users — then start with <b>Upload PO → GRN → Exhibition transfer → Billing</b>.</p><button class="btn danger" data-act="wipeTx">${V.ic('trash')} Wipe transactions</button></div>
 <div class="card flat"><h4>Wipe everything</h4><p class="mute sm">Also removes items, vendors, customers and exhibitions. Start fully blank, or reload sample masters.</p><div class="row"><button class="btn danger" data-act="wipeAll">${V.ic('trash')} Wipe everything</button>${V.db.items.length?'':`<button class="btn sm primary" data-act="loadMasters">Load sample masters</button>`}</div></div></div>
 <p class="xs mute" style="margin-bottom:0">Current data: ${V.num(V.db.pieces.length)} stock pieces · ${V.num(V.db.invoices.length)} invoices · ${V.num(V.db.grns.length)} GRNs · ${V.num(V.db.pos.length)} purchase orders${V.db.wiped?' · <b>wiped state</b>':''}.</p>`,'mt'):'';
const pg=V.pages.settings;if(pg){const r0=pg.render;pg.render=(...a)=>V.dataCard()+r0.apply(pg,a)}
// ---- guided empty state (dashboard) -----------------------------------------------
V.onboard=()=>{const d=V.db,noMasters=!d.items.length,me=V.me();
 const step=(n,t,s,btns,done)=>`<div class="card" style="position:relative"><span style="position:absolute;right:16px;top:8px;font:700 44px var(--f-num);color:var(--gold2);opacity:.45">${n}</span><h3>${t}</h3><p class="mute sm">${s}</p><div class="row">${btns}</div></div>`;
 return `<div class="hero"><div class="txt"><div class="tag">${V.art.lotus(18,'#fff')} Fresh start</div><h1>Namaste, ${V.esc(V.greetName())}.</h1><p>The books are at zero. Follow the flow below to take stock from the weaver's loom to the customer's hands.</p></div><div class="art">${V.art.arch()}</div></div>
 ${noMasters?`<div class="login-note mt" style="border-color:var(--warn)"><b>No masters yet.</b> Add items and vendors by hand, or <button class="btn sm primary" data-act="loadMasters">Load sample masters</button> so the sample PO file works.</div>`:''}
 <div class="g g3 mt">${step(1,'Upload a purchase order','Upload an Excel sheet — rows are validated against vendor and item masters.',`<button class="btn gold" data-act="poSample" data-bad="0">${V.ic('download')} Sample PO file</button><a class="btn" href="#/po">${V.ic('upload')} Open Purchase Orders</a>`)}
 ${step(2,'Receive goods (GRN)','Pick the PO, record QC, and get a unique serial number and tag for every saree.',`<a class="btn primary" href="#/grn/new" data-act="grnFresh">${V.ic('truck')} Start a GRN</a>`)}
 ${step(3,'Send stock to an exhibition','Go live with an exhibition (own plant & GSTIN), then transfer sarees from Main.',`<a class="btn" href="#/exhibitions">${V.ic('flag')} Exhibitions</a><a class="btn" href="#/transfer">${V.ic('swap')} Stock transfer</a>`)}
 ${step(4,'Bill the customer','Bill at the showroom or switch the top-bar location to the exhibition plant.',`<a class="btn primary" href="#/pos">${V.ic('cart')} Open POS</a>`)}
 ${step(5,'Reconcile & close','Reconcile the exhibition, close the day, and export orders to Shopify.',`<a class="btn" href="#/recon">${V.ic('layers')} Reconcile</a><a class="btn" href="#/dayend">${V.ic('clock')} Day end</a>`)}
 ${step(6,'See the reports','Every movement lands in the reports hub automatically.',`<a class="btn" href="#/reports">${V.ic('chart')} Reports</a>`)}</div>`};
})();
