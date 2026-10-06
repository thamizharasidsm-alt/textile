/* business logic — operates on V.db (localStorage-backed) */
(function(){
const L=V.L={};
V.VER=12;
const PFX='loomledger_demo_'+(V.basic?'basic_':'')+'v';const KEY=PFX+V.VER;
V.save=()=>{try{localStorage.setItem(KEY,JSON.stringify(V.db))}catch(e){}};
V.load=()=>{try{const s=localStorage.getItem(KEY);if(s){V.db=JSON.parse(s);L.idx();return}}catch(e){}V.db=null;V.seed();L.idx();V.save()};
V.resetDemo=()=>{try{Object.keys(localStorage).filter(k=>k.startsWith(PFX)).forEach(k=>localStorage.removeItem(k))}catch(e){}location.hash='#/dashboard';location.reload()};

L.idx=()=>{const d=V.db;V.m={item:V.by(d.items,'sku'),vendor:V.by(d.vendors,'id'),cust:V.by(d.customers,'id'),loc:V.by(d.locations,'id'),user:V.by(d.users,'id'),piece:V.by(d.pieces,'u'),exh:V.by(d.exhibitions,'code'),weave:V.by(V.WEAVES,'code'),inv:V.by(d.invoices,'no'),po:V.by(d.pos,'no'),grn:V.by(d.grns,'no'),trf:V.by(d.transfers,'no')}};
L.next=(key,pre,pad=5)=>{const s=V.db.seq;s[key]=(s[key]||0)+1;return pre+String(s[key]).padStart(pad,'0')};
L.fy=date=>{const y=+date.slice(0,4),m=+date.slice(5,7),a=m>=4?y:y-1;return String(a).slice(2)+'-'+String(a+1).slice(2)};
L.audit=(act,ref,by,date,time)=>V.db.audit.push({t:(date||V.db.today)+' '+(time||V.now()),user:by||(V.S.user||'U01'),act,ref:ref||''});
L.cust=id=>V.m.cust[id];L.item=sku=>V.m.item[sku];
L.locName=id=>(V.m.loc[id]||{}).name||id;
L.userName=id=>(V.m.user[id]||{}).name||id||'—';

// ---- serial / batch numbers -------------------------------------------------
L.serKey=(it,date,mode)=>{const ym=date.slice(2,4)+date.slice(5,7);return (mode||it.trk)==='batch'?{key:'bt'+ym+date.slice(8,10)+it.sku,pre:'BT-'+ym+date.slice(8,10)+'-'+it.sku.split('-')[1]+'-',pad:2}:{key:'sr'+it.weave+ym,pre:it.weave+'-'+ym+'-',pad:5}};
L.peek=(it,date,n=1,mode)=>{const k=L.serKey(it,date,mode),s=V.db.seq[k.key]||0;return Array.from({length:n},(_,i)=>k.pre+String(s+i+1).padStart(k.pad,'0'))};
L.serial=(it,date,mode)=>{const k=L.serKey(it,date,mode);return L.next(k.key,k.pre,k.pad)};

// ---- pieces & movements ---------------------------------------------------
L.addPiece=o=>{const p=Object.assign({u:L.next('u','U',5),status:'in_stock'},o);V.db.pieces.push(p);V.m.piece[p.u]=p;return p};
L.move=(p,type,from,to,ref,date,by,note,qty)=>V.db.moves.push({date:date||V.db.today,time:V.now(),u:p.u,no:p.no,type,from:from||'',to:to||'',ref:ref||'',by:by||V.S.user||'U01',note:note||'',qty:qty||1});
L.avail=loc=>V.db.pieces.filter(p=>p.loc===loc&&p.status==='in_stock'&&p.qty>0);
L.splitRow=(p,qty)=>{ // batch partial move: returns new row with qty, decrements original
  if(p.qty<=qty)return p;const n=Object.assign({},p,{u:L.next('u','U',5),qty,q0:qty});p.qty-=qty;V.db.pieces.push(n);V.m.piece[n.u]=n;return n};

// ---- purchase orders / GRN ----------------------------------------------------
L.poCreate=({vendor,date,expected,lines,status='Draft',by,src='Manual',notes='',terms=''})=>{
  const no=L.next('po','PO/'+L.fy(date)+'/',4);
  const po={no,date,vendor,expected:expected||V.addDays(date,14),status,lines:lines.map(l=>({sku:l.sku,qty:l.qty,rate:l.rate,rcv:0})),by:by||V.S.user,src,notes,terms:terms||(V.m.vendor[vendor]||{}).terms,approvedBy:status==='Draft'?'':'U01'};
  po.value=V.sum(po.lines,l=>l.qty*l.rate);V.db.pos.push(po);V.m.po[no]=po;L.audit('PO created',no,by,date);return po};
L.grnPost=({po,vendor,loc='MAIN',date,lines,by,freight=0,note='',opening=false})=>{
  const d=V.db,no=L.next('grn','GRN/'+L.fy(date)+'/',4);
  const g={no,date,po:po||null,vendor,loc,by:by||V.S.user,freight,note,opening,lines:[],value:0,qc:'Passed'};
  lines.forEach(l=>{const it=V.m.item[l.sku],mode=l.trk||it.trk,acc=l.qty-(l.rej||0),units=[];
    if(mode==='serial'){for(let i=0;i<acc;i++){const p=L.addPiece({no:L.serial(it,date,mode),trk:'serial',sku:it.sku,vendor,grn:no,loc,qty:1,q0:1,cost:l.costs?l.costs[i]:l.rate,mrp:l.mrps?l.mrps[i]:it.mrp,mkPct:l.mks?l.mks[i].pct:undefined,mkAmt:l.mks?l.mks[i].amt:undefined,since:date,slow:!!l.slow,len:it.len});L.move(p,'GRN','Vendor',loc,no,date,by);units.push(p.u)}}
    else if(acc>0){const p=L.addPiece({no:L.serial(it,date,mode),trk:'batch',sku:it.sku,vendor,grn:no,loc,qty:acc,q0:acc,cost:l.costs&&l.costs[0]!==undefined?l.costs[0]:l.rate,mrp:l.mrps&&l.mrps[0]?l.mrps[0]:it.mrp,mkPct:l.mks?l.mks[0].pct:undefined,mkAmt:l.mks?l.mks[0].amt:undefined,since:date});L.move(p,'GRN','Vendor',loc,no,date,by,'',acc);units.push(p.u)}
    g.lines.push({sku:l.sku,ordered:l.ordered||l.qty,recv:l.qty,rej:l.rej||0,acc,rate:l.rate,rejReason:l.rejReason||'',units});g.value+=units.reduce((s,u)=>s+V.m.piece[u].cost*V.m.piece[u].q0,0);
    if(po){const pl=V.m.po[po].lines.find(x=>x.sku===l.sku);if(pl)pl.rcv+=l.qty}});
  d.grns.push(g);V.m.grn[no]=g;
  if(po){const p=V.m.po[po];p.status=p.lines.every(l=>l.rcv>=l.qty)?'Closed':'Partially Received'}
  d.labels.push({date,grn:no,count:V.sum(g.lines,l=>l.acc),by:g.by,type:'Serial/Batch tags'});
  L.audit('GRN posted',no,by,date);return g};
L.purchaseReturn=({vendor,grn,units,reason,date,by})=>{
  const no=L.next('pr','PR/'+L.fy(date)+'/',4),dn=L.next('dn','DN/'+L.fy(date)+'/',4);let amt=0;
  units.forEach(u=>{const p=V.m.piece[u];amt+=p.cost*p.qty;p.status='vendor_return';L.move(p,'PURCHASE_RETURN',p.loc,'Vendor',no,date,by,reason)});
  const r={no,dn,date,vendor,grn,units,reason,amt,by:by||V.S.user,status:'Debit note issued'};V.db.purchaseReturns.push(r);L.audit('Purchase return',no,by,date);return r};

// ---- tax / invoice -------------------------------------------------------------
L.taxSplit=(loc,cust,tax)=>{const l=V.m.loc[loc],c=cust?V.m.cust[cust]:null;const inter=!!(c&&c.gstin&&c.state!==l.state);return inter?{cgst:0,sgst:0,igst:tax,inter}:{cgst:tax/2,sgst:tax/2,igst:0,inter}};
L.invoicePost=({loc,date,time,cust,lines,pays,sp,cashier,note='',payNote=''})=>{
  const d=V.db,lo=V.m.loc[loc];const no=L.next('inv'+loc,'INV/'+lo.code+'/'+L.fy(date)+'/',5);
  let sub=0,disc=0,net=0,taxable=0,tax=0;const ls=[];
  lines.forEach(l=>{const p=V.m.piece[l.u],it=V.m.item[p.sku],q=l.qty||1,gross=p.mrp*q,dsc=Math.min(l.disc||0,gross),n=gross-dsc,tb=n/(1+it.gst/100);
    ls.push({u:p.u,no:p.no,sku:p.sku,name:it.name,hsn:it.hsn,qty:q,mrp:p.mrp,disc:dsc,net:n,gst:it.gst,taxable:tb,tax:n-tb,cost:p.cost*q});
    sub+=gross;disc+=dsc;net+=n;taxable+=tb;tax+=n-tb;p.qty-=q;if(p.qty<=0){p.qty=0;p.status='sold';p.soldOn=date}if(p.status==='booked'||p.status==='trial'||p.status==='hold')p.status=p.qty>0?'in_stock':'sold';
    L.move(p,'SALE',loc,'Customer',no,date,cashier,'',q)});
  const ts=L.taxSplit(loc,cust,tax),paid=V.sum(pays,x=>x.amt),cashIn=V.sum(pays.filter(x=>x.mode==='Cash'),x=>x.amt);
  const change=Math.max(0,paid-net);
  const inv={no,date,time:time||V.now(),loc,cust:cust||null,sp:sp||cashier,cashier:cashier||V.S.user,lines:ls,sub,disc,net,taxable,cgst:ts.cgst,sgst:ts.sgst,igst:ts.igst,inter:ts.inter,total:net,pays,change,note,status:'Posted',sync:'Pending'};
  d.invoices.push(inv);V.m.inv[no]=inv;if(cust&&V.m.cust[cust])V.m.cust[cust].last=date;
  L.syncAdd('Order',no,loc,net,date);L.audit('Invoice posted',no,cashier,date,inv.time);return inv};
L.cashNet=inv=>{const c=V.sum(inv.pays.filter(x=>x.mode==='Cash'),x=>x.amt);return c-Math.min(inv.change||0,c)};

// ---- cash drawer / petty / day end ----------------------------------------------------
L.drawer=(loc,date,create=true)=>{let r=V.db.drawers.find(x=>x.loc===loc&&x.date===date);if(!r&&create){r={id:'DR-'+loc+'-'+date,loc,date,opened:'10:00',openedBy:V.S.user,float:25000,entries:[],status:'open',closing:null};V.db.drawers.push(r)}return r};
L.cashSales=(loc,date)=>V.sum(V.db.invoices.filter(i=>i.loc===loc&&i.date===date&&i.status==='Posted'),L.cashNet);
L.cashRefunds=(loc,date)=>V.sum(V.db.salesReturns.filter(r=>r.loc===loc&&r.date===date&&r.refundMode==='Cash'),r=>r.amt);
L.drawerCalc=r=>{const sales=L.cashSales(r.loc,r.date),ref=L.cashRefunds(r.loc,r.date),en=t=>V.sum(r.entries.filter(e=>e.t===t),e=>e.amt);
  const o={float:r.float,sales,refunds:ref,cin:en('in'),cout:en('out'),drop:en('drop')};o.expected=o.float+o.sales+o.cin-o.cout-o.refunds-o.drop;return o};
V.DENOM=[2000,500,200,100,50,20,10];
L.closeDrawer=(r,{counted,denom,by,note,time})=>{const c=L.drawerCalc(r);r.closing={counted,denom:denom||{},expected:c.expected,variance:counted-c.expected,by:by||V.S.user,time:time||V.now(),note:note||'',deposit:Math.max(0,counted-r.float)};r.status='closed';L.audit('Day-end closed',r.id,by,r.date,time)};
L.pettyAdd=({loc,date,head,desc,amt,type='expense',by,bill='',fromDrawer=false,time})=>{
  const p={id:L.next('pc','PC-',5),loc,date,head,desc,amt,type,by:by||V.S.user,bill,approvedBy:amt>2000?(V.S.user||'U02'):'',time:time||V.now()};V.db.petty.push(p);
  if(type==='topup'){const r=L.drawer(loc,date);if(r.status==='open')r.entries.push({t:'out',amt,reason:'Petty cash top-up '+p.id,time:p.time,by:p.by})}return p};
L.pettyBal=loc=>V.sum(V.db.petty.filter(p=>p.loc===loc),p=>p.type==='topup'?p.amt:-p.amt);

// ---- shopify sync queue ------------------------------------------------------------------
L.syncAdd=(type,ref,loc,amt,date)=>{const s={id:L.next('sy','SY-',5),type,ref,loc,amt:amt||0,status:'Pending',tries:0,err:'',t:(date||V.db.today)+' '+V.now(),mode:V.db.settings.shopifyMode,shopifyRef:''};V.db.sync.push(s);return s};
L.syncCheck=s=>{ // returns error string or ''
  if(s.type==='Order'){const inv=V.m.inv[s.ref];if(inv){const bad=inv.lines.find(l=>V.m.item[l.sku]&&V.m.item[l.sku].shopify===false);if(bad)return 'SKU '+bad.sku+' not mapped to a Shopify variant';
    if(!V.m.loc[inv.loc].shopifyLoc)return 'Location not mapped to Shopify location'}}
  return ''};
L.syncRun=(s,date)=>{const e=L.syncCheck(s);s.tries++;if(e){s.status='Failed';s.err=e;return false}s.status='Synced';s.err='';s.shopifyRef=s.type==='Order'?'#VK-'+(4000+(V.hash(s.ref)%5000)):s.type==='Refund'?'RF-'+(1000+(V.hash(s.ref)%9000)):'OK';
  s.syncedAt=(date||V.db.today)+' '+V.now();if(s.type==='Order'&&V.m.inv[s.ref])V.m.inv[s.ref].sync='Synced';return true};

// ---- transfers / exhibitions ----------------------------------------------------------------
L.trfCreate=({from,to,lines,date,by,exh='',note=''})=>{
  const no=L.next('trf','STO/'+L.fy(date)+'/',4);const fs=V.m.loc[from],ts=V.m.loc[to];
  const t={no,date,from,to,exh,lines:lines.map(l=>({u:l.u,qty:l.qty||1})),status:'Draft',by:by||V.S.user,note,inter:fs.state!==ts.state,ewb:'',value:0,dispatchedOn:'',receivedOn:''};
  t.value=V.sum(t.lines,l=>V.m.piece[l.u].mrp*l.qty);V.db.transfers.push(t);V.m.trf[no]=t;L.audit('Transfer created',no,by,date);return t};
L.trfDispatch=(no,date,by)=>{const t=V.m.trf[no];date=date||V.db.today;
  t.lines=t.lines.map(l=>{let p=V.m.piece[l.u];if(p.trk==='batch'&&p.qty>l.qty)p=L.splitRow(p,l.qty);p.status='transit';p.to=t.to;L.move(p,'TRANSFER_OUT',t.from,'In-transit',no,date,by,'',l.qty);return {u:p.u,qty:l.qty}});
  t.status='In-Transit';t.dispatchedOn=date;if(t.inter&&t.value>50000)t.ewb='EWB'+(3410000000+V.hash(no)%99999999);
  V.db.audit&&L.audit('Transfer dispatched',no,by,date);return t};
L.trfReceive=(no,date,by)=>{const t=V.m.trf[no];date=date||V.db.today;
  t.lines.forEach(l=>{const p=V.m.piece[l.u];p.loc=t.to;p.status='in_stock';delete p.to;L.move(p,'TRANSFER_IN','In-transit',t.to,no,date,by,'',l.qty)});
  t.status='Received';t.receivedOn=date;L.audit('Transfer received',no,by,date);return t};
L.exhStats=code=>{const e=V.m.exh[code],plant=e.plant;
  const inTr=V.db.transfers.filter(t=>t.to===plant&&t.status!=='Draft');const opening=V.sum(inTr,t=>V.sum(t.lines,l=>l.qty));
  const inv=V.db.invoices.filter(i=>i.loc===plant&&i.status==='Posted');const sold=V.sum(inv,i=>V.sum(i.lines,l=>l.qty)),sales=V.sum(inv,i=>i.net);
  const open=V.db.pieces.filter(p=>p.loc===plant&&p.status==='in_stock').reduce((s,p)=>s+p.qty,0);
  const exp=V.sum(V.db.petty.filter(p=>p.loc===plant&&p.type==='expense'),p=>p.amt)+e.stall;
  const cogs=V.sum(inv,i=>V.sum(i.lines,l=>l.cost));
  return {opening,sold,sales,balance:open,exp,cogs,profit:sales-cogs-exp,invoices:inv.length,sell:V.pct(sold,opening)}};
L.exhRecon=(code,verdicts,by,date)=>{
  const e=V.m.exh[code],plant=e.plant;date=date||V.db.today;const st=L.exhStats(code);
  const rows=V.db.pieces.filter(p=>p.loc===plant&&p.status==='in_stock'&&p.qty>0);let ret=[],dmg=0,mis=0;
  rows.forEach(p=>{const v=verdicts[p.u]||'present';
    if(v==='present')ret.push({u:p.u,qty:p.qty});
    else if(v==='damaged'){p.status='damaged';p.loc='MAIN';dmg+=p.qty;L.move(p,'EXH_DAMAGE',plant,'MAIN',code,date,by,'Damaged during exhibition',p.qty)}
    else{p.status='missing';mis+=p.qty;L.move(p,'EXH_MISSING',plant,'—',code,date,by,'Unaccounted at reconciliation',p.qty)}});
  let retNo='';if(ret.length){const t=L.trfCreate({from:plant,to:'MAIN',lines:ret,date,by,exh:code,note:'Return of balance stock after '+code});L.trfDispatch(t.no,date,by);L.trfReceive(t.no,date,by);retNo=t.no}
  const rec={exh:code,date,opening:st.opening,sold:st.sold,returned:V.sum(ret,r=>r.qty),damaged:dmg,missing:mis,by:by||V.S.user,retTrf:retNo,sales:st.sales};
  V.db.recons.push(rec);e.status='Reconciled';L.audit('Exhibition reconciled',code,by,date);return rec};

// ---- returns ------------------------------------------------------------------------------------------
L.salesReturn=({inv,lines,mode,refundMode,date,by,loc})=>{
  const iv=V.m.inv[inv],no=L.next('sr','SR/'+L.fy(date)+'/',4);let amt=0;
  const ls=lines.map(l=>{const il=iv.lines.find(x=>x.u===l.u),p=V.m.piece[l.u];const a=il.net;amt+=a;
    if(l.cond==='good'){p.status='in_stock';p.qty=(p.qty||0)+il.qty;p.loc=loc||p.loc}else{p.status='damaged';p.qty=il.qty;p.loc=loc||p.loc}
    L.move(p,'SALE_RETURN','Customer',p.loc,no,date,by,l.reason,il.qty);return {u:l.u,no:p.no,sku:p.sku,reason:l.reason,cond:l.cond,amt:a}});
  const r={no,date,inv,cust:iv.cust,loc:loc||iv.loc,lines:ls,amt,mode,refundMode:mode==='Refund'?refundMode:'',cn:mode==='Credit Note'?L.next('cn','CN/'+L.fy(date)+'/',4):'',by:by||V.S.user,status:'Posted'};
  if(r.cn&&iv.cust)V.m.cust[iv.cust].credit=(V.m.cust[iv.cust].credit||0)+amt;
  V.db.salesReturns.push(r);L.syncAdd('Refund',no,r.loc,amt,date);L.audit('Sales return',no,by,date);return r};

// ---- global search ---------------------------------------------------------------------------------------
L.search=q=>{q=q.trim().toLowerCase();if(q.length<2)return[];const d=V.db,out=[];
  d.pieces.forEach(p=>{if(out.length<40&&p.no.toLowerCase().includes(q)){const it=V.m.item[p.sku];out.push({t:'Serial',l:p.no,s:it.name+' · '+L.locName(p.loc),h:V.basic?'#/stock':'#/trace/'+p.no})}});
  d.invoices.slice().reverse().forEach(i=>{if(out.length<40&&i.no.toLowerCase().includes(q))out.push({t:'Invoice',l:i.no,s:V.inr(i.net)+' · '+V.fd(i.date),h:'#/invoices/'+encodeURIComponent(i.no)})});
  d.customers.forEach(c=>{if(out.length<40&&(c.name.toLowerCase().includes(q)||c.phone.includes(q)))out.push({t:'Customer',l:c.name,s:c.phone+' · '+c.city,h:'#/customers/'+c.id})});
  d.items.forEach(i=>{if(out.length<40&&(i.sku.toLowerCase().includes(q)||i.name.toLowerCase().includes(q)))out.push({t:'Design',l:i.sku,s:i.name,h:'#/items'})});
  d.pos.forEach(p=>{if(out.length<40&&p.no.toLowerCase().includes(q))out.push({t:'PO',l:p.no,s:V.m.vendor[p.vendor].name,h:'#/po'})});
  return out.slice(0,12)};
})();
