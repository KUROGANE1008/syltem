(() => {
  const button = document.querySelector('.gallery-toggle');
  const grid = document.getElementById('gallery-records');
  if (!button || !grid) return;
  function setOpen(open) {
    grid.hidden = !open;
    button.setAttribute('aria-expanded',String(open));
    button.textContent = open ? 'ギャラリーを閉じる −' : 'ギャラリーを開く ＋';
  }
  setOpen(false);
  button.addEventListener('click',()=>setOpen(grid.hidden));
})();
