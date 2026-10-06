/* Artwork: textile patterns, saree swatches, illustrations, barcode/QR */
(function(){
const A=V.art={};
const enc=s=>'url("data:image/svg+xml,'+encodeURIComponent(s)+'")';
let GOLD='#E3C57A';
// Pattern tiles exposed as CSS variables
A.initPatterns=function(){
  const r=document.documentElement.style;
  r.setProperty('--pat-temple',enc(`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="14" viewBox="0 0 28 14"><path d="M0 14L7 1l7 13M14 14L21 1l7 13" fill="none" stroke="${GOLD}" stroke-width="1.2"/><path d="M7 14L7 8M21 14L21 8" stroke="${GOLD}" stroke-width="1"/><circle cx="7" cy="5" r="1.2" fill="${GOLD}"/><circle cx="21" cy="5" r="1.2" fill="${GOLD}"/></svg>`));
  r.setProperty('--pat-diamond',enc(`<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><path d="M18 2l16 16-16 16L2 18z M18 10l8 8-8 8-8-8z" fill="none" stroke="${GOLD}" stroke-width="1"/><circle cx="18" cy="18" r="2" fill="${GOLD}"/></svg>`));
  r.setProperty('--pat-paisley',enc(`<svg xmlns="http://www.w3.org/2000/svg" width="90" height="90" viewBox="0 0 90 90"><g fill="none" stroke="${GOLD}" stroke-width="1.3" stroke-linecap="round"><path d="M30 8c14 6 20 22 12 36-5 9-18 12-26 6-7-6-4-17 5-19 7-1 11 4 8 9-2 3-7 3-8-1"/><path d="M62 48c10 4 14 15 8 25-4 6-13 8-19 4-5-4-3-12 3-13 5-1 8 3 6 6"/><circle cx="72" cy="20" r="3"/><circle cx="14" cy="76" r="3"/></g></svg>`));
};
// ---- Saree swatch ------------------------------------------------------
A.swatch=function(it,w=120,h=144){
  const body=it.body||'#7A1F3D',bd=it.bord||'#E3C57A',pat=it.pat||'butta';
  const g=(c,o=1)=>`fill="${c}" fill-opacity="${o}"`;let s='';
  const bh=h*.13,ph=h*.3;
  s+=`<rect width="${w}" height="${h}" fill="${body}"/>`;
  // body motifs
  const rows=pat==='stripe'?0:5,cols=4,top=bh+8,bot=h-ph-8;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const x=(c+.5+(r%2?.5:0))*w/cols,y=top+(r+.5)*(bot-top)/rows;if(x>w-4)continue;
    if(pat==='butta'||pat==='temple')s+=`<path d="M${x} ${y-5}l4 5-4 5-4-5z" ${g(bd,.85)}/>`;
    else if(pat==='geo')s+=`<path d="M${x-5} ${y}l5-5 5 5-5 5z" fill="none" stroke="${bd}" stroke-width="1.2"/><circle cx="${x}" cy="${y}" r="1.4" ${g(bd)}/>`;
    else if(pat==='ikat')s+=`<path d="M${x-6} ${y}l3-4 3 4 3-4 3 4" fill="none" stroke="${bd}" stroke-width="1.4"/>`;
    else if(pat==='floral'||pat==='peacock')s+=`<circle cx="${x}" cy="${y}" r="2.4" ${g(bd,.9)}/><circle cx="${x-3.5}" cy="${y}" r="1.4" ${g('#fff',.7)}/><circle cx="${x+3.5}" cy="${y}" r="1.4" ${g('#fff',.7)}/><circle cx="${x}" cy="${y-3.5}" r="1.4" ${g('#fff',.7)}/><circle cx="${x}" cy="${y+3.5}" r="1.4" ${g('#fff',.7)}/>`;
    else if(pat==='check')s+=`<rect x="${x-4}" y="${y-4}" width="8" height="8" fill="none" stroke="${bd}" stroke-opacity=".8"/>`;
  }
  if(pat==='stripe'){for(let i=1;i<8;i++)s+=`<rect x="${i*w/8-1}" y="${bh}" width="${i%2?2:1}" height="${h-bh-ph}" ${g(bd,.55)}/>`}
  // top & bottom borders
  s+=`<rect y="0" width="${w}" height="${bh}" fill="${bd}"/><rect y="${bh*.25}" width="${w}" height="${bh*.5}" ${g(body,.9)}/>`;
  if(pat==='temple'||pat==='peacock'){let t='';for(let x=0;x<w;x+=10)t+=`<path d="M${x} ${bh*.75}l5-${bh*.5} 5 ${bh*.5}z" ${g(bd)}/>`;s+=t}
  // pallu
  s+=`<rect y="${h-ph}" width="${w}" height="${ph}" ${g(bd,.18)}/><rect y="${h-ph}" width="${w}" height="3" fill="${bd}"/><rect y="${h-ph+6}" width="${w}" height="1.5" fill="${bd}" fill-opacity=".8"/>`;
  for(let c=0;c<6;c++){const x=(c+.5)*w/6;s+=`<path d="M${x} ${h-ph+14}c8 4 9 14 3 20-5 5-12 3-12-3 0-4 4-6 7-4" fill="none" stroke="${bd}" stroke-width="1.3"/><circle cx="${x}" cy="${h-ph+20}" r="1.6" ${g(bd)}/>`}
  s+=`<rect y="${h-bh}" width="${w}" height="${bh}" fill="${bd}"/><rect y="${h-bh*.75}" width="${w}" height="${bh*.5}" ${g(body,.9)}/>`;
  s+=`<rect width="${w}" height="${h}" fill="url(#shine)" opacity=".22"/>`;
  return `<svg class="sw" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${V.esc(it.cn||'Saree')} saree swatch"><defs><linearGradient id="shine" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000"/></linearGradient></defs>${s}</svg>`;
};
// ---- illustrations -----------------------------------------------------
A.stack=function(cols=['#7A1F3D','#1E2A5E','#0F6B5B','#B5471F'],w=260,h=170){
  let s='';cols.forEach((c,i)=>{const y=h-34-i*30;s+=`<g transform="translate(${i%2?8:-4} 0)"><rect x="30" y="${y}" width="${w-60}" height="28" rx="6" fill="${c}"/><rect x="30" y="${y+3}" width="${w-60}" height="3" fill="${GOLD}"/><rect x="30" y="${y+22}" width="${w-60}" height="3" fill="${GOLD}"/><path d="M${w-64} ${y}q18 14 0 28" fill="none" stroke="${GOLD}" stroke-width="1.5"/><rect x="${w-90}" y="${y+10}" width="40" height="3" fill="${GOLD}" opacity=".7"/></g>`});
  return `<svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${s}<rect x="20" y="${h-6}" width="${w-40}" height="6" rx="3" fill="#000" opacity=".15"/></svg>`;
};
A.loom=function(){
  let wp='';for(let i=0;i<22;i++)wp+=`<line x1="${70+i*8}" y1="40" x2="${70+i*8}" y2="210" stroke="${GOLD}" stroke-opacity="${i%3?.45:.9}" stroke-width="1"/>`;
  return `<svg viewBox="0 0 320 240" aria-hidden="true"><g fill="none" stroke="${GOLD}" stroke-width="3" stroke-linecap="round">
  <rect x="50" y="24" width="220" height="196" rx="4" stroke-opacity=".9"/><line x1="50" y1="60" x2="270" y2="60"/><line x1="50" y1="190" x2="270" y2="190"/></g>${wp}
  <rect x="70" y="150" width="176" height="32" fill="#7A1F3D" opacity=".9"/><rect x="70" y="150" width="176" height="3" fill="${GOLD}"/><rect x="70" y="179" width="176" height="3" fill="${GOLD}"/>
  <g stroke="#fff" stroke-opacity=".5" stroke-width="1"><line x1="72" y1="158" x2="244" y2="158"/><line x1="72" y1="166" x2="244" y2="166"/><line x1="72" y1="174" x2="244" y2="174"/></g>
  <g><rect x="120" y="108" width="60" height="9" rx="4.5" fill="${GOLD}"/><path d="M180 112h10" stroke="${GOLD}" stroke-width="2"/><animateTransform attributeName="transform" type="translate" values="0 0;40 0;0 0" dur="3.2s" repeatCount="indefinite"/></g>
  <circle cx="290" cy="60" r="16" fill="none" stroke="${GOLD}" stroke-width="3"/><circle cx="290" cy="60" r="4" fill="${GOLD}"/></svg>`;
};
A.arch=function(){ // jharokha arch with three hanging sarees on a display rod
  const panels=[[96,'#B0245F','#7A1F3D',210],[188,'#0F6B5B','#0B4A3F',232],[280,'#2B2F77','#1E2A5E',200]];let p='';
  panels.forEach(([x,c1,c2,H],i)=>{const w=76,id='g'+i;
    p+=`<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>`;
    p+=`<path d="M${x} 44 L${x+w} 44 L${x+w} ${H} Q${x+w*.75} ${H+12} ${x+w/2} ${H} Q${x+w*.25} ${H-12} ${x} ${H}Z" fill="url(#${id})"/>`;
    p+=`<rect x="${x}" y="44" width="5" height="${H-44}" fill="${GOLD}"/><rect x="${x+w-5}" y="44" width="5" height="${H-44}" fill="${GOLD}"/>`;
    for(let r=0;r<4;r++)for(let k=0;k<3;k++)p+=`<path d="M${x+18+k*20+(r%2?10:0)} ${70+r*22}l4 5-4 5-4-5z" fill="${GOLD}" opacity=".85"/>`;
    const py=H-58;p+=`<rect x="${x}" y="${py}" width="${w}" height="4" fill="${GOLD}"/><rect x="${x}" y="${py+8}" width="${w}" height="2" fill="${GOLD}" opacity=".8"/>`;
    for(let k=0;k<5;k++)p+=`<path d="M${x+k*15+3} ${py+30}l7-16 7 16z" fill="${GOLD}" opacity=".9"/>`;
    p+=`<rect x="${x}" y="${H-10}" width="${w}" height="3" fill="${GOLD}"/>`;
    p+=`<circle cx="${x+w/2}" cy="40" r="4" fill="none" stroke="${GOLD}" stroke-width="2"/>`});
  return `<svg viewBox="0 0 400 260" preserveAspectRatio="xMaxYMax meet" aria-hidden="true">
  <path d="M60 260V120C60 56 120 18 200 2c80 16 140 54 140 118v140" fill="none" stroke="${GOLD}" stroke-width="3"/>
  <path d="M74 260V124C74 66 128 32 200 18c72 14 126 48 126 106v136" fill="none" stroke="${GOLD}" stroke-opacity=".5" stroke-width="1.5" stroke-dasharray="3 5"/>
  <line x1="78" y1="40" x2="322" y2="40" stroke="${GOLD}" stroke-width="5" stroke-linecap="round"/><circle cx="78" cy="40" r="7" fill="${GOLD}"/><circle cx="322" cy="40" r="7" fill="${GOLD}"/>
  ${p}<g transform="translate(200 256)" fill="${GOLD}" fill-opacity=".9"><path d="M0 0c-14-6-18-22-8-30 4 8 8 8 8 30zM0 0c14-6 18-22 8-30-4 8-8 8-8 30zM0 0c-4-14-2-26 0-34 2 8 4 20 0 34z"/></g></svg>`};
A.lotus=function(sz=22,c='currentColor'){return `<svg width="${sz}" height="${sz}" viewBox="-14 -20 28 24" aria-hidden="true"><g fill="none" stroke="${c}" stroke-width="1.4"><path d="M0 0C-9-3-11-14 0-18 11-14 9-3 0 0z"/><path d="M0 0C-12 0-16-10-10-15-6-9-3-5 0 0z"/><path d="M0 0c12 0 16-10 10-15-4 6-7 10-10 15z"/></g></svg>`};
A.empty=function(){return `<svg viewBox="0 0 160 110" aria-hidden="true"><g>${A.stack(['#C9A24B','#7A1F3D','#1E2A5E'],160,110).replace(/<\/?svg[^>]*>/g,'')}</g></svg>`};
// pseudo barcode / QR (visual only for demo labels)
A.barcode=function(code,w=140,h=34){
  let x=0,s='',hsh=V.hash(code);const r=V.rng(hsh);
  while(x<w){const bw=1+Math.floor(r()*3);if(r()>.42)s+=`<rect x="${x}" y="0" width="${bw}" height="${h}"/>`;x+=bw+1}
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="#111" aria-label="Barcode ${V.esc(code)}">${s}</svg>`;
};
A.qr=function(code,n,px){px=px||3;
  if(window.qrcode){try{const q=qrcode(0,'M');q.addData(String(code));q.make();const m=q.getModuleCount(),pad=2;let d='';for(let r=0;r<m;r++)for(let c=0;c<m;c++)if(q.isDark(r,c))d+=`M${c+pad} ${r+pad}h1v1h-1z`;const sz=(m+pad*2),W=sz*px;
    return `<svg width="${W}" height="${W}" viewBox="0 0 ${sz} ${sz}" shape-rendering="crispEdges" role="img" aria-label="QR ${V.esc(code)}"><rect width="${sz}" height="${sz}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`}catch(e){}}
  const r=V.rng(V.hash(code));let s='';n=n||21;const fin=(x,y)=>`<rect x="${x*px}" y="${y*px}" width="${7*px}" height="${7*px}"/><rect x="${(x+1)*px}" y="${(y+1)*px}" width="${5*px}" height="${5*px}" fill="#fff"/><rect x="${(x+2)*px}" y="${(y+2)*px}" width="${3*px}" height="${3*px}"/>`;
  for(let y=0;y<n;y++)for(let x=0;x<n;x++){if((x<8&&y<8)||(x>n-9&&y<8)||(x<8&&y>n-9))continue;if(r()>.52)s+=`<rect x="${x*px}" y="${y*px}" width="${px}" height="${px}"/>`}
  return `<svg width="${n*px}" height="${n*px}" viewBox="0 0 ${n*px} ${n*px}" fill="#111" aria-label="QR ${V.esc(code)}">${s}${fin(0,0)}${fin(n-7,0)}${fin(0,n-7)}</svg>`};
A.setGold=c=>{GOLD=c;A.initPatterns()};
A.initPatterns();
})();
