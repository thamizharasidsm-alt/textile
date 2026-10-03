/* demo data generator — ~6 months of realistic trading history */
(function(){
V.WEAVES=[
 {code:'KJV',name:'Kanjivaram',region:'Kanchipuram, TN',state:'Tamil Nadu',fabric:'Pure Mulberry Silk',zari:'Pure Zari (Gold-tested)',hsn:'5007',pat:'temple',lo:95000,hi:240000,cert:'Silk Mark + GI Tag',descs:['Temple Border Peacock','Rudraksh Border Butta','Checks & Mango Pallu','Double-Warp Annam','Vaira Oosi Contrast']},
 {code:'BNR',name:'Banarasi',region:'Varanasi, UP',state:'Uttar Pradesh',fabric:'Katan Silk',zari:'Pure Zari Kadhua',hsn:'5007',pat:'butta',lo:60000,hi:200000,cert:'Silk Mark + GI Tag',descs:['Kadhua Butta','Tanchoi Jaal','Shikargah Brocade','Kimkhwab Rich Pallu','Jangla Floral']},
 {code:'PTL',name:'Patola',region:'Patan, GJ',state:'Gujarat',fabric:'Double-Ikat Silk',zari:'Silver Zari Accents',hsn:'5007',pat:'geo',lo:180000,hi:350000,cert:'GI Tag (Patan Patola)',descs:['Narikunj Bhat','Paan Bhat','Chhabadi Bhat']},
 {code:'POC',name:'Pochampally Ikat',region:'Pochampally, TS',state:'Telangana',fabric:'Silk Ikat',zari:'Zari Border',hsn:'5007',pat:'ikat',lo:28000,hi:62000,cert:'Handloom Mark + GI Tag',descs:['Double Ikat Geometric','Telia Rumal','Teliya Butta']},
 {code:'JMD',name:'Jamdani',region:'Phulia, WB',state:'West Bengal',fabric:'Muslin Cotton-Silk',zari:'Resham Floral',hsn:'5007',pat:'floral',lo:35000,hi:88000,cert:'Handloom Mark',descs:['Floral Jaal','Paan Butta','Pallu Panel Jamdani']},
 {code:'PTH',name:'Paithani',region:'Yeola, MH',state:'Maharashtra',fabric:'Pure Silk',zari:'Pure Zari Asavali',hsn:'5007',pat:'peacock',lo:90000,hi:220000,cert:'Silk Mark + GI Tag',descs:['Asavali Peacock','Bangdi Mor','Kamal Border']},
 {code:'MYS',name:'Mysore Crepe Silk',region:'Mysuru, KA',state:'Karnataka',fabric:'Crepe Silk',zari:'Gold Zari Stripe',hsn:'5007',pat:'stripe',lo:32000,hi:70000,cert:'Silk Mark',descs:['Zari Stripe Pallu','Plain Gold Border','Chequered Zari']},
 {code:'KTD',name:'Kota Doria',region:'Kaithoon, RJ',state:'Rajasthan',fabric:'Cotton-Silk Doria',zari:'Zari Border',hsn:'5208',pat:'check',lo:25000,hi:38000,cert:'Handloom Mark + GI Tag',descs:['Khat Weave','Block Check Zari']},
 {code:'CHD',name:'Chanderi',region:'Chanderi, MP',state:'Madhya Pradesh',fabric:'Silk-Cotton',zari:'Zari Butti',hsn:'5007',pat:'floral',lo:26000,hi:46000,cert:'Handloom Mark + GI Tag',descs:['Silk Cotton Butti','Scalloped Border']},
 {code:'BLC',name:'Baluchari',region:'Bishnupur, WB',state:'West Bengal',fabric:'Pure Silk',zari:'Resham Narrative',hsn:'5007',pat:'peacock',lo:55000,hi:140000,cert:'Silk Mark + GI Tag',descs:['Epic Narrative Pallu','Swarnachari']},
 {code:'SMB',name:'Sambalpuri Ikat',region:'Sambalpur, OD',state:'Odisha',fabric:'Silk-Cotton Ikat',zari:'Bomkai Thread',hsn:'5007',pat:'ikat',lo:25000,hi:52000,cert:'Handloom Mark + GI Tag',descs:['Bomkai Ikat','Pasapali Check']},
 {code:'TSR',name:'Bhagalpur Tussar',region:'Bhagalpur, BR',state:'Bihar',fabric:'Tussar Silk',zari:'Hand-painted / Block',hsn:'5007',pat:'stripe',lo:26000,hi:48000,cert:'Silk Mark',descs:['Ghicha Stripe','Madhubani Hand-painted']}
];
V.STATES={'Tamil Nadu':'33','Karnataka':'29','Telangana':'36','Maharashtra':'27','Delhi':'07','Uttar Pradesh':'09','Gujarat':'24','West Bengal':'19','Rajasthan':'08','Madhya Pradesh':'23','Odisha':'21','Bihar':'10','Kerala':'32'};
V.COLOURS=[['Peacock Green','#0F6B5B','#E3C57A'],['Temple Maroon','#7A1F3D','#E3C57A'],['Royal Blue','#1F3A93','#E3C57A'],['Mustard Gold','#C8921A','#7A1F3D'],['Magenta','#B0245F','#E3C57A'],['Teal','#137C7C','#F2E3B3'],['Emerald','#0B6E4F','#E3C57A'],['Ivory Cream','#EFE3C6','#B5471F'],['Rani Pink','#D81E6B','#E3C57A'],['Rust Orange','#B5471F','#F2E3B3'],['Wine','#5B1030','#E3C57A'],['Mango Yellow','#E3B02A','#1E2A5E'],['Lavender','#7B68AE','#F2E3B3'],['Midnight Black','#1B1B25','#E3C57A'],['Sky Blue','#4F86B5','#F2E3B3'],['Bottle Green','#14452F','#E3C57A'],['Coral','#DB5648','#F2E3B3'],['Indigo','#2B2F77','#E3C57A']];
V.PAYMODES=['Cash','UPI','Card','Bank Transfer','EMI','Cheque','Store Credit'];
V.HEADS=['Courier & Freight','Tea & Refreshments','Staff Conveyance','Cleaning & Housekeeping','Stationery','Repairs & Maintenance','Packing Material','Printing & Tags','Flowers & Pooja','Local Transport','Stall Decoration','Staff Meals (Exhibition)','Electricity (Stall)','Miscellaneous'];
V.RETURN_REASONS=['Colour mismatch with blouse','Minor zari snag on pallu','Water stain noticed','Customer changed choice','Loose weft thread','Duplicate gift'];

V.seed=function(){
  const R=V.rng(26100301),pick=a=>a[Math.floor(R()*a.length)],rnd=(a,b)=>a+Math.floor(R()*(b-a+1));
  const today=V.iso(new Date()),DAYS=185,D0=V.addDays(today,-DAYS),ad=V.addDays;
  const db=V.db={v:V.VER,today,seq:{},settings:{shopifyMode:'api',shopifyDomain:'meenakshi-heritage.myshopify.com',autoSync:true,invoiceAuthority:'POS',trackingDefault:'serial',cashLimit:190000,approvalPin:'1234',serialFormat:'<WEAVE>-<YYMM>-<SEQ5>',gstDefault:5},
    users:[],vendors:[],customers:[],items:[],locations:[],exhibitions:[],pieces:[],moves:[],pos:[],grns:[],invoices:[],transfers:[],recons:[],salesReturns:[],purchaseReturns:[],drawers:[],petty:[],sync:[],audit:[],labels:[],localPurchases:[],vpay:[],adjustments:[],audits:[],holds:[],trials:[],bookings:[],approvals:[],wishlist:[],sessions:[],exports:[],gstinReg:[]};
  V.S.user='U01';
  // ---- users
  db.users=[{id:'U01',name:'Meenakshi Iyer',role:'Owner',disc:100,email:'meenakshi@heritage.in'},{id:'U02',name:'Karthik Raman',role:'Store Manager',disc:12,email:'karthik@heritage.in'},{id:'U03',name:'Divya Subramani',role:'Cashier',disc:5,email:'divya@heritage.in'},{id:'U04',name:'Suresh Kumar',role:'Cashier',disc:5,email:'suresh@heritage.in'},{id:'U05',name:'Murugan Pillai',role:'Store Keeper',disc:0,email:'murugan@heritage.in'},{id:'U06',name:'Lakshmi Narayan',role:'Accountant',disc:0,email:'lakshmi@heritage.in'},{id:'U07',name:'Arun Venkat',role:'Exhibition In-charge',disc:8,email:'arun@heritage.in'}];
  // ---- locations & exhibitions
  const gst=(st,seed)=>{const r=V.rng(V.hash(st+seed));const L='ABCDEFGHJKLMNPRSTUVWXYZ';return V.STATES[st]+'AAB'+L[Math.floor(r()*L.length)]+'M'+(1000+Math.floor(r()*8999))+L[Math.floor(r()*L.length)]+'1Z'+L[Math.floor(r()*L.length)]};
  db.locations=[{id:'MAIN',code:'MN',name:'Chennai Flagship — Nungambakkam',type:'Showroom',city:'Chennai',state:'Tamil Nadu',gstin:gst('Tamil Nadu','m'),shopifyLoc:'Chennai Flagship (Shopify POS)',status:'Active',bins:['Silk Wall A','Silk Wall B','Bridal Vault','Display Window']},
    {id:'VAULT',code:'VT',name:'Heritage Vault — Warehouse',type:'Warehouse',city:'Chennai',state:'Tamil Nadu',gstin:gst('Tamil Nadu','m'),shopifyLoc:'Warehouse (Shopify)',status:'Active',bins:['Rack 1','Rack 2','Climate Locker']}];
  const mkExh=(city,abbr,st,name,venue,s,e,status,seq,stall,target,inch)=>{const code=`EXH-2026-${abbr}-${String(seq).padStart(3,'0')}`;
    const ex={code,name,venue,city,state:st,start:s,end:e,plant:'P-'+abbr,incharge:inch,staff:['U03','U04'].slice(0,seq%2+1),stall,target,status,notes:''};db.exhibitions.push(ex);
    db.locations.push({id:'P-'+abbr,code:abbr,name:'Exhibition Plant — '+city,type:'Exhibition',city,state:st,gstin:gst(st,'x'),shopifyLoc:status==='Planned'?'':'Pop-up · '+city,status:status==='Planned'?'Planned':status==='Live'?'Active':'Closed',bins:['Stall Rack','Display Table'],exh:code});return ex};
  mkExh('Mumbai','MUM','Maharashtra','Kala Utsav Mumbai','NSCI Dome, Worli',ad(today,-140),ad(today,-136),'Reconciled',1,85000,1800000,'U07');
  mkExh('Bengaluru','BLR','Karnataka','Silk Heritage Fair','Palace Grounds, Bengaluru',ad(today,-82),ad(today,-78),'Reconciled',2,95000,2200000,'U07');
  mkExh('Hyderabad','HYD','Telangana','Festive Weaves Hyderabad','HITEX Exhibition Centre',ad(today,-5),ad(today,4),'Live',3,110000,3000000,'U07');
  mkExh('New Delhi','DEL','Delhi','Diwali Dhaaga Delhi','Dilli Haat INA',ad(today,23),ad(today,32),'Planned',4,120000,3500000,'U07');
  mkExh('Kolkata','KOL','West Bengal','Pujo Bunon Kolkata','Milan Mela Ground',ad(today,52),ad(today,56),'Planned',5,70000,1500000,'U02');
  // ---- vendors
  const vn=[['KJV','Sri Kamakshi Silk Weavers Co-op','Cooperative','Kanchipuram','Tamil Nadu','Net 30'],['BNR','Banaras Zari Haveli','Master Weaver','Varanasi','Uttar Pradesh','30% advance, balance on delivery'],['PTL','Patan Patola Heritage Trust','Artisan Trust','Patan','Gujarat','50% advance'],['POC','Pochampally Ikat Weavers Society','Cooperative','Pochampally','Telangana','Net 30'],['JMD','Phulia Jamdani Karigar Samiti','Cooperative','Phulia','West Bengal','Net 21'],['PTH','Yeola Paithani Looms','Master Weaver','Yeola','Maharashtra','30% advance'],['MYS','Mysuru Silk Artisans Guild','Cooperative','Mysuru','Karnataka','Net 30'],['KTD','Kaithoon Kota Craft Collective','Artisan Trust','Kaithoon','Rajasthan','Net 15'],['CHD','Chanderi Karigar Sangh','Cooperative','Chanderi','Madhya Pradesh','Net 21'],['BLC','Bishnupur Baluchari Kendra','Master Weaver','Bishnupur','West Bengal','40% advance'],['SMB','Sambalpur Bomkai Co-operative','Cooperative','Sambalpur','Odisha','Net 30'],['TSR','Bhagalpur Tussar Weavers','Artisan Trust','Bhagalpur','Bihar','Net 30']];
  vn.forEach((v,i)=>db.vendors.push({id:'V'+String(i+1).padStart(2,'0'),code:'V-'+v[0],name:v[1],weave:v[0],type:v[2],city:v[3],state:v[4],gstin:i%5===3?'':gst(v[4],'v'+i),pan:'AAB'+'CDEFG'[i%5]+'P'+(1000+i*377)+'K',phone:'98'+String(40000000+i*1234567).slice(0,8),bank:'HDFC Bank ··'+(4000+i*113),terms:v[5],rating:+(3.6+R()*1.3).toFixed(1),artisanCard:'AC-'+(70000+i*511),since:'2019-0'+(1+i%9)+'-12',reg:i%5===3?'Unregistered (RCM)':'Regular'}));
  db.vendors.push({id:'V13',code:'V-LOC1',name:'Lakshmi Packaging & Display',weave:'',type:'Local Supplier',city:'Chennai',state:'Tamil Nadu',gstin:gst('Tamil Nadu','l1'),pan:'AABCL1234K',phone:'9841011223',bank:'ICICI ··3321',terms:'Cash / Net 7',rating:4.4,since:'2020-02-01',reg:'Regular'},{id:'V14',code:'V-LOC2',name:'Shree Blouse Fabrics',weave:'',type:'Local Supplier',city:'Chennai',state:'Tamil Nadu',gstin:gst('Tamil Nadu','l2'),pan:'AABCS5678P',phone:'9884455667',bank:'SBI ··8812',terms:'Cash',rating:4.1,since:'2021-06-01',reg:'Regular'});
  // ---- items
  let n=0;V.WEAVES.forEach((w,wi)=>{w.descs.forEach((d,di)=>{const c=V.COLOURS[(wi*3+di*5+rnd(0,2))%V.COLOURS.length];const mrp=Math.round((w.lo+(w.hi-w.lo)*(.12+R()*.8))/500)*500;
    db.items.push({sku:`${w.code}-${String(di+1).padStart(2,'0')}`,name:`${w.name} ${d}`,weave:w.code,colour:c[0],body:c[1],bord:c[2],cat:'Saree',fabric:w.fabric,zari:w.zari,hsn:w.hsn,gst:5,mrp,cost:Math.round(mrp*.62/100)*100,trk:'serial',len:'6.3 m + 0.9 m blouse',cert:w.cert,pat:w.pat,region:w.region,shopify:true,active:true,handle:(w.name+'-'+d).toLowerCase().replace(/[^a-z0-9]+/g,'-')})})});
  if(!V.basic)['BLC-02','SMB-02'].forEach(k=>db.items.find(i=>i.sku===k).shopify=false);
  [['ACC-BLS','Raw Silk Blouse Piece (0.9 m)',2400,'Blouse Piece','#7A1F3D'],['ACC-DUP','Zari Silk Dupatta',6500,'Dupatta','#1E2A5E'],['ACC-BOX','Heritage Gift Box + Saree Cover',1200,'Packaging','#0F6B5B']].forEach(a=>db.items.push({sku:a[0],name:a[1],weave:'',colour:'Assorted',body:a[4],bord:'#E3C57A',cat:'Accessory',fabric:'Raw Silk',zari:'',hsn:'6217',gst:12,mrp:a[2],cost:Math.round(a[2]*.55),trk:'batch',len:'',cert:'',pat:'butta',region:'',shopify:true,active:true,handle:a[0].toLowerCase()}));
  // ---- customers
  const FN=['Priya','Ananya','Kavitha','Lakshmi','Divya','Meera','Revathi','Sudha','Anitha','Deepa','Shalini','Radhika','Nandini','Pooja','Swathi','Bhavana','Geetha','Uma','Vasanthi','Janani','Harini','Sowmya','Aishwarya','Rukmini','Padma','Sangeetha','Vidya','Archana','Madhavi','Jyothi','Pallavi','Smita','Rashmi','Neha','Isha','Sunita','Kirti','Aarti','Mamta','Rekha','Rajesh','Arvind','Vikram','Naveen'];
  const LN=['Iyer','Raman','Krishnan','Subramanian','Venkatesh','Narayanan','Reddy','Rao','Naidu','Shetty','Hegde','Kulkarni','Joshi','Deshmukh','Patil','Mehta','Shah','Kapoor','Malhotra','Gupta','Chatterjee','Bose','Menon','Pillai','Nair','Chandran','Balaji','Ramesh','Srinivasan','Murthy'];
  const pools=[['Tamil Nadu',['Chennai','Chennai','Chennai','Chennai','Coimbatore','Madurai'],38],['Karnataka',['Bengaluru'],10],['Telangana',['Hyderabad'],10],['Maharashtra',['Mumbai','Pune'],10],['Delhi',['New Delhi'],4]];
  let ci=0;pools.forEach(([st,cities,k])=>{for(let i=0;i<k;i++){ci++;const f=pick(FN),l=pick(LN),w=pick(V.WEAVES);const b2b=R()<.07;const tm=R()<.5?pick(V.COLOURS)[0]:'';
    db.customers.push({id:'C'+String(ci).padStart(4,'0'),name:f+' '+l,phone:'9'+String(rnd(100000000,999999999)),email:(f+'.'+l).toLowerCase()+'@mail.in',city:pick(cities),state:st,gstin:b2b?gst(st,'c'+ci):'',company:b2b?l+' Boutique & Designs':'',dob:`19${rnd(62,92)}-${String(rnd(1,12)).padStart(2,'0')}-${String(rnd(1,28)).padStart(2,'0')}`,anniv:R()<.7?`20${rnd(0,19)<10?'0'+rnd(0,9):rnd(10,19)}-${String(rnd(1,12)).padStart(2,'0')}-${String(rnd(1,28)).padStart(2,'0')}`:'',
      prefs:{weaves:[w.code,pick(V.WEAVES).code],colour:tm||pick(V.COLOURS)[0],budget:[rnd(3,9)*10000,rnd(11,30)*10000]},since:ad(D0,rnd(0,DAYS-30)),tier:'Silver',credit:0,loyalty:0,notes:R()<.2?'Prefers temple borders; family occasions every season.':'',consent:true})}});
  L_idx();function L_idx(){V.L.idx()}
  // ---- scheduled events
  const ev={};const at=(d,f)=>(ev[d]=ev[d]||[]).push(f);
  const mrpVar=(it)=>Math.max(it.cat==='Saree'?25000:it.mrp,Math.round(it.mrp*(.92+R()*.2)/500)*500);
  const lineFor=(it,qty,slow)=>{const mrps=[],costs=[];for(let i=0;i<qty;i++){const m=mrpVar(it);mrps.push(m);costs.push(Math.round(m*(.6+R()*.06)/100)*100)}return {sku:it.sku,qty,rate:it.cost,mrps,costs,slow}};
  // opening stock (Excel migration)
  at(ad(today,-330),()=>{});
  const sarees=db.items.filter(i=>i.cat==='Saree');
  {const lines={};for(let i=0;i<30;i++){const it=pick(sarees);(lines[it.sku]=lines[it.sku]||0);lines[it.sku]++}
   V.L.grnPost({vendor:V.m.vendor['V01'].id,loc:'MAIN',date:ad(today,-330),opening:true,by:'U05',note:'Opening stock migrated from Excel',lines:Object.entries(lines).map(([sku,q])=>lineFor(V.m.item[sku],q,true))});
   // opening GRN vendor is arbitrary; fix per-piece vendor by weave
   db.pieces.forEach(p=>{const v=db.vendors.find(x=>x.weave===V.m.item[p.sku].weave);if(v)p.vendor=v.id})}
  const wv=['V01','V01','V01','V02','V02','V02','V03','V04','V05','V06','V06','V07','V08','V09','V10','V11','V12'];
  const pending=[];
  for(let k=0;k<16;k++){const pd=ad(today,-176+k*11),vend=V.m.vendor[pick(wv)],its=sarees.filter(i=>i.weave===vend.weave);
    const ls=V.uniq([pick(its),pick(its),pick(its)]).slice(0,rnd(2,3)).map(it=>({sku:it.sku,qty:rnd(10,15),rate:it.cost}));
    const status=k<12?'Closed':k===12?'Partially Received':(V.basic||k===14)?'Issued':k===13?'Approved':'Draft';
    if(k<13){at(pd,()=>{const po=V.L.poCreate({vendor:vend.id,date:pd,lines:ls,status:'Issued',by:'U06'});const gd=ad(pd,rnd(7,13));
      at(gd<=ad(today,-3)?gd:ad(today,-3),()=>{const part=k===12;V.L.grnPost({po:po.no,vendor:vend.id,date:gd<=ad(today,-3)?gd:ad(today,-3),by:'U05',freight:rnd(8,25)*100,lines:ls.map(l=>{const q=part?Math.ceil(l.qty*.6):l.qty,rej=!part&&R()<.18?1:0;const ln=lineFor(V.m.item[l.sku],q-rej);return Object.assign(ln,{qty:q,rej,ordered:l.qty,rejReason:rej?'Zari tarnish / weaving defect at QC':''})})})})})}
    else at(pd,()=>V.L.poCreate({vendor:vend.id,date:pd,lines:ls,status,by:'U06',src:k===14?'Excel Upload':'Manual'}))}
  // accessories (batch) GRNs
  [-170,-75,-20].forEach(o=>at(ad(today,o),()=>V.L.grnPost({vendor:'V14',date:ad(today,o),by:'U05',lines:[{sku:'ACC-BLS',qty:50,rate:1320},{sku:'ACC-DUP',qty:24,rate:3600},{sku:'ACC-BOX',qty:80,rate:660}]})));
  // exhibitions: transfers & recon
  db.exhibitions.filter(e=>e.status!=='Planned').forEach(e=>{
    const td=ad(e.start,-3);
    at(td<=today?td:today,()=>{const pool=db.pieces.filter(p=>p.loc==='MAIN'&&p.status==='in_stock'&&p.trk==='serial'&&p.since<=td&&!p.slow).sort(()=>R()-.5).slice(0,e.status==='Live'?36:40);
      const t=V.L.trfCreate({from:'MAIN',to:e.plant,exh:e.code,date:td,by:'U05',lines:pool.map(p=>({u:p.u,qty:1})),note:'Stock for '+e.name});V.L.trfDispatch(t.no,td,'U05');V.L.trfReceive(t.no,ad(td,1)<=today?ad(td,1):today,'U07')});
    if(e.status==='Reconciled')at(ad(e.end,2),()=>{const rows=db.pieces.filter(p=>p.loc===e.plant&&p.status==='in_stock');const vd={};if(rows.length>3){vd[rows[1].u]=e.code.includes('MUM')?'missing':'damaged'}V.L.exhRecon(e.code,vd,'U07',ad(e.end,2))})});
  // ---- daily simulation
  const mkTimes=(n,date)=>Array.from({length:n},()=>{let h=rnd(10,20),m=rnd(0,59);if(date===today){h=rnd(10,12);m=rnd(0,59)}return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')}).sort();
  const custPool=(loc,date)=>{const st=V.m.loc[loc].state;let c=db.customers.filter(x=>x.state===st&&x.since<=date);if(loc==='MAIN'&&R()<.12)c=db.customers.filter(x=>x.since<=date);return c.length?c:db.customers};
  const sellOne=(loc,date,time)=>{
    const pool=db.pieces.filter(p=>p.loc===loc&&p.status==='in_stock'&&p.qty>0&&p.trk==='serial'&&p.since<=date&&!(p.slow&&R()<.9));if(!pool.length)return;
    const cu=pick(custPool(loc,date)),p=pick(pool),r=R();const dp=r<.4?0:r<.75?rnd(2,6):r<.95?rnd(7,10):rnd(11,14);
    const mk=q=>({u:q.u,qty:1,disc:Math.round(q.mrp*dp/100/10)*10});let lines=[mk(p)];
    if(R()<.08){const p2=pick(pool.filter(x=>x.u!==p.u));if(p2)lines.push(mk(p2))}
    ['ACC-BLS','ACC-DUP','ACC-BOX'].forEach(a=>{if(R()<(a==='ACC-BOX'?.35:.22)){const q=db.pieces.find(x=>x.sku===a&&x.loc===loc&&x.status==='in_stock'&&x.qty>0);if(q)lines.push({u:q.u,qty:1,disc:0})}});
    const tot=V.sum(lines,l=>V.m.piece[l.u].mrp-l.disc),s=R();let pays;const cap=db.settings.cashLimit;
    if(s<.3)pays=[{mode:'UPI',amt:tot,ref:'UPI'+rnd(100000000,999999999)}];else if(s<.55)pays=[{mode:'Card',amt:tot,ref:'POS-HDFC-'+rnd(1000,9999)}];
    else if(s<.68){const a=Math.round(tot*(.4+R()*.2)/100)*100;pays=[{mode:'Card',amt:a,ref:'POS-HDFC-'+rnd(1000,9999)},{mode:'UPI',amt:tot-a,ref:'UPI'+rnd(100000000,999999999)}]}
    else if(s<.8){const a=Math.min(cap,Math.round(rnd(10000,40000)/500)*500,tot);pays=[{mode:'Cash',amt:a},{mode:'UPI',amt:tot-a,ref:'UPI'+rnd(100000000,999999999)}].filter(x=>x.amt>0)}
    else if(s<.88)pays=[{mode:'Bank Transfer',amt:tot,ref:'NEFT'+rnd(10000000,99999999)}];else if(s<.94)pays=[{mode:'EMI',amt:tot,ref:'EMI-BAJ-'+rnd(10000,99999)}];
    else if(s<.98)pays=[{mode:'Cheque',amt:tot,ref:'CHQ '+rnd(100000,999999)}];else{const a=Math.min(tot,rnd(5,20)*1000);pays=[{mode:'Store Credit',amt:a,ref:'CN'},{mode:'UPI',amt:tot-a,ref:'UPI'+rnd(100000000,999999999)}].filter(x=>x.amt>0)}
    const sp=loc==='MAIN'?pick(['U02','U03','U04','U03']):pick(['U07','U03','U07']);
    V.L.invoicePost({loc,date,time,cust:cu.id,lines,pays,sp,cashier:pick(['U03','U04'])})};
  const petty=(loc,date,k)=>{for(let i=0;i<k;i++){const h=loc==='MAIN'?pick(V.HEADS.slice(0,9)):pick(['Staff Meals (Exhibition)','Local Transport','Tea & Refreshments','Packing Material','Electricity (Stall)']);
      const amt=h==='Courier & Freight'?rnd(3,12)*100:h==='Repairs & Maintenance'?rnd(5,25)*100:rnd(1,9)*50+rnd(0,3)*100;
      if(V.L.pettyBal(loc)<amt+800)V.L.pettyAdd({loc,date,head:'Imprest top-up',desc:'Cash drawn from drawer',amt:10000,type:'topup',by:'U02',time:'10:30'});
      V.L.pettyAdd({loc,date,head:h,desc:h+' — '+(loc==='MAIN'?'showroom':'exhibition'),amt,by:pick(['U03','U04','U05']),bill:R()<.6?'BL-'+rnd(100,999):''})}};
  for(let i=0;i<=DAYS;i++){
    const date=ad(D0,i);(ev[date]||[]).forEach(f=>f());
    const dw=V.dow(date),w=dw===0?1.7:dw===6?1.5:dw===5?1.1:.75,m=+date.slice(5,7),fest=V.diff(today,date)<35?1.45:(m===4||m===5)?1.2:1;
    const rate=.62*w*fest,nMain=Math.floor(rate)+(R()<rate%1?1:0)+(R()<.14?1:0);
    // main drawer
    const dr=V.L.drawer('MAIN',date);dr.openedBy=pick(['U03','U04']);
    if(i===0)V.L.pettyAdd({loc:'MAIN',date,head:'Imprest top-up',desc:'Opening petty float',amt:8000,type:'topup',by:'U02',time:'10:05'});
    mkTimes(nMain,date).forEach(t=>sellOne('MAIN',date,t));
    if(R()<.72)petty('MAIN',date,rnd(1,3));
    // live exhibitions
    db.exhibitions.forEach(e=>{if(e.status==='Planned'||date<e.start||date>e.end)return;
      const r2=V.L.drawer(e.plant,date);r2.float=15000;r2.openedBy='U07';
      if(date===e.start){V.L.pettyAdd({loc:e.plant,date,head:'Imprest top-up',desc:'Exhibition petty float',amt:30000,type:'topup',by:'U07',time:'09:30'});V.L.pettyAdd({loc:e.plant,date,head:'Stall Decoration',desc:'Stall set-up & lighting',amt:rnd(12,22)*1000,by:'U07',bill:'EX-'+rnd(100,999)})}
      mkTimes(e.status==='Live'?rnd(1,3):rnd(2,5),date).forEach(t=>sellOne(e.plant,date,t));petty(e.plant,date,rnd(1,3));
      if(date<today)closeDay(e.plant,date)});
    if(date<today)closeDay('MAIN',date);
  }
  function closeDay(loc,date){const r=V.L.drawer(loc,date,false);if(!r||r.status==='closed')return;const c=V.L.drawerCalc(r),drop=Math.max(0,Math.floor((c.float+c.sales+c.cin-c.cout-c.drop)/1000)*1000-r.float);
    if(drop>0)r.entries.push({t:'drop',amt:drop,reason:'Safe drop / bank deposit',time:'19:45',by:r.openedBy});
    const exp=V.L.drawerCalc(r).expected,v=R()<.82?0:pick([-500,-200,-100,-50,100,200,300]);
    const den={};let rem=exp+v;V.DENOM.forEach(d=>{den[d]=Math.floor(rem/d);rem-=den[d]*d});V.L.closeDrawer(r,{counted:exp+v,denom:den,by:r.openedBy,note:v?'Variance noted':'',time:'20:45'})}
  // today's exhibition drawers stay open
  // ---- post-sim records
  const L=V.L;
  // sales returns
  const cands=db.invoices.filter(i=>V.diff(today,i.date)>12&&i.lines[0].sku.indexOf('ACC')<0);
  const used=new Set();[0,1,2,3,4,5,6].forEach(k=>{const iv=cands[Math.floor(cands.length/8)*(k+1)];if(!iv||used.has(iv.no))return;used.add(iv.no);
    const reason=V.RETURN_REASONS[k%6],cond=['Minor zari snag on pallu','Water stain noticed','Loose weft thread'].includes(reason)?'damaged':'good';
    const sr=L.salesReturn({inv:iv.no,lines:[{u:iv.lines[0].u,reason,cond}],mode:k===2?'Refund':k===5?'Exchange':'Credit Note',refundMode:'UPI',date:ad(iv.date,rnd(2,8)),by:'U02',loc:'MAIN'});
    if(sr.mode==='Exchange'){sr.cn=L.next('cn','CN/'+L.fy(sr.date)+'/',4);V.m.cust[iv.cust].credit=(V.m.cust[iv.cust].credit||0)}});
  // purchase returns
  const gs=db.grns.filter(g=>!g.opening&&V.diff(today,g.date)>35);
  [1,3,5].forEach((k,j)=>{const g=gs[k];if(!g)return;const p=db.pieces.find(x=>x.grn===g.no&&x.status==='in_stock'&&x.loc==='MAIN');if(p)L.purchaseReturn({vendor:g.vendor,grn:g.no,units:[p.u],reason:['Zari tarnish found after QC re-check','Shade variation vs approved sample','Pallu weaving defect'][j],date:ad(g.date,rnd(12,25)),by:'U05'})});
  // adjustments, audits, holds, trials, bookings
  const mainStock=()=>db.pieces.filter(p=>p.loc==='MAIN'&&p.status==='in_stock'&&p.trk==='serial');
  mainStock().slice(3,5).forEach((p,i)=>{p.status='damaged';db.adjustments.push({no:L.next('adj','ADJ-',4),date:ad(today,-40+i*9),loc:'MAIN',u:p.u,type:'Damage Write-off',qty:1,reason:i?'Moth damage at fold line':'Water seepage during monsoon',by:'U05',approvedBy:'U01',status:'Approved'});L.move(p,'ADJUST','MAIN','—','ADJ','','U05','Damage write-off')});
  {const p=mainStock().find(x=>V.diff(today,x.since)>150);if(p){db.adjustments.push({no:L.next('adj','ADJ-',4),date:ad(today,-12),loc:'MAIN',u:p.u,type:'Repricing (ageing markdown)',qty:1,old:p.mrp,new:Math.round(p.mrp*.92/500)*500,reason:'Aged >150 days — approved markdown',by:'U02',approvedBy:'U01',status:'Approved'});p.mrp=Math.round(p.mrp*.92/500)*500}}
  db.audits.push({no:'AUD-0001',date:ad(today,-62),loc:'MAIN',system:96,counted:96,variance:0,by:'U05',status:'Closed',notes:'Quarterly full count — no variance'},{no:'AUD-0002',date:ad(today,-21),loc:'MAIN',system:88,counted:87,variance:-1,by:'U05',status:'Closed',notes:'1 serial found in Heritage Vault bin — relocated'});
  if(!V.basic)mainStock().slice(8,11).forEach((p,i)=>{const c=db.customers[i*7+3];p.status='hold';p.holdFor=c.id;db.holds.push({no:'HLD-'+(101+i),date:ad(today,-i-1),cust:c.id,u:p.u,until:ad(today,3+i),status:'Active',by:'U03',note:'Customer to confirm after family viewing'});L.move(p,'HOLD','MAIN','MAIN','HLD-'+(101+i),'','U03')});
  if(!V.basic)mainStock().slice(14,16).forEach((p,i)=>{const c=db.customers[i*5+9];p.status='trial';p.holdFor=c.id;db.trials.push({no:'TRL-'+(201+i),date:ad(today,-2-i),cust:c.id,u:p.u,due:ad(today,2+i*2),status:'Out',by:'U02'});L.move(p,'TRIAL','MAIN','Customer','TRL-'+(201+i),'','U02','Approval on sight')});
  if(!V.basic)mainStock().slice(20,23).forEach((p,i)=>{const c=db.customers[i*6+1];p.status='booked';p.holdFor=c.id;const adv=Math.round(p.mrp*.25/1000)*1000;db.bookings.push({no:'BKG-'+(301+i),date:ad(today,-6-i*3),cust:c.id,u:p.u,advance:adv,mode:'UPI',due:ad(today,10+i*5),status:'Open',by:'U03'});L.move(p,'BOOK','MAIN','MAIN','BKG-'+(301+i),'','U03','Advance '+adv)});
  // local purchases
  const lpc=[['Packing Material','Gift boxes (silk-finish) & tissue',48,320],['Blouse Fabric','Raw silk blouse cuts — colour match',30,540],['Display & Fixtures','Mannequin drape stands',4,6400],['Stationery','Invoice rolls, tag strings',20,180],['Repairs & Maintenance','Showroom lighting repair',1,4800],['Gift Boxes','Premium saree covers',60,95],['Packing Material','Zip covers & silica sachets',100,28]];
  for(let i=0;i<14;i++){const c=lpc[i%lpc.length],q=c[2]+rnd(0,6),amt=q*c[3],gstp=amt*.18/1.18;db.localPurchases.push({no:'LP-'+String(i+1).padStart(4,'0'),date:ad(today,-175+i*12+rnd(0,5)),vendor:pick(['V13','V14']),loc:'MAIN',category:c[0],desc:c[1],qty:q,rate:c[3],amt,gst:Math.round(gstp),mode:pick(['Cash','UPI','UPI']),bill:'B-'+rnd(1000,9999),stockIn:c[0]==='Blouse Fabric',by:'U05'})}
  // vendor payments
  db.grns.filter(g=>V.diff(today,g.date)>20).forEach(g=>{if(R()<.88)db.vpay.push({id:L.next('vp','VP-',4),date:ad(g.date,rnd(14,32)),vendor:g.vendor,type:'Payment',amt:Math.round(g.value*(R()<.8?1:.6)/100)*100,mode:'Bank Transfer',ref:'UTR'+rnd(100000000,999999999),against:g.no})});
  [['V02',150000],['V03',250000],['V06',120000],['V10',90000]].forEach((a,i)=>db.vpay.push({id:L.next('vp','VP-',4),date:ad(today,-70+i*13),vendor:a[0],type:'Advance',amt:a[1],mode:'Bank Transfer',ref:'UTR'+rnd(100000000,999999999),against:'Advance for loom booking'}));
  // customers: tier, loyalty
  db.customers.forEach(c=>{const s=V.sum(db.invoices.filter(i=>i.cust===c.id),i=>i.net);c.spend=s;c.tier=s>=600000?'Maharani':s>=250000?'Rani':s>=100000?'Gold':'Silver';c.loyalty=Math.floor(s/100)});
  // wishlist
  db.customers.slice(2,16).forEach((c,i)=>db.wishlist.push({id:'WL-'+(i+1),cust:c.id,weave:pick(V.WEAVES).code,colour:pick(V.COLOURS)[0],budget:rnd(4,20)*10000,date:ad(today,-rnd(1,60)),status:'Open',note:'Wedding in '+pick(['Nov','Dec','Jan','Feb'])}));
  // shopify queue states
  const seenC=new Set();db.invoices.slice().sort((a,b)=>a.date<b.date?-1:1).forEach(iv=>{if(iv.cust&&!seenC.has(iv.cust)){seenC.add(iv.cust);const s=L.syncAdd('Customer',iv.cust,iv.loc,0,iv.date);if(V.diff(today,iv.date)>=2)L.syncRun(s,iv.date);else{}}});
  db.sync.forEach(s=>{const d=s.t.slice(0,10);if(V.diff(today,d)>=2)L.syncRun(s,ad(d,1))});
  db.invoices.forEach(i=>{const s=db.sync.find(x=>x.ref===i.no&&x.type==='Order');i.sync=s?s.status:'Pending'});
  for(let k=1;k<=8;k++){const s=L.syncAdd('Inventory','Stock levels '+ad(today,-k),'MAIN',db.pieces.filter(p=>p.loc==='MAIN'&&p.status==='in_stock').length,ad(today,-k));L.syncRun(s,ad(today,-k))}
  L.syncAdd('Inventory','Stock levels '+today,'MAIN',db.pieces.filter(p=>p.loc==='MAIN'&&p.status==='in_stock').length,today);
  // approvals
  db.invoices.filter(i=>i.disc/i.sub>.1).slice(-6).forEach((i,k)=>db.approvals.push({id:'APR-'+(k+1),type:'Discount > 10%',ref:i.no,by:i.cashier,date:i.date,amt:i.disc,status:'Approved',note:Math.round(i.disc/i.sub*100)+'% on '+i.lines[0].name,decidedBy:'U02',decidedOn:i.date}));
  const dpo=db.pos.find(p=>p.status==='Draft');
  db.approvals.push({id:'APR-20',type:'Purchase Order',ref:dpo?dpo.no:'—',by:'U06',date:ad(today,-1),amt:dpo?dpo.value:0,status:'Pending',note:'New season order — awaiting owner approval'},{id:'APR-21',type:'Stock Adjustment',ref:'Write-off',by:'U05',date:today,amt:62000,status:'Pending',note:'Colour bleed on 1 serial after cleaning'},{id:'APR-22',type:'Stock Transfer',ref:'MAIN → Delhi Exhibition',by:'U05',date:today,amt:1850000,status:'Pending',note:'Inter-state transfer, 38 pieces — IGST/e-way bill'},{id:'APR-23',type:'Discount > 10%',ref:'Bridal booking BKG-302',by:'U03',date:today,amt:18500,status:'Pending',note:'12% requested on bridal combo'});
  // sessions
  for(let i=0;i<30;i++){const u=pick(db.users);db.sessions.push({t:ad(today,-Math.floor(i/3))+' '+String(rnd(9,10)).padStart(2,'0')+':'+String(rnd(0,59)).padStart(2,'0'),user:u.id,ev:i%11===4?'Failed login':'Login',ip:'49.37.'+rnd(10,250)+'.'+rnd(1,250),dev:pick(['Chrome · Windows','Edge · Windows','Safari · iPad','Chrome · Android'])})}
  db.exports.push({t:ad(today,-3)+' 21:10',user:'U06',kind:'Orders CSV (Shopify format)',rows:41,file:'shopify_orders_'+ad(today,-3)+'.csv'},{t:ad(today,-9)+' 20:55',user:'U06',kind:'Inventory levels CSV',rows:96,file:'shopify_inventory_'+ad(today,-9)+'.csv'});
  db.audit.sort((a,b)=>a.t<b.t?-1:1);
  return db;
};
})();
