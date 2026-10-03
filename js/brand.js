/* White-label branding: name, tagline, logo, colours — persisted separately from demo data */
(function(){
const KEY='lk_brand'+(V.basic?'_basic':'');
const DEF={name:'LoomLedger',tag:'Heritage Retail Suite',by:'MS Tech Services',business:'Meenakshi Heritage Handlooms',owner:'Meenakshi',mono:'LL',primary:'#7A1F3D',accent:'#B8893A',logo:''};
V.BRAND_DEF=DEF;
V.brand=Object.assign({},DEF);
try{const s=localStorage.getItem(KEY);if(s)Object.assign(V.brand,JSON.parse(s))}catch(e){}
const hex=h=>{h=h.replace('#','');if(h.length===3)h=h.split('').map(c=>c+c).join('');return [0,2,4].map(i=>parseInt(h.slice(i,i+2),16))};
const mix=(h,t,w=255)=>'#'+hex(h).map(v=>Math.round(v+(w-v)*t).toString(16).padStart(2,'0')).join('');
V.slug=()=>(V.brand.name||'app').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'app';
V.mono=b=>((b||V.brand).mono||(b||V.brand).name.slice(0,2)).slice(0,3).toUpperCase();
V.brandMark=(sz=42,b)=>{b=b||V.brand;return b.logo?`<img src="${b.logo}" alt="${V.esc?V.esc(b.name):''} logo" style="width:${sz}px;height:${sz}px;object-fit:contain;border-radius:${Math.round(sz*.26)}px;background:#fff;padding:3px">`
 :`<span style="width:${sz}px;height:${sz}px;border-radius:${Math.round(sz*.28)}px;background:linear-gradient(135deg,${mix(b.accent,.5)},${b.accent});display:inline-grid;place-items:center;color:#2a1608;font:700 ${Math.round(sz*.4)}px 'Cormorant Garamond',Georgia,serif;letter-spacing:.5px">${V.mono(b)}</span>`};
V.applyBrand=()=>{const b=V.brand,r=document.documentElement.style;r.setProperty('--brand',b.primary);r.setProperty('--accent',b.accent);
 document.title=b.name+' — '+b.tag;
 let ic=document.querySelector('link[rel=icon]');if(!ic){ic=document.createElement('link');ic.rel='icon';document.head.appendChild(ic)}
 ic.href=b.logo||('data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="${b.primary}"/><text x="16" y="21.500" text-anchor="middle" font-family="Georgia,serif" font-weight="700" font-size="14" fill="${mix(b.accent,.5)}">${V.mono(b)}</text></svg>`));
 const m=document.querySelector('meta[name=description]');if(m)m.content=b.name+' — inventory, POS billing, exhibitions and Shopify sync for premium handloom retailers.'};
V.applyBrand();
V.brandSave=()=>{try{localStorage.setItem(KEY,JSON.stringify(V.brand));return true}catch(e){V.toast('Logo too large to store — use a smaller image','bad');return false}};

const PRESETS=[['Heritage Maroon','#7A1F3D','#B8893A'],['Royal Indigo','#26357F','#C9A24B'],['Emerald Silk','#0F5C4D','#D4A63A'],['Peacock Teal','#0F6B6B','#E0A526'],['Charcoal & Rose Gold','#2F2A33','#C98F7A'],['Saffron & Plum','#5B1F5E','#E08A1E']];
const prev=d=>`<div style="border-radius:16px;overflow:hidden;border:1px solid var(--line)"><div style="padding:18px;background:linear-gradient(185deg,${mix(d.primary,.0,0)} 0%,#27163F 100%);background:linear-gradient(185deg,${mix(d.primary,.55,0)},#27163F 70%,#171A44);color:#fff"><div style="display:flex;gap:12px;align-items:center">${V.brandMark(44,d)}<div><b style="font:700 24px 'Cormorant Garamond',Georgia,serif;display:block;line-height:1">${V.esc(d.name||'App name')}</b><small style="letter-spacing:2px;text-transform:uppercase;font-size:10px;color:${mix(d.accent,.45)}">${V.esc(d.tag||'')}</small></div></div></div>
 <div style="padding:16px;background:var(--surface)"><div style="background:linear-gradient(120deg,${mix(d.primary,.5,0)},${d.primary});color:#fff;border-radius:12px;padding:14px"><div style="font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:${mix(d.accent,.45)}">${V.esc(d.business||'')}</div><div style="font:700 22px 'Cormorant Garamond',Georgia,serif">Namaste.</div></div>
 <div class="row" style="margin-top:12px"><span style="background:${d.primary};color:#fff;padding:8px 14px;border-radius:10px;font-weight:600;font-size:13px">Primary button</span><span style="background:linear-gradient(135deg,${mix(d.accent,.5)},${d.accent});color:#2a1608;padding:8px 14px;border-radius:10px;font-weight:600;font-size:13px">Accent</span></div>
 <div class="xs mute" style="margin-top:10px">${d.by?'Powered by '+V.esc(d.by):''}</div></div></div>`;
V.clientCard=()=>{const d=V.S.bd=V.S.bd||Object.assign({},V.brand);return V.card('Client details','Shown on the dashboard banner, invoices and reports',`<div class="frm">${V.field('Client business name',`<input data-bd="business" value="${V.esc(d.business)}">`)}${V.field('Owner first name',`<input data-bd="owner" value="${V.esc(d.owner||'')}">`,'Used in the dashboard greeting')}</div><button class="btn primary" data-act="brandSave">${V.ic('check')} Save</button>`)};
V.brandCard=()=>{const d=V.S.bd=V.S.bd||Object.assign({},V.brand);
 return V.card('White-label branding','Rename the product, set your client\'s business name, upload a logo and pick brand colours — applied everywhere: sidebar, tab title, invoices, exports.',
 `<div class="g g2"><div><div class="frm">${V.field('Application name',`<input data-bd="name" value="${V.esc(d.name)}" maxlength="28">`)}${V.field('Tagline',`<input data-bd="tag" value="${V.esc(d.tag)}" maxlength="34">`)}${V.field('Client business name (invoices, headers)',`<input data-bd="business" value="${V.esc(d.business)}">`,'','full')}${V.field('Owner first name (dashboard greeting)',`<input data-bd="owner" value="${V.esc(d.owner||'')}">`)}${V.field('"Powered by" line',`<input data-bd="by" value="${V.esc(d.by)}">`,'Leave blank to hide')}${V.field('Monogram (2–3 letters)',`<input data-bd="mono" value="${V.esc(d.mono)}" maxlength="3">`,'Shown when no logo is uploaded')}
 ${V.field('Primary colour',`<input type="color" data-bd="primary" value="${d.primary}" style="padding:4px;height:44px">`)}${V.field('Accent colour',`<input type="color" data-bd="accent" value="${d.accent}" style="padding:4px;height:44px">`)}
 ${V.field('Logo',`<input type="file" id="blogo" accept="image/png,image/jpeg,image/svg+xml,image/webp">`,'PNG / SVG / JPG — auto-resized, stored in this browser','full')}</div>
 <div class="lab" style="margin-bottom:6px">Colour presets</div><div class="chips">${PRESETS.map((p,i)=>`<button class="chip" data-act="brandPreset" data-i="${i}"><span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${p[1]};margin-right:6px;vertical-align:-1px"></span>${p[0]}</button>`).join('')}</div>
 <div class="row mt"><button class="btn primary" data-act="brandSave">${V.ic('check')} Save & apply</button><button class="btn" data-act="brandLogoClear">Remove logo</button><button class="btn" data-act="brandReset">Reset to default</button><button class="btn" data-act="brandExport">${V.ic('download')} Export brand</button><label class="btn" style="cursor:pointer">${V.ic('upload')} Import brand<input type="file" id="bimp" accept=".json" hidden></label></div></div>
 <div><div class="lab" style="margin-bottom:6px">Live preview</div><div id="bprev">${prev(d)}</div></div></div>`)};
const redraw=()=>{const e=V.$('#bprev');if(e)e.innerHTML=prev(V.S.bd)};
document.addEventListener('input',e=>{const k=e.target.dataset&&e.target.dataset.bd;if(!k)return;V.S.bd[k]=e.target.value;redraw()});
document.addEventListener('change',e=>{
 if(e.target.id==='blogo'&&e.target.files[0]){const f=e.target.files[0];const r=new FileReader();r.onload=()=>{if(f.type==='image/svg+xml'){V.S.bd.logo=r.result;redraw();return}const im=new Image();im.onload=()=>{const s=Math.min(1,256/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);V.S.bd.logo=c.toDataURL('image/png');redraw()};im.src=r.result};r.readAsDataURL(f)}
 if(e.target.id==='bimp'&&e.target.files[0]){const r=new FileReader();r.onload=()=>{try{V.S.bd=Object.assign({},DEF,JSON.parse(r.result));V.refresh();V.toast('Brand imported — review and Save')}catch(x){V.toast('Invalid brand file','bad')}};r.readAsText(e.target.files[0])}});
V.acts.brandPreset=el=>{const p=PRESETS[+el.dataset.i];V.S.bd.primary=p[1];V.S.bd.accent=p[2];V.refresh()};
V.acts.brandLogoClear=()=>{V.S.bd.logo='';V.refresh()};
V.acts.brandSave=()=>{const d=V.S.bd;if(!d.name.trim()){V.toast('Application name is required','bad');return}Object.assign(V.brand,d,{name:d.name.trim()});if(!V.brandSave())return;V.S.bd=null;V.toast('Branding saved — reloading…');setTimeout(()=>location.reload(),500)};
V.acts.brandReset=async()=>{if(await V.confirm('Reset name, logo and colours to the product defaults?','Reset')){try{localStorage.removeItem(KEY)}catch(e){}location.reload()}};
V.acts.brandExport=()=>V.dl(V.slug()+'_brand.json',JSON.stringify(V.S.bd||V.brand,null,1),'application/json');
})();
