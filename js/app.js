/* app shell, router, global events */
(function(){
const NAV=[
 ['Overview',[['dashboard','Dashboard','home']]],
 ['Masters',[['items','Item Master','tag'],['vendors','Vendors & Weavers','loom'],['customers','Customers (CRM)','users'],['locations','Locations & Plants','store'],['exhibitions','Exhibition Master','flag'],['users','Users & Roles','shield']]],
 ['Procurement',[['po','Purchase Orders','file'],['grn','GRN · Goods Inward','truck'],['preturn','Purchase Returns','return'],['localpurchase','Local Purchase','shop'],['vledger','Vendor Ledger','book']]],
 ['Inventory',[['stock','Stock Explorer','box'],['trace','Serial Trace','scan'],['transfer','Stock Transfer','swap'],['recon','Exhibition Recon','layers'],['audit','Stock Audit','check'],['adjust','Adjustments & Damage','alert'],['labels','Labels & Tags','qr']]],
 ['POS & Cash',[['pos','POS Billing','cart'],['invoices','Invoices','receipt'],['bookings','Bookings & Trials','gift'],['sreturn','Sales Returns','return'],['drawer','Cash Drawer','cash'],['dayend','Day End','clock'],['petty','Petty Cash','wallet']]],
 ['Integrations',[['shopify','Shopify Sync','sync']]],
 ['Insights',[['reports','Reports Hub','chart'],['gst','GST & E-way','coins']]],
 ['Admin',[['approvals','Approvals','inbox'],['imports','Import Centre','upload'],['auditlog','Audit Trail','list'],['settings','Settings','gear']]]
];
V.NAVALL=NAV;
V.navFor=()=>NAV.map(g=>[g[0],g[1].filter(i=>!V.HIDE_ROUTES.includes(i[0])&&(i[0]==='dashboard'||V.can(i[0])))]).filter(g=>g[1].length);
V.nav=NAV.map(g=>[g[0],g[1].filter(i=>!V.HIDE_ROUTES.includes(i[0]))]).filter(g=>g[1].length);
const $=V.$;
V.go=h=>{location.hash=h};
V.refresh=()=>route();
V.locOptions=()=>V.db.locations.filter(l=>l.status!=='Planned');
V.curLoc=()=>V.m.loc[V.S.loc]||V.m.loc.MAIN;

function pill(id){const d=V.db;if(id==='approvals'){const n=d.approvals.filter(a=>a.status==='Pending').length;return n?`<span class="pill">${n}</span>`:''}
  if(id==='shopify'){const n=d.sync.filter(s=>s.status!=='Synced').length;return n?`<span class="pill">${n}</span>`:''}
  if(id==='dashboard')return '';return ''}
function renderSide(cur){
  $('#side').innerHTML=`<a class="brand" href="#/dashboard" aria-label="${V.esc(V.brand.name)} home"><span class="logo">${V.brandMark(42)}</span><span><b>${V.esc(V.brand.name)}</b><small>${V.esc(V.brand.tag)}</small></span></a><div class="temple" aria-hidden="true"></div>
  <nav class="nav">${V.navFor().map(g=>`<h6>${g[0]}</h6>${g[1].map(i=>`<a href="#/${i[0]}" class="${cur===i[0]?'on':''}" ${cur===i[0]?'aria-current="page"':''}>${V.ic(i[2])}<span>${i[1]}</span>${pill(i[0])}</a>`).join('')}`).join('')}</nav>
  <div class="side-foot">${V.esc(V.brand.business)}<br><span style="opacity:.75">${V.brand.by?'Powered by '+V.esc(V.brand.by)+' · ':''}Demo · data stays in your browser · build ${V.BUILD}</span></div>`}
function renderTop(title,crumb){
  const locs=V.locOptions();
  $('#top').innerHTML=`<button class="iconbtn menu-btn" data-act="toggleNav" aria-label="Open menu">${V.ic('menu')}</button><div><span class="crumb">${crumb||V.esc(V.brand.name)}</span><span class="ttl">${title}</span></div><div class="sp"></div>
  <div class="search">${V.ic('search')}<input id="gs" type="search" placeholder="Search serial, invoice, customer… (Ctrl+K)" autocomplete="off" aria-label="Global search"><div class="sresults" id="sres" hidden></div></div>
  <label class="locsel" title="Working location (POS, stock, drawer)">${V.ic('pin')}<select id="locsel" aria-label="Working location">${locs.map(l=>`<option value="${l.id}" ${l.id===V.S.loc?'selected':''}>${V.esc(l.name)}</option>`).join('')}</select></label>
  <span class="datechip">${V.ic('cal')} ${V.fd(V.db.today)}</span>
  <button class="iconbtn" data-act="theme" aria-label="Toggle dark mode">${V.ic(document.documentElement.getAttribute('data-theme')==='dark'?'sun':'moon')}</button>
  ${V.userMenuHtml()}`}

function route(){
  const h=(location.hash||'#/dashboard').replace(/^#\//,'');let [name,...args]=h.split('/').map(decodeURIComponent);if(['grn','invoices','sreturn'].includes(name)&&args.length>1)args=[args.join('/')];
  const exists=V.pages[name]&&!V.HIDE_ROUTES.includes(name),okR=exists&&(name==='dashboard'||V.can(name));const pg=!exists?V.pages.dashboard:okR?V.pages[name]:V.deniedPage(name),cur=okR?name:(exists?'':'dashboard');
  V.destroyCharts();V.L.idx();document.body.classList.remove('nav-open');
  renderSide(cur);
  const t=typeof pg.title==='function'?pg.title(...args):pg.title;renderTop(t,pg.crumb);
  const v=$('#view'),prevNav=$('.rep-nav'),navTop=prevNav?prevNav.scrollTop:null;
  try{v.innerHTML=pg.render(...args)}catch(e){console.error(e);v.innerHTML=`<div class="card"><h3>Something went wrong</h3><p class="mute">${V.esc(e.message)}</p></div>`}
  v.classList.remove('fade');void v.offsetWidth;v.classList.add('fade');
  try{pg.mount&&pg.mount(...args)}catch(e){console.error(e)}
  V.unlink(v);V.countUp(v);window.scrollTo(0,0);
  // keep the Reports list where the user scrolled it, and make sure the selected report is visible
  const nn=$('.rep-nav');if(nn){if(navTop!==null)nn.scrollTop=navTop;const on=nn.querySelector('a.on');if(on){const r=on.getBoundingClientRect(),c=nn.getBoundingClientRect();if(r.top<c.top+8)nn.scrollTop-=c.top+8-r.top;else if(r.bottom>c.bottom-8)nn.scrollTop+=r.bottom-c.bottom+8}}
}

// ---- global events
document.addEventListener('click',e=>{
  const t=e.target;
  const a=t.closest('[data-act]');if(a){const f=V.acts[a.dataset.act];if(f){const h=a.getAttribute('href');if(!(a.tagName==='A'&&h&&h[0]==='#'))e.preventDefault();f(a,e)}return}
  const m=t.closest('[data-mfn]');if(m){const r=V._mfn[+m.dataset.mfn]&&V._mfn[+m.dataset.mfn](m);Promise.resolve(r).then(x=>{if(x!==false)V.closeModal()});return}
  if(t.id==='mbg'){V.closeModal();return}
  const s=t.closest('[data-sort]');if(s){const [id,i]=s.dataset.sort.split(':'),st=V.tbl[id];st.dir=st.sort===+i?-st.dir:1;st.sort=+i;V.tblRefresh(id);return}
  const p=t.closest('[data-pg]');if(p){const [id,d]=p.dataset.pg.split(':');V.tbl[id].page+=+d;V.tblRefresh(id);return}
  const r=t.closest('[data-row]');if(r&&!t.closest('a,button,input,select')){const [id,i]=r.dataset.row.split(':');const st=V.tbl[id];st.cfg.onRow(st.view[+i]);return}
  const hf=t.closest('[data-href]');if(hf){V.go(hf.dataset.href);return}
  if(!t.closest('.umw')&&$('#umenu'))$('#umenu').hidden=true;
  if(!t.closest('.search'))$('#sres')&&($('#sres').hidden=true);
});
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&$('#mbg'))V.closeModal();
  if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();const g=$('#gs');g&&g.focus()}
  if((e.key==='Enter'||e.key===' ')&&e.target.matches('[data-sort]')){e.preventDefault();e.target.click()}
  if(e.key==='Enter'&&e.target.matches('tr[data-row]'))e.target.click();
});
document.addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.tq){const st=V.tbl[t.dataset.tq];st.q=t.value;st.page=0;V.tblRefresh(t.dataset.tq)}
  if(t.id==='gs'){const r=V.L.search(t.value),box=$('#sres');box.hidden=!r.length;box.innerHTML=r.map(x=>`<a href="${x.h}"><span><b>${V.esc(x.l)}</b> <small>${V.esc(x.s)}</small></span><span class="badge">${x.t}</span></a>`).join('')}
});
document.addEventListener('change',e=>{if(e.target.id==='locsel'){V.S.loc=e.target.value;try{localStorage.setItem('vk_loc',V.S.loc)}catch(x){}V.toast('Working location: '+V.curLoc().name);route()}});
V.acts.closeModal=()=>V.closeModal();
V.acts.toggleNav=()=>document.body.classList.toggle('nav-open');
V.acts.theme=()=>{const d=document.documentElement,n=d.getAttribute('data-theme')==='dark'?'light':'dark';d.setAttribute('data-theme',n);try{localStorage.setItem('vk_theme',n)}catch(e){}route()};
V.acts.tblExport=el=>{const st=V.tbl[el.dataset.id];V.dl(el.dataset.id+'.csv',V.csvOf(st.cfg.cols.filter(c=>!c.nosort||c.v),V.tblRows(el.dataset.id)));V.toast('Exported '+V.tblRows(el.dataset.id).length+' rows')};
document.addEventListener('click',e=>{if(e.target.id==='scrim')document.body.classList.remove('nav-open')});
window.addEventListener('hashchange',route);

V.boot=()=>{
  V.S.user='U01';try{V.S.loc=localStorage.getItem('vk_loc')||'MAIN'}catch(e){V.S.loc='MAIN'}
  V.load();if(!V.m.loc[V.S.loc]||V.m.loc[V.S.loc].status==='Planned')V.S.loc='MAIN';
  V.enter=()=>{document.body.classList.remove('locked');const l=document.getElementById('login');if(l)l.remove();route()};
  if(V.authInit())V.enter();else V.showLogin();
};
window.addEventListener('DOMContentLoaded',()=>{try{V.boot()}catch(e){console.error(e);document.body.insertAdjacentHTML('afterbegin',`<pre style="padding:20px;color:#b3261e">Boot error: ${V.esc(e.stack||e.message)}</pre>`)}});
})();
