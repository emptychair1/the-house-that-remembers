(()=>{
  'use strict';
  const PROBE=true;
  let lastKey='';
  let settleToken=0;

  function visibleArea(el){
    const r=el.getBoundingClientRect();
    const w=Math.max(0,Math.min(innerWidth,r.right)-Math.max(0,r.left));
    const h=Math.max(0,Math.min(innerHeight,r.bottom)-Math.max(0,r.top));
    return w*h;
  }

  function findVisiblePage(){
    const pages=[...document.querySelectorAll('.page')];
    let best=null,bestArea=0;
    for(const page of pages){
      const area=visibleArea(page);
      if(area>bestArea){best=page;bestArea=area;}
    }
    return bestArea>400?best:null;
  }

  function emitSettled(reason){
    const token=++settleToken;
    requestAnimationFrame(()=>requestAnimationFrame(()=>{
      if(token!==settleToken)return;
      const page=findVisiblePage();
      if(!page)return;
      const pages=[...document.querySelectorAll('.page')];
      const index=pages.indexOf(page);
      const label=page.getAttribute('aria-label')||page.dataset.page||page.id||'';
      const key=index+'|'+label;
      if(key===lastKey)return;
      lastKey=key;
      window.dispatchEvent(new CustomEvent('spinepagesettled',{detail:{index,label,page,reason}}));
      if(PROBE){
        let badge=document.getElementById('spine-settle-probe');
        if(!badge){
          badge=document.createElement('div');badge.id='spine-settle-probe';
          badge.style.cssText='position:fixed;right:.65rem;top:max(.65rem,env(safe-area-inset-top));z-index:20000;padding:.4rem .5rem;border:1px solid rgba(255,255,255,.2);border-radius:.3rem;background:rgba(0,0,0,.76);color:rgba(255,255,255,.8);font:700 .52rem/1.2 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;pointer-events:none';
          document.body.appendChild(badge);
        }
        badge.textContent='SETTLED '+index+(label?' · '+label:'');
      }
    }));
  }

  function attachToPageFlip(){
    const pf=window.pageFlip||window.pageflip||window.PageFlipInstance||window.pageFlipInstance;
    if(!pf||typeof pf.on!=='function')return false;
    pf.on('flip',()=>emitSettled('flip'));
    pf.on('changeState',e=>{const state=e&&e.data!==undefined?e.data:e;if(state==='read')emitSettled('read');});
    return true;
  }

  let tries=0;
  const hook=setInterval(()=>{if(attachToPageFlip()||++tries>80)clearInterval(hook);},125);

  // Fallback/verification path for builds where the PageFlip instance is private.
  // It observes only which existing .page is physically visible; it never mutates the book.
  let previous='';
  setInterval(()=>{
    const page=findVisiblePage();
    if(!page)return;
    const pages=[...document.querySelectorAll('.page')];
    const index=pages.indexOf(page),label=page.getAttribute('aria-label')||'';
    const key=index+'|'+label;
    if(key!==previous){previous=key;emitSettled('visible');}
  },120);

  requestAnimationFrame(()=>emitSettled('initial'));
})();