(() => {
  const links = [...document.querySelectorAll('.header nav a[href^="#"]')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  let pending = false;
  function update() {
    pending = false;
    let active = null;
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= innerHeight * .38) active = section.id;
    }
    links.forEach(link => {
      if (link.getAttribute('href') === '#' + active) link.setAttribute('aria-current','location');
      else link.removeAttribute('aria-current');
    });
  }
  addEventListener('scroll', () => { if (!pending) { pending = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize',update,{passive:true});
  update();
})();
