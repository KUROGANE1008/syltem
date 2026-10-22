(() => {
  const reader = document.getElementById('reader');
  const toggle = document.getElementById('width-toggle');
  const select = document.getElementById('page-select');
  if (!reader || !toggle || !select) return;
  const pages = [...reader.querySelectorAll('.page')];
  const mobile = matchMedia('(max-width:760px)');
  const help = document.getElementById('reader-help');
  const dock = document.createElement('div');
  dock.className = 'reader-dock';
  dock.setAttribute('role', 'group');
  dock.setAttribute('aria-label', '漫画の読み方としおり');
  const quickZoom = document.createElement('button');
  quickZoom.type = 'button';
  quickZoom.className = 'reader-zoom';
  quickZoom.textContent = '大きく読む';
  quickZoom.setAttribute('aria-pressed', 'false');
  quickZoom.setAttribute('aria-controls', 'reader');
  dock.append(quickZoom);
  const bookmark = document.querySelector('.bookmark-save');
  if (bookmark) dock.append(bookmark);
  document.body.append(dock);

  function setPageEdges() {
    const expanded = reader.classList.contains('wide') && mobile.matches;
    reader.querySelectorAll('.reader-viewport').forEach(viewport => {
      viewport.tabIndex = expanded ? 0 : -1;
      // Japanese manga starts at the right. The containing page never widens.
      viewport.scrollLeft = expanded ? viewport.scrollWidth - viewport.clientWidth : 0;
    });
  }
  function toggleWidth() {
    const top = document.querySelector('.comic-header').getBoundingClientRect().bottom + 16;
    const bottom = mobile.matches ? dock.getBoundingClientRect().top : innerHeight;
    let focus = null, area = 0, ratio = 0;
    for (const page of pages) {
      const rect = page.getBoundingClientRect();
      const visible = Math.max(0, Math.min(rect.bottom, bottom) - Math.max(rect.top, top));
      if (visible > area) {
        focus = page; area = visible;
        ratio = (top - rect.top) / rect.height;
      }
    }
    const wide = reader.classList.toggle('wide');
    toggle.setAttribute('aria-pressed', String(wide));
    toggle.textContent = wide ? '標準サイズに戻す' : '大きく読む';
    quickZoom.setAttribute('aria-pressed', String(wide));
    quickZoom.textContent = wide ? '全体表示に戻す' : '大きく読む';
    if (help) help.textContent = wide
      ? '拡大中：漫画を左右にスワイプして読めます。右側から読み始められます。'
      : '文字が小さいときは「大きく読む」。拡大後は漫画を左右にスワイプできます。';
    requestAnimationFrame(() => {
      setPageEdges();
      if (focus) {
        const rect = focus.getBoundingClientRect();
        scrollBy(0, rect.top + ratio * rect.height - top);
      }
    });
  }
  toggle.addEventListener('click', toggleWidth);
  quickZoom.addEventListener('click', toggleWidth);
  document.getElementById('page-go').addEventListener('click', () => {
    const page = document.getElementById(select.value);
    if (!page) return;
    location.hash = page.id;
    page.scrollIntoView({block: 'start', inline: 'nearest'});
  });
  addEventListener('hashchange', () => {
    const page = pages.find(page => '#' + page.id === location.hash);
    if (!page) return;
    select.value = page.id;
    if (mobile.matches && reader.classList.contains('wide')) {
      const viewport = page.closest('.reader-viewport');
      viewport.scrollLeft = viewport.scrollWidth - viewport.clientWidth;
    }
  });
  mobile.addEventListener('change', setPageEdges);
})();
