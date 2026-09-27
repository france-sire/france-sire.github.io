document.addEventListener('DOMContentLoaded',()=>{
  const nav=document.querySelector('[data-nav]');
  const menu=document.querySelector('[data-nav-toggle]');
  menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'Close':'Menu'});
  nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const theme=document.querySelector('[data-theme-toggle]');
  const themeKey='france-sire-theme';
  if(localStorage.getItem(themeKey)==='dark')document.body.classList.add('theme-dark');
  theme?.addEventListener('click',()=>{document.body.classList.toggle('theme-dark');localStorage.setItem(themeKey,document.body.classList.contains('theme-dark')?'dark':'light')});

  const toast=document.querySelector('[data-toast]'); let toastTimer;
  const notify=msg=>{if(!toast)return;toast.textContent=msg;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2200)};

  const savedKey='france-sire-saved-shows';
  let saved=[]; try{saved=JSON.parse(localStorage.getItem(savedKey)||'[]')}catch{}
  document.querySelectorAll('[data-save-show]').forEach(btn=>{
    const name=btn.dataset.name;
    if(saved.includes(name))btn.textContent='Saved';
    btn.addEventListener('click',()=>{saved=saved.includes(name)?saved.filter(x=>x!==name):[...saved,name];localStorage.setItem(savedKey,JSON.stringify(saved));btn.textContent=saved.includes(name)?'Saved':'Save show';notify(saved.includes(name)?'Show saved locally':'Removed from saved shows')});
  });

  const search=document.querySelector('[data-show-search]');
  const filterButtons=[...document.querySelectorAll('[data-show-filter]')];
  const cards=[...document.querySelectorAll('[data-show-card]')];
  let active='all';
  function applyShows(){const q=(search?.value||'').trim().toLowerCase();cards.forEach(c=>{const type=c.dataset.type;const hay=(c.dataset.search||'').toLowerCase();c.hidden=!((active==='all'||type===active)&&(!q||hay.includes(q)))})}
  search?.addEventListener('input',applyShows);
  filterButtons.forEach(b=>b.addEventListener('click',()=>{active=b.dataset.showFilter;filterButtons.forEach(x=>x.classList.toggle('active',x===b));applyShows()}));

  const menuButtons=[...document.querySelectorAll('[data-menu-filter]')];
  const menuItems=[...document.querySelectorAll('[data-menu-item]')];
  menuButtons.forEach(b=>b.addEventListener('click',()=>{const cat=b.dataset.menuFilter;menuButtons.forEach(x=>x.classList.toggle('active',x===b));menuItems.forEach(i=>i.hidden=!(cat==='all'||i.dataset.cat===cat))}));

  document.querySelectorAll('[data-demo-form]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();const s=form.querySelector('.form-status');if(s)s.textContent='Demo only — no message was sent. Connect this form to your real ticketing/CRM workflow before launch.';notify('Demo request prepared — nothing was sent.')}));

  document.querySelectorAll('details').forEach(d=>d.addEventListener('toggle',()=>{if(d.open&&d.parentElement?.classList.contains('accordion'))[...d.parentElement.children].filter(x=>x!==d&&x.tagName==='DETAILS').forEach(x=>x.open=false)}));

  const reveal=[...document.querySelectorAll('main > section')]; reveal.forEach(x=>x.classList.add('reveal'));
  if('IntersectionObserver' in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}}),{threshold:.06});reveal.forEach(x=>io.observe(x))}else reveal.forEach(x=>x.classList.add('visible'));
});
