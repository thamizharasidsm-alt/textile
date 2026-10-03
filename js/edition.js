/* Edition switch: 'basic' (first-demo package) or 'premium' (everything). Premium features are hidden, not locked. */
V.EDITION='premium';
V.basic=V.EDITION==='basic';
V.HIDE_ROUTES=V.basic?['vledger','trace','audit','bookings','gst','approvals','imports','auditlog','labels']:[];
// Reports included in the Basic edition (by report number)
V.BASIC_REPORTS=[2,3,9,10,13,14,15,21,27,33,34,36,38,41,46,48,50,52,53,61,66,69,71,73,80,81,85,98,99,107];
V.repAllowed=n=>!V.basic||V.BASIC_REPORTS.includes(n);
// Brand/white-label settings are an internal MS Tech tool: visible in Basic only with ?admin in the URL
V.showBrandAdmin=()=>!V.basic||/[?&]admin\b/.test(location.search);
V.unlink=root=>{if(!V.basic||!root)return;root.querySelectorAll('a[href^="#/trace/"]').forEach(a=>{const s=document.createElement('span');s.innerHTML=a.innerHTML;s.className=a.className;s.removeAttribute&&0;a.replaceWith(s)})};
