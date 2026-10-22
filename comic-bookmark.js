(() => {
  const key = 'syltem-comic-bookmark-v2';
  const legacyKey = 'syltem-comic-bookmark-v1';
  const pages = [...document.querySelectorAll('#reader .page')];
  if (!pages.length) return;
  const style = document.createElement('style');
  style.textContent = '.bookmark-panel{max-width:1000px;margin:0 auto 30px;padding:18px 24px;border-top:1px solid #354954;border-bottom:1px solid #354954}.bookmark-panel p{margin:4px 0 12px;font-size:12px;color:#b9c4ce}.bookmark-actions{display:flex;flex-wrap:wrap;gap:10px}.bookmark-actions button:disabled{opacity:.45}.bookmark-save{position:fixed;right:16px;bottom:18px;z-index:6;box-shadow:0 3px 20px #0009;background:#142b36;border-color:#86d6e1;cursor:pointer}.bookmark-panel [role=status]{color:#a9e6ec;min-height:1.9em}@media(max-width:600px){.bookmark-save{right:10px;bottom:12px;font-size:12px;padding:9px 12px}.comic-footer{padding-bottom:90px}}';
  document.head.append(style);
  const panel = document.createElement('section');
  panel.className = 'bookmark-panel';
  panel.setAttribute('aria-label', '漫画のしおり');
  panel.innerHTML = '<div class="eyebrow">READING BOOKMARK / しおり</div><p>読んでいるページで「しおりを保存」を押すと、あとで続きから読めます。同じ端末・ブラウザーに1件保存します。</p><div class="bookmark-actions"><button type="button" id="bookmark-resume" disabled>しおりから再開</button><button type="button" id="bookmark-clear" disabled>しおりを削除</button></div><p role="status" aria-live="polite" id="bookmark-status"></p>';
  document.querySelector('.reader-tools').after(panel);
  const save = document.createElement('button');
  save.type = 'button'; save.className = 'bookmark-save'; save.textContent = 'しおりを保存';
  document.body.append(save);
  const resume = panel.querySelector('#bookmark-resume');
  const clear = panel.querySelector('#bookmark-clear');
  const status = panel.querySelector('#bookmark-status');
  let saved = null;
  const label = id => id === 'cover' ? '表紙' : `${Number(id.slice(5))}ページ`;
  function persist(page) {
    // Source IDs stay attached to the same scene when pages are inserted.
    localStorage.setItem(key, JSON.stringify({ source: page.dataset.sourcePage || page.id, page: page.id }));
    localStorage.removeItem(legacyKey);
  }
  function render(message) {
    resume.disabled = clear.disabled = !saved;
    resume.textContent = saved ? `${label(saved)}から再開` : 'しおりから再開';
    status.textContent = message || (saved ? `保存済み：${label(saved)}` : 'しおりはまだありません。');
  }
  try {
    const value = localStorage.getItem(key);
    if (value) {
      const record = JSON.parse(value);
      const page = pages.find(p => (p.dataset.sourcePage || p.id) === record.source);
      if (page) saved = page.id;
    } else {
      const legacy = localStorage.getItem(legacyKey);
      const page = legacy && pages.find(p => p.dataset.previousPage === legacy);
      if (page) { saved = page.id; persist(page); }
    }
    render();
  } catch { render('このブラウザーではしおりを保存できません。保存設定をご確認ください。'); }
  save.addEventListener('click', () => {
    // Choose the page with the largest visible reading area below the header.
    let current = pages[0], largest = 0;
    const headerBottom = document.querySelector('.comic-header').getBoundingClientRect().bottom;
    const dock = document.querySelector('.reader-dock');
    const dockRect = dock?.getBoundingClientRect();
    const readerBottom = dockRect?.height ? Math.min(innerHeight, dockRect.top) : innerHeight;
    for (const page of pages) {
      const rect = page.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, readerBottom) - Math.max(rect.top, headerBottom));
      if (visible > largest) { largest = visible; current = page; }
    }
    try {
      persist(current); saved = current.id;
      render(`${label(saved)}にしおりを保存しました。`);
      save.textContent = `${label(saved)}を保存しました`;
      setTimeout(() => { save.textContent = 'しおりを保存'; }, 2200);
    } catch { render('しおりを保存できませんでした。ブラウザーの保存設定をご確認ください。'); save.textContent = '保存できませんでした'; }
  });
  resume.addEventListener('click', () => {
    if (!saved) return;
    location.hash = saved;
    document.getElementById(saved).scrollIntoView();
    document.getElementById('page-select').value = saved;
  });
  clear.addEventListener('click', () => {
    try { localStorage.removeItem(key); localStorage.removeItem(legacyKey); saved = null; render('しおりを削除しました。'); }
    catch { render('しおりを削除できませんでした。'); }
  });
})();
