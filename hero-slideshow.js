(() => {
  const image = document.querySelector('.official-emblem');
  const entries = [...document.querySelectorAll('.gallery-item')];
  if (!image || !entries.length) return;
  const slides = [{src:image.getAttribute('src'),alt:image.alt,title:'シルテム概要 / タイトルビジュアル'}, ...entries.map(item => ({src:item.dataset.image,alt:item.querySelector('img').alt,title:item.dataset.title}))];
  const style = document.createElement('style');
  style.textContent = '.hero-slideshow{width:min(100%,1500px);margin:auto}.hero-slideshow .official-emblem{display:block;width:100%!important;aspect-ratio:1672/941;object-fit:contain;background:#080c12}.hero-slide-controls{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:12px;margin:15px 12px 0}.hero-slide-controls button{color:#cfe7ed;background:#10212b;border:1px solid #54727e;min-height:44px;min-width:44px;padding:8px 13px;font:14px sans-serif;cursor:pointer}.hero-slide-controls button:focus-visible{outline:2px solid #b2edf2;outline-offset:3px}.hero-slide-caption{font:14px/1.8 sans-serif;color:#bccfd7;letter-spacing:.04em;margin:12px 16px 0}.hero-slide-count{font:13px monospace;color:#9abcc8}';
  document.head.append(style);
  const wrap = document.createElement('div'); wrap.className = 'hero-slideshow';
  wrap.setAttribute('role','region'); wrap.setAttribute('aria-label','トップビジュアルのスライドショー');
  image.before(wrap); wrap.append(image);
  const controls = document.createElement('div'); controls.className = 'hero-slide-controls';
  controls.innerHTML = '<button type="button" aria-label="前の画像">←</button><span class="hero-slide-count"></span><button type="button" aria-label="次の画像">→</button><button type="button" class="hero-slide-pause"></button>';
  const caption = document.createElement('p'); caption.className = 'hero-slide-caption';
  wrap.append(caption);
  const buttons = controls.querySelectorAll('button');
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  let index = 0, playing = !motion.matches, timer, loading = false;
  function labels() {
    controls.querySelector('.hero-slide-count').textContent = `${index+1} / ${slides.length}`;
    caption.textContent = slides[index].title;
    buttons[2].textContent = playing ? '一時停止' : '自動再生';
    buttons[2].setAttribute('aria-label',playing?'スライドショーを一時停止':'スライドショーを自動再生');
  }
  function schedule() {
    clearTimeout(timer);
    if (playing && !document.hidden) timer = setTimeout(() => show(index+1),7000);
  }
  function show(next) {
    if (loading) return;
    clearTimeout(timer);
    next = (next+slides.length)%slides.length;
    const preload = new Image(); loading = true;
    preload.onload = () => {
      image.src = slides[next].src; image.alt = slides[next].alt;
      index = next; loading = false; labels(); schedule();
    };
    preload.onerror = () => { loading = false; schedule(); };
    preload.src = slides[next].src;
  }
  buttons[0].addEventListener('click',()=>show(index-1));
  buttons[1].addEventListener('click',()=>show(index+1));
  buttons[2].addEventListener('click',()=>{playing=!playing;labels();schedule();});
  document.addEventListener('visibilitychange',schedule);
  motion.addEventListener('change',e=>{if(e.matches){playing=false;labels();schedule();}});
  labels(); schedule();
})();
