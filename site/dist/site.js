(() => {
  const menuButton = document.querySelector('.menu-button');
  const nav = document.querySelector('#primary-nav');
  const closeMenu = () => { nav.classList.remove('is-open'); menuButton.setAttribute('aria-expanded', 'false'); menuButton.querySelector('span').textContent='＋'; };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') !== 'true';
    menuButton.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open); menuButton.querySelector('span').textContent = open ? '−' : '＋';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if(e.key==='Escape' && nav.classList.contains('is-open')) {closeMenu(); menuButton.focus();} });
  window.matchMedia('(min-width:761px)').addEventListener('change', e => { if(e.matches) closeMenu(); });

  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !motion.matches) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.remove('is-waiting');observer.unobserve(entry.target);}
    }), {threshold: .07, rootMargin:'0px 0px 40px 0px'});
    document.querySelectorAll('.reveal').forEach(element => {element.classList.add('is-waiting');observer.observe(element);});
    motion.addEventListener('change', e => {if(e.matches)document.querySelectorAll('.is-waiting').forEach(el=>el.classList.remove('is-waiting'));});
  }

  const progress=document.querySelector('.reading-progress');let scrollPending=false;
  const updateProgress=()=>{const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${max>0?scrollY/max:0})`;scrollPending=false;};
  addEventListener('scroll',()=>{if(!scrollPending){scrollPending=true;requestAnimationFrame(updateProgress);}},{passive:true});
  addEventListener('resize',updateProgress);updateProgress();

  document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
    const filter=button.dataset.filter;let visible=0;
    document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelectorAll('.project-card').forEach(card=>{
      const show=filter==='all'||card.dataset.categories.split(' ').includes(filter);
      card.hidden=!show;if(show){visible++;card.classList.remove('is-waiting');}
    });
    document.querySelector('.project-grid').classList.toggle('filtered',filter!=='all');
    document.querySelector('.work-count').textContent=`${visible} projects`;
  }));

  document.querySelectorAll('.copy-email').forEach(button=>button.addEventListener('click',async()=>{
    const status=button.closest('.contact-section').querySelector('.copy-status');
    try{await navigator.clipboard.writeText('visualsbykarthik@gmail.com');status.textContent='Email copied to clipboard.';}
    catch{status.textContent='Email: visualsbykarthik@gmail.com — select the address to copy it.';}
  }));

  const dialog=document.querySelector('.lightbox');
  const image=dialog.querySelector('.lightbox-image');
  const caption=dialog.querySelector('#lightbox-caption');
  const thumbnails=[...document.querySelectorAll('.zoom-image')];let current=0;let opener=null;
  const showImage=index=>{
    current=(index+thumbnails.length)%thumbnails.length;const target=thumbnails[current];
    image.src=target.dataset.full;image.alt=target.dataset.caption;caption.textContent=target.dataset.caption;
    dialog.querySelector('.full-size').href=target.dataset.full;
  };
  thumbnails.forEach((button,i)=>button.addEventListener('click',()=>{
    opener=button;showImage(i);dialog.showModal();document.body.classList.add('dialog-open');dialog.querySelector('.close-lightbox').focus();
  }));
  dialog.querySelector('.close-lightbox').addEventListener('click',()=>dialog.close());
  dialog.querySelector('.previous-image').addEventListener('click',()=>showImage(current-1));
  dialog.querySelector('.next-image').addEventListener('click',()=>showImage(current+1));
  dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');opener?.focus();});
  dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();showImage(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();showImage(current-1);}});

  if('IntersectionObserver' in window){
    const links=[...document.querySelectorAll('.case-nav a')];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting)links.forEach(link=>{const active=link.hash==='#'+entry.target.id;link.classList.toggle('active',active);if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }),{rootMargin:'-160px 0px -50% 0px',threshold:0});
    links.forEach(link=>{const section=document.querySelector(link.hash);if(section)observer.observe(section);});
  }
})();
