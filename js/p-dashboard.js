/* Dashboard — owner overview with infographics */
(function(){
const sumNet=a=>V.sum(a,i=>i.net);
V.stockUnits=(f)=>V.db.pieces.filter(f||(p=>p.status==='in_stock'&&p.qty>0));
V.pipeline=function(){
  const d=V.db,recv=V.sum(d.grns,g=>V.sum(g.lines,l=>l.acc)),openPO=d.pos.filter(p=>!['Closed','Draft'].includes(p.status)),
  main=d.pieces.filter(p=>p.loc==='MAIN'&&p.status==='in_stock').reduce((s,p)=>s+p.qty,0),
  plants=d.pieces.filter(p=>p.loc.startsWith('P-')&&p.status==='in_stock').reduce((s,p)=>s+p.qty,0),
  sold=V.sum(d.invoices,i=>V.sum(i.lines,l=>l.qty)),ret=V.sum(d.salesReturns,r=>r.lines.length),
  nodes=[['Vendor POs',openPO.length,'open orders','#8A6420'],['GRN Inward',recv,'units received','#1E2A5E'],['Main Showroom',main,'units in stock',V.brand.primary],['Exhibitions',plants,'units at plants','#0F6B6B'],['Sold',sold,'units billed','#2E8B57'],['Returns',ret,'sales returns','#B3261E']];
  const W=1000,H=170,step=W/nodes.length;let s='';
  nodes.forEach((n,i)=>{const x=i*step+12,w=step-24;
    if(i<nodes.length-1){const x2=(i+1)*step+12,th=Math.max(8,Math.min(44,12+n[1]/Math.max(1,nodes[1][1])*40));s+=`<path d="M${x+w} ${70-th/2} C ${x+w+40} ${70-th/2}, ${x2-40} ${70-th/2}, ${x2} ${70-th/2} L ${x2} ${70+th/2} C ${x2-40} ${70+th/2}, ${x+w+40} ${70+th/2}, ${x+w} ${70+th/2}Z" fill="${n[3]}" fill-opacity=".22"><animate attributeName="fill-opacity" values=".12;.34;.12" dur="${3+i*.4}s" repeatCount="indefinite"/></path>`}
    s+=`<g><rect x="${x}" y="28" width="${w}" height="84" rx="14" fill="${n[3]}"/><rect x="${x}" y="28" width="${w}" height="6" rx="3" fill="#E3C57A" opacity=".9"/><text x="${x+w/2}" y="66" text-anchor="middle" fill="#fff" font-family="Cormorant Garamond,serif" font-size="30" font-weight="700">${V.num(n[1])}</text><text x="${x+w/2}" y="86" text-anchor="middle" fill="#fff" font-size="11.5" opacity=".9">${n[2]}</text><text x="${x+w/2}" y="136" text-anchor="middle" fill="var(--ink2)" font-size="13" font-weight="600">${n[0]}</text></g>`});
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Stock pipeline from vendor orders to sales">${s}</svg>`};

V.page('dashboard',{title:'Owner Dashboard',crumb:'Overview',
render(){
  const d=V.db,today=d.today,inv=d.invoices.filter(i=>i.status==='Posted');
  const mtd=inv.filter(i=>V.diff(today,i.date)<30),pm=inv.filter(i=>V.diff(today,i.date)>=30&&V.diff(today,i.date)<60);
  const tdy=inv.filter(i=>i.date===today),yst=inv.filter(i=>i.date===V.addDays(today,-1));
  const last30=Array.from({length:30},(_,k)=>V.addDays(today,k-29)),daily=last30.map(x=>sumNet(inv.filter(i=>i.date===x)));
  const stock=V.stockUnits(),stockCost=V.sum(stock,p=>p.cost*p.qty),stockMrp=V.sum(stock,p=>p.mrp*p.qty);
  const dr=V.L.drawer('MAIN',today,false),drc=dr?V.L.drawerCalc(dr):{expected:0};
  const fail=d.sync.filter(s=>s.status==='Failed').length,pend=d.sync.filter(s=>s.status==='Pending').length;
  const aged=stock.filter(p=>p.trk==='serial'&&V.diff(today,p.since)>180);
  const live=d.exhibitions.find(e=>e.status==='Live');
  const gm=V.sum(mtd,i=>i.taxable)-V.sum(mtd,i=>V.sum(i.lines,l=>l.cost));
  const pmTrend=sumNet(pm)?(sumNet(mtd)-sumNet(pm))/sumNet(pm)*100:0;
  const ex=d.exhibitions.filter(e=>e.status!=='Planned').map(e=>({e,s:V.L.exhStats(e.code)}));
  const alerts=[
   fail&&['bad','alert',`${fail} Shopify sync failures need attention`,'#/shopify'],
   d.approvals.filter(a=>a.status==='Pending').length&&['warn','inbox',`${d.approvals.filter(a=>a.status==='Pending').length} approvals waiting for you`,'#/approvals'],
   ['info','clock',`Day-end for ${V.fd(today)} is pending at Main Showroom`,'#/dayend'],
   aged.length&&['warn','box',`${aged.length} sarees unsold for more than 180 days — markdown candidates`,'#/reports/R054'],
   d.bookings.filter(b=>b.status==='Open'&&V.diff(b.due,today)<=7).length&&['info','gift',`Booking balance due this week`,'#/bookings'],
   d.trials.filter(t=>t.status==='Out').length&&['info','eye',`${d.trials.filter(t=>t.status==='Out').length} sarees out on approval-on-sight`,'#/bookings'],
   d.pos.filter(p=>p.status==='Issued'&&V.diff(today,p.expected)>0).length&&['warn','truck',`Purchase orders past expected delivery date`,'#/reports/R034']].filter(Boolean);
  const kp=[V.kpi({l:"Today's Sales",n:sumNet(tdy),f:'short',ic:'cash',c:V.brand.primary,sub:`${tdy.length} bills · yesterday ${V.short(sumNet(yst))}`,spark:daily.slice(-14)}),
   V.kpi({l:'Sales · last 30 days',n:sumNet(mtd),f:'short',ic:'chart',c:'#1E2A5E',trend:pmTrend,sub:'vs previous 30 days',spark:daily}),
   V.kpi({l:'Gross Margin · 30 days',n:gm,f:'short',ic:'coins',c:'#0F6B6B',sub:V.pct(gm,V.sum(mtd,i=>i.taxable))+'% of net sales'}),
   V.kpi({l:'Stock Value (at cost)',n:stockCost,f:'short',ic:'box',c:V.brand.accent,sub:`${V.num(V.sum(stock,p=>p.qty))} units · MRP ${V.short(stockMrp)}`}),
   V.kpi({l:'Cash in Drawer (live)',n:drc.expected,f:'inr',ic:'wallet',c:'#2E8B57',sub:`Main showroom · ${pend} orders to sync`})].join('');
  const liveBox=live?(()=>{const s=V.L.exhStats(live.code),days=V.diff(live.end,today),pc=Math.min(100,s.sales/live.target*100);return `<div class="card motif-edge" style="padding-bottom:26px"><div class="row between"><div><span class="ribbon">${V.ic('flag')} Live now</span><h3 style="margin-top:8px">${V.esc(live.name)}</h3><div class="sub">${live.code} · ${live.venue} · ${live.state}</div></div><div class="right"><div class="b" style="font-size:22px;font-family:var(--f-num);font-weight:700">${V.short(s.sales)}</div><div class="xs mute">of ${V.short(live.target)} target</div></div></div>
    <div class="bar" role="progressbar" aria-valuenow="${pc.toFixed(0)}" aria-valuemin="0" aria-valuemax="100"><i style="width:${pc}%"></i></div>
    <div class="g g4 mt" style="gap:10px"><div><div class="xs mute">Dispatched</div><b>${s.opening}</b></div><div><div class="xs mute">Sold</div><b>${s.sold}</b></div><div><div class="xs mute">Sell-through</div><b>${s.sell}%</b></div><div><div class="xs mute">Days left</div><b>${Math.max(0,days)}</b></div></div>
    <div class="row mt"><a class="btn sm primary" href="#/pos" data-act="useLoc" data-loc="${live.plant}">${V.ic('cart')} Bill at exhibition</a><a class="btn sm" href="#/recon">${V.ic('layers')} Reconcile</a></div></div>`})():'';
  const html=`<div class="hero"><div class="txt"><div class="tag">${V.art.lotus(18,'#E3C57A')} ${V.brand.business}</div><h1>Namaste, ${V.esc(V.brand.owner||'there')}.</h1><p>${tdy.length?`You've billed <b>${V.short(sumNet(tdy))}</b> across ${tdy.length} bill${tdy.length>1?'s':''} today.`:'A fresh day at the looms.'} ${live?`<b>${V.esc(live.name)}</b> is live with ${V.short(V.L.exhStats(live.code).sales)} sold so far.`:''}</p>
   <div class="row"><a class="btn gold" href="#/pos">${V.ic('cart')} New Bill</a><a class="btn onhero" href="#/grn">${V.ic('truck')} Receive Goods</a><a class="btn onhero" href="#/exhibitions">${V.ic('flag')} Exhibitions</a></div></div><div class="art">${V.art.arch()}</div></div>
  <!--P--><div class="card mt flat" style="padding:14px 16px"><div class="row between" style="margin-bottom:6px"><b>Guided demo path</b><span class="xs mute">Follow the story the client described, end to end</span></div><div class="tour">${[['Upload PO','Excel → validated POs','#/po'],['Receive GRN','Auto serials + tags','#/grn/new'],['Bill at POS','GST invoice, split pay','#/pos'],['Exhibition','Code, plant, transfer','#/exhibitions'],['Reconcile','Return balance to Main','#/recon'],['Day-end','Cash drawer & Z-report','#/dayend'],['Shopify','API or file sync','#/shopify'],['117 Reports','Every angle','#/reports']].map((t,i)=>`<a href="${t[2]}" data-act="grnFresh"><b>${i+1}</b><span>${t[0]}</span><small>${t[1]}</small></a>`).join('')}</div></div><!--/P-->
  <div class="g g5 mt">${kp}</div>
  <div class="g g21 mt">${V.card('Sales — last 30 days','Net sales per day (incl. GST), all locations','<div class="cw"><canvas id="c-daily" role="img" aria-label="Daily sales for the last 30 days"></canvas></div>')}${V.card('Sales by weave','Share of net sales, 6 months','<div class="cw"><canvas id="c-weave" role="img" aria-label="Sales share by weave"></canvas></div>')}</div>
  <!--P--><div class="card mt"><div class="row between"><div><h3>The journey of a saree</h3><div class="sub">From vendor PO to billed piece — live counts across the pipeline</div></div><span class="badge gold">${V.art.lotus(14,'currentColor')} Serial-tracked</span></div><div class="flowbox">${V.pipeline()}</div></div><!--/P-->
  <div class="g g2 mt">${liveBox||V.card('Exhibitions','No live exhibition','<p class="mute">Create one in Exhibition Master.</p>')}${V.basic?'':V.card('Needs your attention','Exceptions across operations',alerts.length?`<div style="display:grid;gap:8px">${alerts.map(a=>`<a href="${a[3]}" class="row" style="text-decoration:none;color:inherit;padding:9px 12px;border:1px solid var(--line);border-radius:11px;background:var(--surface2)"><span class="badge ${a[0]}">${V.ic(a[1])}</span><span class="sm">${a[2]}</span></a>`).join('')}</div>`:'<p class="mute">All clear.</p>')}</div>
  <!--P--><div class="g g3 mt">${V.card('Exhibition leaderboard','Net sales by exhibition','<div class="cw sm"><canvas id="c-exh" role="img" aria-label="Exhibition sales comparison"></canvas></div>')}${V.card('When do we sell?','Bills by weekday × hour','<div id="heat"></div>')}${V.card('Stock ageing','Cost value by days since GRN','<div class="cw sm"><canvas id="c-age" role="img" aria-label="Stock ageing buckets"></canvas></div>')}</div><!--/P-->
  <!--P--><div class="g g21 mt">${V.card('Best-selling designs','Top 6 by revenue (6 months)',`<div class="pgrid" style="grid-template-columns:repeat(auto-fill,minmax(120px,1fr))">${V.topDesigns(6).map(t=>`<div class="pcard" style="cursor:default">${V.sw(Object.assign({cn:t.it.name},t.it),120,144)}<div class="inf"><b>${V.esc(t.it.name)}</b><small>${t.q} sold</small><div class="pr">${V.short(t.v)}</div></div></div>`).join('')}</div>`)}${V.card('Payment mix','Share of collections (6 months)','<div class="cw sm"><canvas id="c-pay" role="img" aria-label="Payment mode split"></canvas></div>')}</div><!--/P-->
<!--P--><div class="g g3 mt">${V.card('Vendor payables','Outstanding to weavers',`<div class="val" style="font-family:var(--f-num);font-size:28px;font-weight:700;letter-spacing:-.02em">${V.short(V.sum(d.vendors,v=>V.vendorBal(v.id)))}</div><div class="sub">${d.vendors.filter(v=>V.vendorBal(v.id)>0).length} vendors with open balance</div>${V.spark(daily.slice(-20),V.brand.primary,220,40)}`)}${V.card('Customers','CRM snapshot',`<div class="row" style="gap:22px"><div><div class="val" style="font-family:var(--f-num);font-size:28px;font-weight:700;letter-spacing:-.02em">${d.customers.length}</div><div class="sub">in master</div></div><div><div class="val" style="font-family:var(--f-num);font-size:28px;font-weight:700;letter-spacing:-.02em">${d.customers.filter(c=>c.tier==='Maharani'||c.tier==='Rani').length}</div><div class="sub">Rani & Maharani tier</div></div></div><div class="chips">${['Maharani','Rani','Gold','Silver'].map(t=>`<span class="badge gold">${t} · ${d.customers.filter(c=>c.tier===t).length}</span>`).join('')}</div>`)}${V.card('Shopify sync health','Orders pushed to your online store',`<div class="row" style="gap:18px"><div><div class="val" style="font-family:var(--f-num);font-size:28px;font-weight:700;letter-spacing:-.02em">${V.pct(d.sync.filter(s=>s.status==='Synced').length,d.sync.length).toFixed(0)}%</div><div class="sub">synced</div></div><div class="sm"><div>${V.badge(d.sync.filter(s=>s.status==='Synced').length+' synced','ok')}</div><div class="mt" style="margin-top:6px">${V.badge(pend+' pending','warn')}</div><div style="margin-top:6px">${V.badge(fail+' failed','bad')}</div></div></div><a class="btn sm mt" href="#/shopify">${V.ic('sync')} Open sync console</a>`)}</div><!--/P-->`;return V.basic?html.replace(/<!--P-->[\s\S]*?<!--\/P-->/g,''):html},
mount(){
  const d=V.db,today=d.today,inv=d.invoices.filter(i=>i.status==='Posted');
  const days=Array.from({length:30},(_,k)=>V.addDays(today,k-29));
  V.chart('c-daily',{type:'line',labels:days.map(V.fds),data:[{label:'Net sales',data:days.map(x=>sumNet(inv.filter(i=>i.date===x))),color:V.brand.primary}],fmt:V.short,legend:false});
  const wv=V.group(inv.flatMap(i=>i.lines.filter(l=>V.m.item[l.sku].cat==='Saree').map(l=>({w:V.m.weave[V.m.item[l.sku].weave].name,v:l.net}))),x=>x.w),wr=[...wv].map(([k,a])=>[k,V.sum(a,x=>x.v)]).sort((a,b)=>b[1]-a[1]);
  const top=wr.slice(0,6),rest=V.sum(wr.slice(6),x=>x[1]);if(rest)top.push(['Others',rest]);
  V.chart('c-weave',{type:'doughnut',labels:top.map(x=>x[0]),data:[{data:top.map(x=>x[1])}],tipFmt:V.short});
  const ex=d.exhibitions.filter(e=>e.status!=='Planned').map(e=>[e.city,V.L.exhStats(e.code).sales]);
  ex.unshift(['Main (6 mo)',V.sum(inv.filter(i=>i.loc==='MAIN'),i=>i.net)]);
  V.chart('c-exh',{type:'bar',horizontal:true,labels:ex.map(x=>x[0]),data:[{label:'Net sales',data:ex.map(x=>x[1]),color:V.brand.accent}],fmt:V.short,legend:false});
  const g=Array.from({length:7},()=>Array(11).fill(0));inv.forEach(i=>{const h=+i.time.slice(0,2);if(h>=10&&h<=20)g[(V.dow(i.date)+6)%7][h-10]++});
  const dn=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];if(V.$('#heat'))V.$('#heat').innerHTML=V.heat(g,dn,Array.from({length:11},(_,i)=>(10+i)+''),'122,31,61');
  const B=[['0-30',0,30],['31-90',31,90],['91-180',91,180],['181-365',181,365],['365+',366,9999]],st=V.stockUnits(p=>p.status==='in_stock'&&p.qty>0&&p.loc==='MAIN');
  V.chart('c-age',{type:'bar',labels:B.map(b=>b[0]+' d'),data:[{label:'Stock at cost',data:B.map(b=>V.sum(st.filter(p=>{const a=V.diff(today,p.since);return a>=b[1]&&a<=b[2]}),p=>p.cost*p.qty)),color:'#0F6B6B'}],fmt:V.short,legend:false});
  const pm={};inv.forEach(i=>i.pays.forEach(p=>pm[p.mode]=(pm[p.mode]||0)+p.amt));const pk=Object.keys(pm);
  V.chart('c-pay',{type:'doughnut',labels:pk,data:[{data:pk.map(k=>pm[k])}],tipFmt:V.short})}});
V.topDesigns=n=>{const m={};V.db.invoices.forEach(i=>i.lines.forEach(l=>{const it=V.m.item[l.sku];if(it.cat!=='Saree')return;const o=m[l.sku]||(m[l.sku]={it,q:0,v:0});o.q+=l.qty;o.v+=l.net}));return Object.values(m).sort((a,b)=>b.v-a.v).slice(0,n)};
V.vendorBal=id=>{const d=V.db;return V.sum(d.grns.filter(g=>g.vendor===id),g=>g.value+g.freight)-V.sum(d.vpay.filter(p=>p.vendor===id),p=>p.amt)-V.sum(d.purchaseReturns.filter(p=>p.vendor===id),p=>p.amt)};
V.acts.useLoc=el=>{V.S.loc=el.dataset.loc;try{localStorage.setItem('vk_loc',V.S.loc)}catch(e){}};
})();
