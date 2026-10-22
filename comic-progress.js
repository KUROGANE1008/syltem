(() => {
  const key = 'syltem-comic-progress-v1';
  function readProgress() {
    try {
      const value = JSON.parse(localStorage.getItem(key));
      if (value && typeof value.source === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(value.source)
        && /^(cover|page-\d{3})$/.test(value.page)) return value;
    } catch { /* Reading still works when browser storage is unavailable. */ }
    return null;
  }

  const link = document.getElementById('comic-resume');
  const note = document.getElementById('comic-resume-note');
  function updateNews() {
    if (!link) return;
    const saved = readProgress();
    link.href = saved ? 'comic.html?resume=1' : 'comic.html#cover';
    link.innerHTML = (saved ? '続きから読む' : '最初から読む') + ' <span aria-hidden="true">↗</span>';
    link.setAttribute('aria-label', saved ? 'この端末の前回の読書位置から再開' : '漫画を最初から読む');
    if (note) note.textContent = saved
      ? 'この端末・ブラウザーで最後に読んだページから再開します。'
      : '読んだページは、この端末・ブラウザーに自動保存されます。';
  }
  updateNews();
  addEventListener('pageshow', updateNews);
  addEventListener('storage', event => { if (event.key === key) updateNews(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) updateNews(); });

  const reader = document.getElementById('reader');
  if (!reader) return;
  const pages = [...reader.querySelectorAll('.page')];
  if (!pages.length) return;
  let lastSource = null;
  let timer = null;
  let ready = false;
  function remember() {
    if (!ready) return;
    const top = document.querySelector('.comic-header').getBoundingClientRect().bottom;
    const dock = document.querySelector('.reader-dock')?.getBoundingClientRect();
    const bottom = dock?.height ? Math.min(innerHeight, dock.top) : innerHeight;
    let current = null, largest = 0;
    for (const page of pages) {
      const rect = page.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
      if (visible > largest) { largest = visible; current = page; }
    }
    // Avoid replacing a saved location with a page that barely enters the screen.
    if (!current || largest < 80) return;
    const source = current.dataset.sourcePage || current.id;
    if (source === lastSource) return;
    try {
      localStorage.setItem(key, JSON.stringify({source, page: current.id, updatedAt: Date.now()}));
      lastSource = source;
    } catch { /* Do not block reading or manual bookmarks. */ }
  }
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(remember, 350);
  }
  const url = new URL(location.href);
  if (url.searchParams.get('resume') === '1') {
    const saved = readProgress();
    const page = pages.find(p => (p.dataset.sourcePage || p.id) === saved?.source) || pages[0];
    url.searchParams.delete('resume');
    url.hash = page.id;
    history.replaceState(null, '', url.pathname + url.search + url.hash);
    document.getElementById('page-select').value = page.id;
    requestAnimationFrame(() => {
      page.scrollIntoView({block: 'start', inline: 'nearest'});
      ready = true;
      schedule();
    });
  } else {
    ready = true;
    schedule();
  }
  addEventListener('scroll', schedule, {passive: true});
  addEventListener('resize', schedule, {passive: true});
  addEventListener('hashchange', schedule);
  addEventListener('pagehide', remember);
  document.addEventListener('visibilitychange', () => { if (document.hidden) remember(); });
})();
