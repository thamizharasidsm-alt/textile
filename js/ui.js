/* UI helpers: tables, modals, charts, KPIs, export */
(function(){
V.PAL=[V.brand.primary,'#1E2A5E',V.brand.accent,'#0F6B6B','#C14570','#5B7DB1','#8A6420','#2E8B57','#D27D2D','#6A4C93','#A0522D','#3C8DAD'];
V.ST={in_stock:['In stock','ok'],sold:['Sold',''],hold:['On hold','warn'],trial:['On trial','info'],booked:['Booked','gold'],transit:['In transit','info'],damaged:['Damaged','bad'],missing:['Missing','bad'],vendor_return:['Returned to vendor','warn'],quarantine:['Quarantine','warn']};
V.sk=s=>({Posted:'ok',Synced:'ok',Closed:'ok',Received:'ok',Approved:'ok',Reconciled:'ok',Passed:'ok',Active:'ok',Live:'ok',Open:'info',Pending:'warn',Draft:'',Issued:'info','Partially Received':'warn','In-Transit':'info',Failed:'bad',Rejected:'bad',Cancelled:'bad',Planned:'gold',Out:'info',Converted:'ok',Returned:'warn',Quarantine:'warn'}[s]||'');
V.badge=(t,k)=>`<span class="badge ${k===undefined?V.sk(t):k}">${V.esc(t)}</span>`;
V.pstat=p=>{const s=V.ST[p.status]||[p.status,''];return V.badge(s[0],s[1])};
V.head=(t,d,acts='')=>`<div class="head"><div><h1>${t}</h1>${d?`<p>${d}</p>`:''}</div><div class="acts">${acts}</div></div>`;
V.card=(t,sub,body,cls='')=>`<section class="card ${cls}">${t?`<h3>${t}</h3>`:''}${sub?`<div class="sub">${sub}</div>`:''}${body}</section>`;
V.opts=(list,sel,f)=>list.map(x=>{const v=f?f.v(x):x,l=f?f.l(x):x;return `<option value="${V.esc(v)}"${v===sel?' selected':''}>${V.esc(l)}</option>`}).join('');
V.field=(l,inp,hint,cls='')=>`<div class="field ${cls}"><label>${l}</label>${inp}${hint?`<span class="hint">${hint}</span>`:''}</div>`;

V.formVals=root=>{const o={};V.$$('[name]',root).forEach(e=>{o[e.name]=e.type==='checkbox'?e.checked:e.value});return o};

// ---- KPI + sparkline
V.spark=(arr,c='#B8893A',w=92,h=32)=>{if(!arr||arr.length<2)return '';const mx=Math.max(...arr),mn=Math.min(...arr),sx=w/(arr.length-1),f=v=>h-3-(mx===mn?.5:(v-mn)/(mx-mn))*(h-8);
  const d=arr.map((v,i)=>(i?'L':'M')+(i*sx).toFixed(1)+' '+f(v).toFixed(1)).join(' ');return `<svg class="spark" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path d="${d} L${w} ${h} L0 ${h}Z" fill="${c}" fill-opacity=".14"/><path d="${d}" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`};
V.fmtN=(n,f)=>f==='short'?V.short(n):f==='inr'?V.inr(n):f==='pct'?n.toFixed(1)+'%':V.num(n);
V.kpi=({l,n,f='num',sub='',ic='chart',c='var(--primary)',spark,trend})=>`<div class="card kpi" style="--c:${c}"><div class="ico">${V.ic(ic)}</div><div class="lbl">${l}</div><div class="val" data-n="${n}" data-f="${f}">${V.fmtN(n,f)}</div><div class="sub">${trend!==undefined?`<span class="trend ${trend>=0?'up':'dn'}">${trend>=0?'▲':'▼'} ${Math.abs(trend).toFixed(1)}%</span> `:''}${sub}</div>${spark?V.spark(spark,c.startsWith('var')?V.brand.accent:c):''}</div>`;
V.countUp=(root=document)=>{const rm=matchMedia('(prefers-reduced-motion:reduce)').matches;V.$$('.val[data-n]',root).forEach(el=>{const n=+el.dataset.n,f=el.dataset.f;if(rm||!n)return;const t0=performance.now(),D=700;const st=t=>{const k=Math.min(1,(t-t0)/D),e=1-Math.pow(1-k,3);el.textContent=V.fmtN(n*e,f);if(k<1)requestAnimationFrame(st)};requestAnimationFrame(st)})};

// ---- tables
V.table=(id,cfg)=>{const st=V.tbl[id]&&V.tbl[id].keep?V.tbl[id]:{q:'',sort:null,dir:1,page:0};st.cfg=cfg;V.tbl[id]=st;
  return `<div class="tbar">${cfg.search===false?'<span></span>':`<input type="search" data-tq="${id}" placeholder="${cfg.ph||'Search…'}" value="${V.esc(st.q)}" aria-label="Search table">`}<div class="row">${cfg.toolbar||''}${cfg.export===false?'':`<button class="btn sm" data-act="tblExport" data-id="${id}">${V.ic('download')} Export CSV</button>`}</div></div><div id="tt-${id}">${V.tblBody(id)}</div>`};
const cell=(c,r)=>c.f?c.f(r):c.fmt==='inr'?V.inr(r[c.k]):c.fmt==='num'?V.num(r[c.k]):c.fmt==='date'?V.fd(r[c.k]):c.fmt==='pct'?(+r[c.k]||0).toFixed(1)+'%':c.fmt==='badge'?V.badge(r[c.k]):V.esc(r[c.k]??'');
const raw=(c,r)=>c.v?c.v(r):r[c.k];
V.tblRows=id=>{const st=V.tbl[id],cfg=st.cfg;let rows=cfg.rows;if(st.q){const q=st.q.toLowerCase();rows=rows.filter(r=>cfg.cols.some(c=>String(raw(c,r)??'').toLowerCase().includes(q)))}
  if(st.sort!==null){const c=cfg.cols[st.sort];rows=rows.slice().sort((a,b)=>{const x=raw(c,a),y=raw(c,b);return (typeof x==='number'&&typeof y==='number'?x-y:String(x??'').localeCompare(String(y??''),undefined,{numeric:true}))*st.dir})}return rows};
V.tblBody=id=>{const st=V.tbl[id],cfg=st.cfg,all=V.tblRows(id),ps=cfg.pageSize||12,pages=Math.max(1,Math.ceil(all.length/ps));st.page=Math.min(st.page,pages-1);const rows=all.slice(st.page*ps,st.page*ps+ps);st.view=rows;
  const th=cfg.cols.map((c,i)=>`<th class="${c.n||['inr','num','pct'].includes(c.fmt)?'n ':''}${c.nosort?'':'sortable'}" ${c.nosort?'':`data-sort="${id}:${i}" tabindex="0" aria-sort="${st.sort===i?(st.dir>0?'ascending':'descending'):'none'}"`}>${c.l}${st.sort===i?(st.dir>0?' ▲':' ▼'):''}</th>`).join('');
  const tr=rows.map((r,ri)=>`<tr ${cfg.onRow?`class="clk" data-row="${id}:${ri}" tabindex="0"`:''}>${cfg.cols.map(c=>`<td class="${c.n||['inr','num','pct'].includes(c.fmt)?'n':''}">${cell(c,r)}</td>`).join('')}</tr>`).join('');
  let foot='';if(cfg.totals){foot=`<tfoot><tr>${cfg.cols.map((c,i)=>{if(cfg.totals.includes(c.k)){const t=V.sum(all,r=>+raw(c,r)||0);return `<td class="n">${c.fmt==='inr'?V.inr(t):V.num(t)}</td>`}return `<td>${i===0?'Total ('+all.length+')':''}</td>`}).join('')}</tr></tfoot>`}
  return `<div class="tscroll"><table class="t"><thead><tr>${th}</tr></thead><tbody>${tr||`<tr><td colspan="${cfg.cols.length}"><div class="empty">${V.art.empty()}<div>${cfg.empty||'Nothing to show for these filters.'}</div></div></td></tr>`}</tbody>${foot}</table></div>
  <div class="pager"><span>${all.length?st.page*ps+1:0}–${Math.min(all.length,st.page*ps+ps)} of ${V.num(all.length)}</span><button data-pg="${id}:-1" ${st.page<=0?'disabled':''} aria-label="Previous page">‹</button><button data-pg="${id}:1" ${st.page>=pages-1?'disabled':''} aria-label="Next page">›</button></div>`};
V.tblRefresh=id=>{const el=V.$('#tt-'+id);if(el){el.innerHTML=V.tblBody(id);V.unlink(el)}};
V.csvOf=(cols,rows)=>{const e=v=>{v=String(v??'');return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v};return [cols.map(c=>e(c.l)).join(','),...rows.map(r=>cols.map(c=>e(raw(c,r))).join(','))].join('\n')};
V.dl=(name,text,mime='text/csv')=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([text],{type:mime+';charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)};
V.xlsx=(name,cols,rows)=>{if(!window.XLSX){V.dl(name.replace(/\.xlsx$/,'.csv'),V.csvOf(cols,rows));return}const ws=XLSX.utils.aoa_to_sheet([cols.map(c=>c.l),...rows.map(r=>cols.map(c=>raw(c,r)))]);const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,'Data');XLSX.writeFile(wb,name)};
V.printHtml=(html,title='Print')=>{const f=document.createElement('iframe');f.style.cssText='position:fixed;right:0;bottom:0;width:0;height:0;border:0';document.body.appendChild(f);const d=f.contentDocument;
  d.open();d.write(`<!doctype html><html><head><meta charset="utf-8"><title>${title}</title><link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;600&display=swap" rel="stylesheet"><style>${V.printCss}</style></head><body>${html}</body></html>`);d.close();setTimeout(()=>{f.contentWindow.focus();f.contentWindow.print();setTimeout(()=>f.remove(),2000)},500)};
V.printCss=`body{font:12.5px/1.5 Inter,Arial,sans-serif;color:#222;margin:18px}h2{font-family:'Cormorant Garamond',serif;color:#7A1F3D;font-size:28px;margin:0}table{width:100%;border-collapse:collapse}th,td{border-bottom:1px solid #e6dcc8;padding:6px;text-align:left}th{background:#faf3e6;font-size:11px;text-transform:uppercase}.r{text-align:right}.temple{height:12px;margin:10px 0;border-top:2px solid #E3C57A;border-bottom:1px solid #E3C57A}.label{border:1px dashed #b9a98a;border-radius:8px;padding:8px 10px;display:inline-grid;grid-template-columns:auto 1fr;gap:8px;width:300px;margin:4px;vertical-align:top;font-size:10px}.label .nm{font-family:'Cormorant Garamond',serif;font-size:15px;font-weight:700}.label .no{font:700 11px monospace}`;

// ---- modal / toast / confirm
V._mfn=[];
V.modal=({title,body,wide,xl,foot=[],onOpen})=>{V.closeModal();V._mfn=foot.map(f=>f.fn);
  const h=`<div class="modal-bg" id="mbg" role="dialog" aria-modal="true" aria-label="${V.esc(title)}"><div class="modal ${xl?'xl':wide?'wide':''}"><header><h3>${title}</h3><button class="iconbtn" data-act="closeModal" aria-label="Close dialog">${V.ic('x')}</button></header><div class="mb">${body}</div>${foot.length?`<footer>${foot.map((f,i)=>`<button class="btn ${f.cls||''}" data-mfn="${i}">${f.l}</button>`).join('')}</footer>`:''}</div></div>`;
  V.$('#modal-root').innerHTML=h;V.unlink(V.$('#modal-root'));V._prevFocus=document.activeElement;const f=V.$('#mbg input,#mbg select,#mbg button.btn.primary');if(f)f.focus();if(onOpen)onOpen(V.$('#mbg'))};
V.closeModal=()=>{V.$('#modal-root').innerHTML='';V._mfn=[];if(V._prevFocus&&V._prevFocus.focus)try{V._prevFocus.focus()}catch(e){}};
V.confirm=(msg,ok='Confirm',danger)=>new Promise(res=>V.modal({title:'Please confirm',body:`<p style="margin:0">${msg}</p>`,foot:[{l:'Cancel',fn:()=>{res(false)}},{l:ok,cls:danger?'danger':'primary',fn:()=>{res(true)}}]}));
V.toast=(msg,k='ok')=>{const t=document.createElement('div');t.className='toast '+k;t.setAttribute('role','status');t.innerHTML=`${V.ic(k==='bad'?'alert':'check')}<span>${msg}</span>`;V.$('#toast-root').appendChild(t);setTimeout(()=>t.remove(),3800)};

// ---- charts
V.destroyCharts=()=>{V.charts.forEach(c=>{try{c.destroy()}catch(e){}});V.charts=[]};
V.chart=(id,o)=>{const el=document.getElementById(id);if(!el||!window.Chart)return;const cs=getComputedStyle(document.documentElement),ink=cs.getPropertyValue('--ink2').trim(),grid=cs.getPropertyValue('--line').trim();
  Chart.defaults.font.family="Inter,system-ui,sans-serif";Chart.defaults.color=ink;
  const type=o.type||'bar',circ=['doughnut','pie','polarArea'].includes(type),rm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const ds=(o.data||[]).map((d,i)=>{const c=d.color||V.PAL[i%V.PAL.length];return Object.assign({label:d.label,data:d.data,type:d.type,backgroundColor:circ?(d.colors||V.PAL):(type==='line'||d.type==='line'?c+'22':c),borderColor:circ?cs.getPropertyValue('--surface').trim():c,borderWidth:circ?2:(type==='line'||d.type==='line'?2.5:0),borderRadius:circ?0:5,fill:type==='line'?true:undefined,tension:.35,pointRadius:type==='line'?(o.labels.length>40?0:3):undefined,yAxisID:d.y2?'y2':undefined,order:d.order},d.extra||{})});
  const fmt=o.fmt||(v=>V.num(v));
  const opt={responsive:true,maintainAspectRatio:false,animation:rm?false:{duration:800},indexAxis:o.horizontal?'y':'x',
    plugins:{legend:{display:o.legend!==false&&(circ||ds.length>1),position:circ?'right':'bottom',labels:{usePointStyle:true,boxWidth:8,padding:14}},tooltip:{callbacks:{label:c=>' '+(c.dataset.label?c.dataset.label+': ':'')+(o.tipFmt?o.tipFmt(c.parsed.y??c.parsed.x??c.parsed,c):fmt(c.parsed.y??c.parsed.x??c.parsed))}}}};
  if(!circ){opt.scales={x:{stacked:!!o.stacked,grid:{display:false},ticks:{maxRotation:0,autoSkip:true,maxTicksLimit:o.maxTicks||14}},y:{stacked:!!o.stacked,beginAtZero:true,grid:{color:grid},ticks:{callback:v=>(o.axFmt||fmt)(v)}}};
    if(ds.some(d=>d.yAxisID==='y2'))opt.scales.y2={position:'right',grid:{display:false},beginAtZero:true,ticks:{callback:v=>V.num(v)}};if(o.horizontal){opt.scales.x.grid={color:grid};opt.scales.y.grid={display:false};opt.scales.x.ticks.callback=v=>(o.axFmt||fmt)(v);opt.scales.y.ticks={callback:function(v){const l=this.getLabelForValue(v);return String(l).length>22?String(l).slice(0,21)+'…':l}}}}
  else opt.cutout=type==='doughnut'?'62%':undefined;
  const ch=new Chart(el,{type:type==='hbar'?'bar':type,data:{labels:o.labels,datasets:ds},options:opt});V.charts.push(ch);return ch};
V.legendHtml=(labels,cols)=>`<div class="legend">${labels.map((l,i)=>`<span><i style="background:${(cols||V.PAL)[i%V.PAL.length]}"></i>${V.esc(l)}</span>`).join('')}</div>`;
V.heat=(grid,rowL,colL,color='122,31,61')=>{const mx=Math.max(1,...grid.flat());return `<div class="heat" style="grid-template-columns:36px repeat(${colL.length},minmax(0,1fr))"><span></span>${colL.map(c=>`<span class="center mute">${c}</span>`).join('')}${grid.map((r,i)=>`<span class="mute" style="align-self:center">${rowL[i]}</span>${r.map(v=>`<div title="${v}" style="background:rgba(${color},${v?(.12+.88*v/mx).toFixed(2):.05});color:${v/mx>.45?'#fff':'var(--ink2)'}">${v||''}</div>`).join('')}`).join('')}</div>`};
})();
