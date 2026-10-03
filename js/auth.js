/* Login, roles & menu access, user management (demo-grade authentication, stored in the browser) */
(function(){
const $=V.$;
const SKEY='lk_sess_'+V.EDITION;
V.DEMO_PW='demo123';
// ---- roles --------------------------------------------------------------
V.defaultRoles=()=>({
 'Owner':{menus:'*',disc:100,sys:true,desc:'Full access to every menu'},
 'Store Manager':{menus:['dashboard','items','vendors','customers','locations','exhibitions','po','grn','preturn','localpurchase','vledger','stock','trace','transfer','recon','audit','adjust','labels','pos','invoices','bookings','sreturn','drawer','dayend','petty','shopify','reports','approvals'],disc:12,desc:'Runs the showroom: purchasing, stock, billing, approvals and reports'},
 'Cashier':{menus:['dashboard','customers','stock','pos','invoices','bookings','sreturn','drawer','dayend','petty'],disc:5,desc:'Billing counter: POS, returns, cash drawer, day-end'},
 'Store Keeper':{menus:['dashboard','items','po','grn','preturn','localpurchase','stock','trace','transfer','recon','audit','adjust','labels'],disc:0,desc:'Inward, stock movement and exhibition dispatch'},
 'Accountant':{menus:['dashboard','vendors','po','localpurchase','vledger','invoices','drawer','dayend','petty','shopify','reports','gst','auditlog'],disc:0,desc:'Finance view: payables, GST, Shopify exports and reports'},
 'Exhibition In-charge':{menus:['dashboard','customers','exhibitions','stock','transfer','recon','pos','invoices','sreturn','drawer','dayend','petty'],disc:8,desc:'Runs an exhibition stall: receive stock, bill, reconcile'}
});
V.initRoles=db=>{db.roles=db.roles||V.defaultRoles();db.users.forEach(u=>{if(!u.pw)u.pw=V.DEMO_PW;if(!u.status)u.status='Active'})};
V.me=()=>V.m&&V.m.user?V.m.user[V.S.user]:null;
V.greetName=()=>{const u=V.me();return !u?'there':u.id==='U01'?(V.brand.owner||u.name.split(' ')[0]):u.name.split(' ')[0]};
V.can=route=>{const u=V.me();if(!u||u.status==='Disabled')return false;if(V.HIDE_ROUTES.includes(route))return false;const r=V.db.roles[u.role];if(!r)return false;return r.menus==='*'||r.menus.includes(route)};
V.menuLabel=id=>{for(const g of V.NAVALL)for(const i of g[1])if(i[0]===id)return i[1];return id};
V.deniedPage=name=>({title:'Access restricted',crumb:'Security',render:()=>`<div class="card center" style="max-width:560px;margin:40px auto"><div style="width:84px;margin:auto;color:var(--gold)">${V.ic('shield')}</div><h2>${V.esc(V.menuLabel(name))} is not available for your role</h2><p class="mute">You are signed in as <b>${V.esc(V.me().name)}</b> (${V.esc(V.me().role)}). Ask an Owner to grant this menu under <b>Users & Roles → Roles & menu access</b>.</p><a class="btn primary" href="#/dashboard">Back to dashboard</a></div>`});
// ---- session --------------------------------------------------------------
V.authInit=()=>{let id=null;try{id=localStorage.getItem(SKEY)}catch(e){}const u=id&&V.m.user[id];if(u&&u.status!=='Disabled'){V.S.user=id;return true}V.S.user=null;return false};
const ini=n=>n.split(' ').map(x=>x[0]).slice(0,2).join('').toUpperCase();
V.userMenuHtml=()=>{const u=V.me();if(!u)return '';return `<div class="umw"><button class="avatar" data-act="userMenu" aria-haspopup="menu" aria-label="Account menu for ${V.esc(u.name)}">${ini(u.name)}</button><div id="umenu" class="umenu" role="menu" hidden><div class="umh"><b>${V.esc(u.name)}</b><span class="badge gold">${V.esc(u.role)}</span><div class="xs mute">${V.esc(u.email)}</div></div><button role="menuitem" data-act="userSwitch">${V.ic('users')} Switch user</button><button role="menuitem" data-act="userLogout">${V.ic('return')} Sign out</button></div></div>`};
V.acts.userMenu=()=>{const m=$('#umenu');if(m)m.hidden=!m.hidden};
V.acts.userSwitch=()=>V.logout();
V.acts.userLogout=()=>V.logout();
V.logout=()=>{try{V.db.sessions.push({t:V.db.today+' '+V.now(),user:V.S.user,ev:'Logout',ip:'demo',dev:navigator.userAgent.includes('Mobile')?'Mobile':'Desktop'});V.save()}catch(e){}try{localStorage.removeItem(SKEY)}catch(e){}V.S.user=null;V.showLogin()};
V.login=(u)=>{V.S.user=u.id;try{localStorage.setItem(SKEY,u.id)}catch(e){}V.db.sessions.push({t:V.db.today+' '+V.now(),user:u.id,ev:'Login',ip:'demo',dev:navigator.userAgent.includes('Mobile')?'Mobile':'Desktop'});V.L.audit('Signed in',u.role,u.id);V.save();
 if(!V.can((location.hash.replace(/^#\//,'').split('/')[0])||'dashboard'))location.hash='#/dashboard';V.enter()};
V.showLogin=()=>{document.body.classList.add('locked');let el=document.getElementById('login');if(!el){el=document.createElement('div');el.id='login';document.body.appendChild(el)}
 const users=V.db.users.filter(u=>u.status!=='Disabled');
 el.innerHTML=`<div class="lg-art"><div class="lg-pat"></div><div class="lg-brand">${V.brandMark(56)}<div><b>${V.esc(V.brand.name)}</b><small>${V.esc(V.brand.tag)}</small></div></div><div class="lg-hero"><h1>Every saree, every serial,<br>every rupee — accounted for.</h1><p>Purchase orders to GRN, exhibitions to billing, day-end to Shopify — in one heritage-grade system.</p></div><div class="lg-drape">${V.art.arch()}</div><div class="lg-foot">${V.brand.by?'Powered by '+V.esc(V.brand.by):''}</div></div>
 <div class="lg-form"><form id="lgf" autocomplete="on" novalidate><h2>Sign in</h2><p class="mute sm" style="margin-top:0">${V.esc(V.brand.business)}</p>
 ${V.field('Email / user ID','<input id="lg-u" type="text" autocomplete="username" placeholder="e.g. meenakshi@heritage.in" required>')}
 ${V.field('Password','<div style="position:relative"><input id="lg-p" type="password" autocomplete="current-password" placeholder="Password" required><button type="button" class="iconbtn" id="lg-eye" aria-label="Show password" style="position:absolute;right:4px;top:3px;width:36px;height:36px;border:0">'+V.ic('eye')+'</button></div>')}
 <div class="err" id="lg-e" role="alert" aria-live="assertive"></div>
 <button class="btn primary lg" style="width:100%" type="submit">Sign in</button>
 <div class="divider" style="margin-top:22px"><span class="xs mute">or sign in as a demo user</span></div>
 <div class="lg-users">${users.map(u=>`<button type="button" class="lg-u" data-lgu="${u.id}"><span class="avatar" style="width:36px;height:36px;font-size:12px">${ini(u.name)}</span><span><b>${V.esc(u.name)}</b><small>${V.esc(u.role)}</small></span></button>`).join('')}</div>
 <p class="xs mute center" style="margin-bottom:0">Demo password for every account: <b>${V.DEMO_PW}</b> · Owner manages users & menu access</p></form></div>`;
 const go=u=>V.login(u);
 $('#lgf').onsubmit=e=>{e.preventDefault();const id=$('#lg-u').value.trim().toLowerCase(),pw=$('#lg-p').value;const u=V.db.users.find(x=>x.email.toLowerCase()===id||x.id.toLowerCase()===id||x.name.toLowerCase()===id);
  if(!u||u.pw!==pw){$('#lg-e').textContent='Incorrect user or password. Try a demo account below.';return}if(u.status==='Disabled'){$('#lg-e').textContent='This account is disabled. Contact the Owner.';return}go(u)};
 V.$$('[data-lgu]',el).forEach(b=>b.onclick=()=>go(V.m.user[b.dataset.lgu]));
 $('#lg-eye').onclick=()=>{const p=$('#lg-p');p.type=p.type==='password'?'text':'password'};
 setTimeout(()=>{const u=$('#lg-u');u&&u.focus()},50)};

// ---- Users & Roles page ----------------------------------------------------------------
const groups=()=>V.NAVALL.map(g=>[g[0],g[1].filter(i=>!V.HIDE_ROUTES.includes(i[0]))]).filter(g=>g[1].length);
V.page('users',{title:'Users & Roles',crumb:'Masters',
render(){const d=V.db,t=V.S.utab||'users';
 const tabs=`<div class="tabs" role="tablist"><button class="${t==='users'?'on':''}" data-act="utab" data-t="users" role="tab">Users</button><button class="${t==='roles'?'on':''}" data-act="utab" data-t="roles" role="tab">Roles & menu access</button></div>`;
 let body='';
 if(t==='users')body=V.table('users',{rows:d.users.map(u=>Object.assign({},u,{menus:V.menusOf(u.role).length})),search:true,cols:[{k:'name',l:'Name',f:r=>`<b>${V.esc(r.name)}</b>${r.id===V.S.user?' <span class="badge ok">You</span>':''}`,v:r=>r.name},{k:'email',l:'Login'},{k:'role',l:'Role',fmt:'badge',v:r=>r.role},{k:'menus',l:'Menus',fmt:'num'},{k:'status',l:'Status',f:r=>V.badge(r.status,r.status==='Active'?'ok':'bad'),v:r=>r.status},{k:'a',l:'',nosort:true,f:r=>`<button class="btn sm" data-act="userEdit" data-id="${r.id}">Edit</button> ${r.id!==V.S.user&&r.status==='Active'?`<button class="btn sm primary" data-act="userAs" data-id="${r.id}">Sign in as</button>`:''}`}]});
 else{const rn=V.S.urole&&d.roles[V.S.urole]?V.S.urole:'Owner',r=d.roles[rn],all=r.menus==='*',cnt=x=>d.users.filter(u=>u.role===x).length;
  body=`<div class="g" style="grid-template-columns:260px minmax(0,1fr);gap:18px"><div class="card"><div class="lab" style="margin-bottom:8px">Roles</div>${Object.keys(d.roles).map(x=>`<button class="chip ${x===rn?'on':''}" style="display:flex;justify-content:space-between;width:100%;margin-bottom:6px" data-act="urole" data-r="${V.esc(x)}"><span>${V.esc(x)}</span><span>${cnt(x)}</span></button>`).join('')}<button class="btn sm mt" style="width:100%" data-act="roleNew">${V.ic('plus')} New role</button></div>
  <div class="card"><div class="row between"><div><h3>${V.esc(rn)}</h3><div class="sub">${V.esc(r.desc||'Custom role')}</div></div><div class="row">${r.sys?'':`<button class="btn sm danger" data-act="roleDel" data-r="${V.esc(rn)}">Delete role</button>`}</div></div>
  ${all?`<div class="login-note">Owner always has access to every menu and cannot be restricted.</div>`:`<div class="row" style="margin-bottom:12px"><div class="field" style="margin:0;width:200px"><label>Max discount at POS (%)</label><input type="number" min="0" max="100" id="rdisc" value="${r.disc}"></div><button class="btn sm" data-act="roleAll" data-v="1">Select all</button><button class="btn sm" data-act="roleAll" data-v="0">Clear</button></div>
  ${groups().map(g=>`<div style="margin-bottom:14px"><div class="lab" style="margin-bottom:6px">${g[0]}</div><div class="chips">${g[1].map(i=>`<label class="chip ${r.menus.includes(i[0])?'on':''}" style="display:inline-flex;gap:8px;align-items:center;cursor:${i[0]==='dashboard'?'default':'pointer'}"><input type="checkbox" data-menu="${i[0]}" ${r.menus.includes(i[0])||i[0]==='dashboard'?'checked':''} ${i[0]==='dashboard'?'disabled':''} style="accent-color:var(--primary)"> ${i[1]}</label>`).join('')}</div></div>`).join('')}
  <button class="btn primary" data-act="roleSave" data-r="${V.esc(rn)}">${V.ic('check')} Save access</button>`}
  <h4 style="margin:20px 0 8px">Menu preview — what ${V.esc(rn)} sees</h4><div class="chips">${V.menusOf(rn).map(m=>`<span class="badge">${V.esc(V.menuLabel(m))}</span>`).join('')}</div></div></div>`}
 return V.head('Users & Roles','Sign in as different roles to show exactly which menus each person can reach. Add users, create roles, and assign any menu.',t==='users'?`<button class="btn primary" data-act="userNew">${V.ic('plus')} Add user</button>`:'')+tabs+body}});
V.menusOf=rn=>{const r=V.db.roles[rn];const all=V.NAVALL.flatMap(g=>g[1].map(i=>i[0])).filter(x=>!V.HIDE_ROUTES.includes(x));return r?(r.menus==='*'?all:all.filter(x=>x==='dashboard'||r.menus.includes(x))):[]};
V.acts.utab=el=>{V.S.utab=el.dataset.t;V.refresh()};
V.acts.urole=el=>{V.S.urole=el.dataset.r;V.refresh()};
V.acts.roleAll=el=>{V.$$('[data-menu]:not([disabled])').forEach(c=>c.checked=el.dataset.v==='1');V.$$('label.chip:has([data-menu])').forEach(l=>l.classList.toggle('on',el.dataset.v==='1'))};
document.addEventListener('change',e=>{if(e.target.dataset&&e.target.dataset.menu){const l=e.target.closest('label');l&&l.classList.toggle('on',e.target.checked)}});
V.acts.roleSave=el=>{const rn=el.dataset.r,r=V.db.roles[rn];r.menus=V.$$('[data-menu]').filter(c=>c.checked).map(c=>c.dataset.menu);if(!r.menus.includes('dashboard'))r.menus.push('dashboard');const dc=V.$('#rdisc');if(dc){r.disc=+dc.value||0;V.db.users.filter(u=>u.role===rn).forEach(u=>u.disc=r.disc)}V.L.audit('Role access updated',rn);V.save();V.toast('Access updated for '+rn);V.refresh()};
V.acts.roleNew=()=>V.modal({title:'New role',body:`<div class="frm">${V.field('Role name *','<input id="rn-n" placeholder="e.g. Showroom Supervisor">')}${V.field('Copy menus from',`<select id="rn-c"><option value="">Dashboard only</option>${V.opts(Object.keys(V.db.roles),'Cashier')}</select>`)}</div>`,foot:[{l:'Cancel'},{l:'Create role',cls:'primary',fn:()=>{const n=$('#rn-n').value.trim();if(!n||V.db.roles[n]){V.toast(n?'Role already exists':'Enter a role name','bad');return false}const c=$('#rn-c').value,src=c&&V.db.roles[c];V.db.roles[n]={menus:src?(src.menus==='*'?V.NAVALL.flatMap(g=>g[1].map(i=>i[0])):src.menus.slice()):['dashboard'],disc:src?src.disc:0,desc:'Custom role'};V.S.urole=n;V.save();V.refresh()}}]});
V.acts.roleDel=async el=>{const rn=el.dataset.r;if(V.db.users.some(u=>u.role===rn)){V.toast('Move its users to another role first','bad');return}if(await V.confirm('Delete role <b>'+V.esc(rn)+'</b>?','Delete',true)){delete V.db.roles[rn];V.S.urole='Owner';V.save();V.refresh()}};
const userForm=u=>`<div class="frm">${V.field('Full name *',`<input id="uf-n" value="${V.esc(u.name||'')}">`)}${V.field('Login email *',`<input id="uf-e" type="email" value="${V.esc(u.email||'')}">`)}${V.field('Role',`<select id="uf-r">${V.opts(Object.keys(V.db.roles),u.role||'Cashier')}</select>`)}${V.field(u.id?'New password (blank = keep)':'Password',`<input id="uf-p" type="text" value="${u.id?'':V.DEMO_PW}">`)}${u.id?V.field('Status',`<select id="uf-s"><option ${u.status==='Active'?'selected':''}>Active</option><option ${u.status==='Disabled'?'selected':''}>Disabled</option></select>`):''}</div>`;
V.acts.userNew=()=>V.modal({title:'Add user',wide:true,body:userForm({}),foot:[{l:'Cancel'},{l:'Create user',cls:'primary',fn:()=>{const n=$('#uf-n').value.trim(),e=$('#uf-e').value.trim();if(!n||!e){V.toast('Name and email are required','bad');return false}if(V.db.users.some(u=>u.email.toLowerCase()===e.toLowerCase())){V.toast('That email is already a user','bad');return false}const role=$('#uf-r').value;V.db.users.push({id:'U'+String(V.db.users.length+1).padStart(2,'0'),name:n,role,disc:V.db.roles[role].disc,email:e,pw:$('#uf-p').value||V.DEMO_PW,status:'Active'});V.L.idx();V.L.audit('User created',n);V.save();V.toast('User added');V.refresh()}}]});
V.acts.userEdit=el=>{const u=V.m.user[el.dataset.id];V.modal({title:'Edit user',wide:true,body:userForm(u),foot:[{l:'Cancel'},{l:'Save',cls:'primary',fn:()=>{const role=$('#uf-r').value,st=$('#uf-s').value;if(u.id===V.S.user&&(st==='Disabled'||(u.role==='Owner'&&role!=='Owner'))){V.toast('You cannot disable or demote your own account','bad');return false}u.name=$('#uf-n').value.trim()||u.name;u.email=$('#uf-e').value.trim()||u.email;u.role=role;u.disc=V.db.roles[role].disc;u.status=st;const p=$('#uf-p').value;if(p)u.pw=p;V.L.audit('User updated',u.name);V.save();V.toast('User saved');V.refresh()}}]})};
V.acts.userAs=el=>{const u=V.m.user[el.dataset.id];V.L.audit('Switched user',u.name);V.save();V.login(u)};
})();
