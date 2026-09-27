(()=>{
  const book=document.getElementById('book');
  const cover=document.querySelector('.cover');
  const foreword=document.querySelector('.foreword');
  const sealPage=document.querySelector('.foreword-seal');
  const status=document.getElementById('status');
  const canvas=document.getElementById('glyph-overlay');
  const ctx=canvas.getContext('2d');
  let current=0;
  function usableHeight(page){const cs=getComputedStyle(page);return page.clientHeight-(parseFloat(cs.paddingTop)||0)-(parseFloat(cs.paddingBottom)||0)}
  function pageFits(page){const inner=page.querySelector('.foreword-inner');return inner.scrollHeight<=usableHeight(page)+1}
  function makeContinuation(){
    const section=document.createElement('section');
    section.className='page foreword foreword-cont';
    section.setAttribute('aria-label','Foreword continued');
    const inner=document.createElement('div');inner.className='foreword-inner';
    const opening=document.createElement('div');opening.className='opening';
    inner.appendChild(opening);section.appendChild(inner);book.insertBefore(section,sealPage);
    return {section,opening};
  }
  function paginateForeword(){
    const firstOpening=foreword.querySelector('.opening');
    const items=[...firstOpening.children];
    firstOpening.innerHTML='';
    let page=foreword, opening=firstOpening;
    for(const item of items){
      opening.appendChild(item);
      if(!pageFits(page)){
        opening.removeChild(item);
        const next=makeContinuation();
        page=next.section;opening=next.opening;opening.appendChild(item);
      }
    }
  }
  paginateForeword();
  const pages=[...book.querySelectorAll('.page')];
  const last=pages.length-1;
  status.textContent=`1 / ${pages.length}`;
  const pf=new St.PageFlip(book,{width:Math.max(1,Math.round(window.innerWidth)),height:Math.max(1,Math.round(window.innerHeight)),size:'stretch',minWidth:300,maxWidth:1000,minHeight:520,maxHeight:1600,autoSize:true,usePortrait:true,showCover:true,startPage:0,flippingTime:700,drawShadow:true,maxShadowOpacity:.32,mobileScrollSupport:false});
  pf.loadFromHTML(pages);
  const PI='31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
  const stream=[];let w=0,h=0,dpr=1,start=0;
  const hash=n=>{const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)};
  function syncOverlay(){
    if(current!==0){canvas.style.display='none';return}
    canvas.style.display='block';
    const r=cover.getBoundingClientRect();
    if(!r.width||!r.height)return;
    canvas.style.left=r.left+'px';canvas.style.top=r.top+'px';canvas.style.width=r.width+'px';canvas.style.height=r.height+'px';
    w=r.width;h=r.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.max(1,Math.round(w*dpr));canvas.height=Math.max(1,Math.round(h*dpr));ctx.setTransform(dpr,0,0,dpr,0,0);
    stream.length=0;
    const count=Math.max(220,Math.min(420,Math.round(w*h/1350)));
    for(let i=0;i<count;i++)stream.push({offset:hash(i+1),lane:hash(i+101),speed:.035+hash(i+201)*.05,size:.82+hash(i+301)*.72,alpha:.38+hash(i+401)*.5,digit:PI[i%PI.length]});
  }
  function setPage(i){current=Math.max(0,Math.min(last,Number(i)||0));status.textContent=`${current+1} / ${pages.length}`;requestAnimationFrame(syncOverlay);window.dispatchEvent(new CustomEvent('house:page',{detail:{current,pages}}));}
  pf.on('flip',e=>setPage(e.data));
  document.querySelector('.tap-right').addEventListener('pointerup',e=>{e.preventDefault();if(current<last)pf.flipNext()});
  document.querySelector('.tap-left').addEventListener('pointerup',e=>{e.preventDefault();if(current>0)pf.flipPrev()});
  addEventListener('keydown',e=>{if(e.key==='ArrowRight'&&current<last)pf.flipNext();if(e.key==='ArrowLeft'&&current>0)pf.flipPrev()});
  function draw(ts){
    if(!start)start=ts;const t=(ts-start)/1000;
    if(current===0&&w&&h){
      ctx.clearRect(0,0,w,h);
      const ax=-w*.05,ay=h*.42,bx=w*.5,by=h*.575,dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1,nx=-dy/len,ny=dx/len;
      ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalCompositeOperation='screen';ctx.shadowColor='rgba(255,255,255,.32)';ctx.shadowBlur=1.6;
      for(let i=0;i<stream.length;i++){
        const p=stream[i],travel=(p.offset+t*p.speed)%1,width=w*(.155*(1-travel)+.03),lane=(p.lane-.5)*2,wobble=Math.sin(t*1.5+i*.31)*w*.004;
        const x=ax+dx*travel+nx*lane*width+wobble,y=ay+dy*travel+ny*lane*width+Math.cos(t*1.1+i)*h*.0025,env=Math.sin(Math.PI*travel),alpha=Math.max(0,Math.min(.94,p.alpha*env));
        if(alpha<.025)continue;ctx.font=`${Math.max(6,w*.0104*p.size)}px ui-monospace,SFMono-Regular,Menlo,monospace`;ctx.fillStyle=`rgba(255,255,255,${alpha})`;ctx.fillText(p.digit,x,y);
      }
    }
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(syncOverlay);setTimeout(syncOverlay,120);setTimeout(syncOverlay,450);addEventListener('resize',()=>requestAnimationFrame(syncOverlay),{passive:true});requestAnimationFrame(draw);
  window.HouseBook={book,pages,pf,getCurrent:()=>current};
  window.dispatchEvent(new CustomEvent('house:ready',{detail:window.HouseBook}));
})();
