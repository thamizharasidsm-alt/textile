/* core: namespace, utils, icons */
(function(){
const V = window.V = {BUILD:'20261010c',pages:{},acts:{},rep:[],charts:[],tbl:{},S:{loc:null,theme:null}};
V.page=(name,o)=>{if(o)V.pages[name]=o;return V.pages[name]};
V.$=(s,r=document)=>r.querySelector(s);
V.$$=(s,r=document)=>[...r.querySelectorAll(s)];
V.esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
V.inr=n=>(n<0?'-':'')+'₹'+Math.abs(Math.round(n||0)).toLocaleString('en-IN');
V.num=n=>Math.round(n||0).toLocaleString('en-IN');
V.short=n=>{const a=Math.abs(n||0);return (n<0?'-':'')+'₹'+(a>=1e7?(a/1e7).toFixed(2)+' Cr':a>=1e5?(a/1e5).toFixed(2)+' L':Math.round(a).toLocaleString('en-IN'))};
V.pct=(a,b)=>b?Math.round(a/b*1000)/10:0;
V.sum=(a,f)=>a.reduce((s,x)=>s+(f?f(x):x),0);
V.iso=d=>{const x=new Date(d);return x.getFullYear()+'-'+String(x.getMonth()+1).padStart(2,'0')+'-'+String(x.getDate()).padStart(2,'0')};
V.addDays=(s,n)=>{const d=new Date(s+'T00:00:00');d.setDate(d.getDate()+n);return V.iso(d)};
V.diff=(a,b)=>Math.round((new Date(a+'T00:00:00')-new Date(b+'T00:00:00'))/864e5);
const MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
V.fd=s=>s?`${s.slice(8,10)} ${MON[+s.slice(5,7)-1]} ${s.slice(0,4)}`:'—';
V.fds=s=>s?`${s.slice(8,10)} ${MON[+s.slice(5,7)-1]}`:'—';
V.ml=ym=>MON[+ym.slice(5,7)-1]+" '"+ym.slice(2,4);
V.dow=s=>new Date(s+'T00:00:00').getDay();
V.DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
V.rng=seed=>{let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}};
V.hash=s=>{let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0};
V.uniq=a=>[...new Set(a)];
V.by=(a,k)=>{const m={};a.forEach(x=>m[typeof k==='function'?k(x):x[k]]=x);return m};
V.group=(a,f)=>{const m=new Map();a.forEach(x=>{const k=f(x);if(!m.has(k))m.set(k,[]);m.get(k).push(x)});return m};
V.now=()=>{const d=new Date();return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
V.words=n=>{ // Indian number to words (rupees)
  n=Math.round(n);if(!n)return 'Zero';
  const a=['','One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve','Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen'],b=['','','Twenty','Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety'];
  const t=x=>x<20?a[x]:b[Math.floor(x/10)]+(x%10?' '+a[x%10]:'');
  const h=x=>(x>99?a[Math.floor(x/100)]+' Hundred'+(x%100?' ':''):'')+(x%100?t(x%100):'');
  let s='';const cr=Math.floor(n/1e7);n%=1e7;const l=Math.floor(n/1e5);n%=1e5;const th=Math.floor(n/1e3);n%=1e3;
  if(cr)s+=h(cr)+' Crore ';if(l)s+=h(l)+' Lakh ';if(th)s+=h(th)+' Thousand ';if(n)s+=h(n);return s.trim();
};
// icons (24px stroke set)
const IC={
 home:'M3 11l9-8 9 8M5 10v10h14V10M10 20v-6h4v6',box:'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',users:'M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7M21 20v-1a4 4 0 00-3-3.8M16 4.2a3.5 3.5 0 010 6.6',
 truck:'M2 6h12v10H2zM14 9h4l4 4v3h-8M6 19a2 2 0 100-4 2 2 0 000 4M17 19a2 2 0 100-4 2 2 0 000 4',cart:'M3 4h2l2.4 11h10.2L20 7H6M9 20a1 1 0 100-2 1 1 0 000 2M17 20a1 1 0 100-2 1 1 0 000 2',
 receipt:'M6 3h12v18l-3-2-3 2-3-2-3 2zM9 8h6M9 12h6M9 16h3',store:'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9c0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0M9 20v-6h6v6',
 tag:'M3 12V4h8l10 10-8 8zM7.5 7.5h.01',chart:'M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-8',pie:'M12 3v9h9A9 9 0 1112 3zM15 3.5A9 9 0 0120.5 9H15z',
 cash:'M3 7h18v10H3zM12 14a2 2 0 100-4 2 2 0 000 4M6 10v.01M18 14v.01',wallet:'M4 7h15a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h12M16 14h2',
 return:'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',swap:'M7 4L3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7',shop:'M5 8h14l-1 12H6zM9 8V6a3 3 0 016 0v2',
 sync:'M21 12a9 9 0 01-15.5 6.2M3 12A9 9 0 0118.5 5.8M18.5 2v4h-4M5.5 22v-4h4',file:'M6 3h8l5 5v13H6zM14 3v5h5M9 13h6M9 17h6',upload:'M12 16V4M7 9l5-5 5 5M4 20h16',download:'M12 4v12M7 11l5 5 5-5M4 20h16',
 search:'M11 18a7 7 0 100-14 7 7 0 000 14zM21 21l-5-5',plus:'M12 5v14M5 12h14',check:'M5 13l4 4L19 7',x:'M6 6l12 12M18 6L6 18',menu:'M4 7h16M4 12h16M4 17h16',moon:'M20 14.5A8.5 8.5 0 019.5 4 8.5 8.5 0 1020 14.5z',sun:'M12 16a4 4 0 100-8 4 4 0 000 8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
 pin:'M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5',cal:'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
 bell:'M6 16V11a6 6 0 0112 0v5l2 2H4zM10 21h4',gear:'M12 15a3 3 0 100-6 3 3 0 000 6M19 12a7 7 0 00-.1-1.2l2-1.5-2-3.4-2.3 1a7 7 0 00-2-1.2L14.2 3h-4l-.4 2.7a7 7 0 00-2 1.2l-2.3-1-2 3.4 2 1.5A7 7 0 005 12a7 7 0 00.1 1.2l-2 1.5 2 3.4 2.3-1a7 7 0 002 1.2l.4 2.7h4l.4-2.7a7 7 0 002-1.2l2.3 1 2-3.4-2-1.5c.1-.4.1-.8.1-1.2',
 qr:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h3v3M20 14v.01M14 20h6M17 17v3',print:'M7 9V3h10v6M7 17H4v-6h16v6h-3M7 14h10v7H7z',list:'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
 clock:'M12 21a9 9 0 100-18 9 9 0 000 18M12 7v5l3 2',alert:'M12 3l10 18H2zM12 10v5M12 18v.01',edit:'M4 20h4L19 9l-4-4L4 16zM13.5 6.5l4 4',trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',eye:'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M12 15a3 3 0 100-6 3 3 0 000 6',
 scan:'M4 8V4h4M16 4h4v4M20 16v4h-4M8 20H4v-4M4 12h16',star:'M12 3l2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9z',gift:'M3 9h18v4H3zM5 13v8h14v-8M12 9v12M12 9c-2-4-6-4-5-1 .5 1.5 3 1 5 1zM12 9c2-4 6-4 5-1-.5 1.5-3 1-5 1z',
 loom:'M3 4h18M3 20h18M6 4v16M18 4v16M9 4v16M12 4v16M15 4v16',flag:'M5 21V4M5 4h12l-2 4 2 4H5',book:'M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3zM5 17a3 3 0 013-3h10',link:'M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1',
 inbox:'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5',layers:'M12 3l9 5-9 5-9-5zM3 13l9 5 9-5M3 17l9 5 9-5',target:'M12 21a9 9 0 100-18 9 9 0 000 18M12 16a4 4 0 100-8 4 4 0 000 8M12 12h.01',coins:'M8 13a5 5 0 100-10 5 5 0 000 10M16.5 21a5 5 0 100-10M11 7h2M5.5 9h5',
};
V.ic=(n,c='')=>`<svg class="${c}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${IC[n]||IC.box}"/></svg>`;
})();
