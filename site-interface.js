(() => {
  const header = document.querySelector('.header, .archive-header');
  const nav = header?.querySelector('nav');
  const toggle = header?.querySelector('.menu-toggle, .archive-menu');
  const labels = {STORY:'物語',CHARACTER:'登場人物',RELATIONSHIP:'相関図',MECHANIC:'機体',GALLERY:'ギャラリー',DATABASE:'世界設定',COMIC:'漫画',MUSIC:'音楽',GAME:'ゲーム'};
  nav?.querySelectorAll('a').forEach(link => {
    const key = link.textContent.trim();
    if (!labels[key] || link.querySelector('small')) return;
    const subtitle = document.createElement('small');
    subtitle.textContent = labels[key]; link.append(subtitle);
  });
  const closeMenu = () => { nav?.classList.remove('open'); toggle?.setAttribute('aria-expanded','false'); };
  document.addEventListener('pointerdown', event => {
    if (nav?.classList.contains('open') && !header.contains(event.target)) closeMenu();
  });
  const breakpoint = matchMedia(document.body.classList.contains('archive-page') ? '(max-width:850px)' : '(max-width:1280px)');
  breakpoint.addEventListener('change', closeMenu);

  const game = document.body.classList.contains('game-page');
  const home = !!document.querySelector('#main .hero');
  if (!game && !home) return;
  const entries = game
    ? [...document.querySelectorAll('.game-section-nav a')].map(a=>({href:a.getAttribute('href'),title:a.textContent.trim()}))
    : [{href:'#top',title:'トップ'},{href:'#news',title:'お知らせ'},{href:'#story',title:'物語'},{href:'#character',title:'登場人物'},{href:'#relationships',title:'相関図'},{href:'#mechanic',title:'機体'},{href:'#gallery',title:'ギャラリー'},{href:'#database',title:'世界設定'}];
  const sections = entries.map(item=>({...item,element:document.querySelector(item.href)})).filter(item=>item.element);
  if (!sections.length) return;
  const dialog = document.createElement('dialog');
  dialog.className='site-map'; dialog.id='site-map'; dialog.setAttribute('aria-labelledby','site-map-title');
  const head = document.createElement('div'); head.className='site-map-head';
  const title = document.createElement('div');
  const code=document.createElement('p');code.textContent='S.Y.L.T.E.M. / NAVIGATION';
  const heading=document.createElement('h2');heading.id='site-map-title';heading.textContent='ページ内の目次';
  title.append(code,heading);
  const dismiss=document.createElement('button');dismiss.type='button';dismiss.textContent='閉じる ×';dismiss.setAttribute('aria-label','目次を閉じる');
  head.append(title,dismiss);
  const links=document.createElement('nav');links.className='site-map-links';links.setAttribute('aria-label','ページ内の移動先');
  const linkNodes=sections.map((item,i)=>{
    const link=document.createElement('a');link.href=item.href;
    const number=document.createElement('span');number.textContent=String(i+1).padStart(2,'0');number.setAttribute('aria-hidden','true');
    link.append(number,document.createTextNode(item.title));links.append(link);
    link.addEventListener('click',()=>dialog.close());return link;
  });
  dialog.append(head,links);
  const quick=document.createElement('div');quick.className='site-quick-nav';quick.hidden=true;
  const contents=document.createElement('button');contents.type='button';contents.setAttribute('aria-label','ページ内の目次を開く');contents.setAttribute('aria-haspopup','dialog');contents.setAttribute('aria-controls','site-map');
  const symbol=document.createElement('span');symbol.className='quick-symbol';symbol.textContent='≡';symbol.setAttribute('aria-hidden','true');
  contents.append(symbol,document.createTextNode('目次'));
  const top=document.createElement('button');top.type='button';top.className='site-top';top.textContent='↑';top.setAttribute('aria-label','ページの先頭に戻る');
  quick.append(contents,top);document.body.append(quick,dialog);
  contents.addEventListener('click',()=>{closeMenu();dialog.showModal();});
  dismiss.addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog)dialog.close();});
  top.addEventListener('click',()=>{window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'instant':'smooth'});header?.querySelector('a')?.focus({preventScroll:true});});
  const gameLinks=[...document.querySelectorAll('.game-section-nav a')];
  let waiting=false;
  function update(){
    waiting=false;quick.hidden=window.scrollY<650;
    let active=-1;
    sections.forEach((item,i)=>{if(item.element.getBoundingClientRect().top<=180)active=i;});
    linkNodes.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    gameLinks.forEach((link,i)=>{if(i===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
  }
  addEventListener('scroll',()=>{if(!waiting){waiting=true;requestAnimationFrame(update);}},{passive:true});
  update();
})();
