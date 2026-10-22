(() => {
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  canvas.id = 'sf-background';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9;opacity:.28;mix-blend-mode:screen';
  document.body.append(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return; }
  let width=0, height=0, particles=[], frame=0, last=0, time=0;
  function resize() {
    width=innerWidth; height=innerHeight;
    const ratio=Math.min(devicePixelRatio || 1,1.5);
    canvas.width=Math.round(width*ratio); canvas.height=Math.round(height*ratio);
    ctx.setTransform(ratio,0,0,ratio,0,0);
    particles=Array.from({length:width<700?20:38},()=>({x:Math.random()*width,y:Math.random()*height,s:.5+Math.random(),v:4+Math.random()*10}));
    draw(0);
  }
  function draw(delta) {
    ctx.clearRect(0,0,width,height);
    ctx.lineWidth=.6; ctx.strokeStyle='rgba(85,177,201,.13)';
    const spacing=110;
    for(let x=0;x<width;x+=spacing){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,height);ctx.stroke();}
    for(let y=0;y<height;y+=spacing){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(width,y);ctx.stroke();}
    for(const p of particles){
      p.y-=delta*p.v; p.x+=delta*1.8;
      if(p.y< -12){p.y=height+12;p.x=Math.random()*width;}
      if(p.x>width+12)p.x=-12;
      ctx.fillStyle='rgba(145,224,241,.8)';ctx.beginPath();ctx.arc(p.x,p.y,p.s,0,Math.PI*2);ctx.fill();

    }

  }
  function tick(stamp){
    frame=0;
    if(document.hidden || motion.matches)return;
    if(stamp-last>=33){const delta=last?Math.min((stamp-last)/1000,.08):0;last=stamp;time+=delta;draw(delta);}
    frame=requestAnimationFrame(tick);
  }
  function sync(){cancelAnimationFrame(frame);frame=0;last=0;if(!document.hidden&&!motion.matches)frame=requestAnimationFrame(tick);else draw(0);}
  window.addEventListener('resize',resize,{passive:true});
  document.addEventListener('visibilitychange',sync);
  motion.addEventListener('change',sync);
  resize();sync();
})();
