/* Optional product photos — enabled from Settings; falls back to the generated saree swatch */
(function(){
V.imgOn=()=>!!(V.db&&V.db.settings&&V.db.settings.images);
V.imgTag=(it,w,h)=>`<img class="sw" src="${it.img}" alt="${V.esc(it.cn||it.name||'Saree')}" loading="lazy" style="aspect-ratio:${w}/${h};object-fit:cover">`;
// Photos disabled => no item imagery anywhere. Enabled => photo, or the generated swatch as placeholder.
V.sw=(it,w,h)=>!V.imgOn()?'':it.img?V.imgTag(it,w,h):V.art.swatch(it,w,h);
V.swp=(p,w,h)=>{const it=V.m.item[p.sku];return V.sw(Object.assign({cn:it.name},it),w,h)};
V.imgResize=(file,max=520)=>new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{const s=Math.min(1,max/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.82))};im.src=r.result};r.readAsDataURL(file)});
const count=()=>V.db.items.filter(i=>i.img).length;
// controls inside the item popup
V.imgCtl=it=>V.imgOn()?`<div class="row" style="margin:12px 0 4px"><label class="btn sm" style="cursor:pointer">${V.ic('upload')} ${it.img?'Change photo':'Add photo'}<input type="file" accept="image/*" hidden data-itemimg="${it.sku}"></label>${it.img?`<button class="btn sm danger" data-act="itemImgRm" data-sku="${it.sku}">Remove photo</button>`:''}</div>`:'';
document.addEventListener('change',async e=>{const t=e.target;
 if(t.dataset&&t.dataset.itemimg&&t.files[0]){try{V.m.item[t.dataset.itemimg].img=await V.imgResize(t.files[0]);V.save();V.toast('Photo saved');V.closeModal();V.acts.itemView(t.dataset.itemimg);if(V.pages.items)V.refresh&&V.refresh()}catch(x){V.toast('Could not read image','bad')}}
 if(t.id==='imgBulk'&&t.files.length){let n=0,miss=[];for(const f of t.files){const sku=f.name.replace(/\.[^.]+$/,'').toUpperCase(),it=V.m.item[sku];if(!it){miss.push(f.name);continue}try{it.img=await V.imgResize(f);n++}catch(x){miss.push(f.name)}}V.save();V.toast(n+' photo(s) attached'+(miss.length?` · ${miss.length} not matched (name the file like KJV-01.jpg)`:''),miss.length&&!n?'bad':'ok');V.refresh()}});
V.acts.itemImgRm=el=>{delete V.m.item[el.dataset.sku].img;V.save();V.closeModal();V.refresh();V.toast('Photo removed')};
V.acts.imgToggle=el=>{V.db.settings.images=!V.db.settings.images;V.save();V.toast(V.db.settings.images?'Product photos enabled — shown on billing, stock and item screens':'Product photos disabled');V.refresh()};
V.acts.imgClear=async()=>{if(await V.confirm('Remove all uploaded product photos?','Remove',true)){V.db.items.forEach(i=>delete i.img);V.save();V.refresh()}};
V.imgCard=()=>{const on=V.imgOn();return V.card('Product photos','Show a real photo for each design instead of the generated swatch',`<div class="row between"><div><b>Enable product photos</b><div class="sm mute">When on: Item Master gets an <b>Add photo</b> option and photos appear on the POS billing screen and cart, stock lists and item details. Designs without a photo keep the swatch.</div></div><button class="btn ${on?'primary':''}" role="switch" aria-checked="${on}" data-act="imgToggle">${on?'● Enabled':'○ Disabled'}</button></div>
 ${on?`<div class="row mt"><label class="btn" style="cursor:pointer">${V.ic('upload')} Bulk upload photos<input type="file" id="imgBulk" accept="image/*" multiple hidden></label><span class="sm mute">Name each file after the design SKU, e.g. <b>KJV-01.jpg</b>. ${count()} of ${V.db.items.length} designs have a photo.</span>${count()?`<button class="btn sm danger" data-act="imgClear">Remove all</button>`:''}</div>`:''}`,'mt')};
// append to Settings page
const pg=V.pages.settings;if(pg){const r0=pg.render;pg.render=(...a)=>r0.apply(pg,a)+V.imgCard()}
})();
