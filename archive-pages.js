(() => {
  const menu = document.querySelector('.archive-menu');
  const nav = document.querySelector('#archive-navigation');
  if (!menu || !nav) return;
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu(); menu.focus();
    }
  });
})();
