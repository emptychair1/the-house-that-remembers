const reader=document.getElementById('reader');
const coverSrc='./assets/source/IMG_3301.png';
const sealSrc='./assets/seals/474C63C0-32CC-407D-9FCA-1BECE724CB3E.png';
const pi='3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273';
const files=[
  ['foreword','manuscript/FOREWORD.md','foreword','Foreword'],
  ['act1','','act1','Act I'],
  ['portrait','','portrait','Portrait'],
  ['chapter1','manuscript/CHAPTER-01-THE-WRETCHED-MACHINE.md','chapter','Chapter 1'],
  ['chapter2','manuscript/CHAPTER-02-BUILD-SOMETHING.md','chapter','Chapter 2'],
  ['chapter3','manuscript/CHAPTER-03-THE-INTERVAL.md','piper','Chapter 3'],
  ['chapter4','manuscript/CHAPTER-04-CLEANING-HOUSE.md','chapter','Chapter 4'],
  ['chapter5','manuscript/CHAPTER-05-FRIEND.md','piper','Chapter 5'],
  ['artifact','','artifact','Artifact'],
  ['sefer','manuscript/SEFER-YETZIRAH.md','manuscript','Sefer Yetzirah'],
  ['act1end','','symbols','Sequence'],
  ['act2','','act2','Act II'],
  ['aristotle','manuscript/ARISTOTLE-POETICS.md','manuscript','Aristotle']
];
const TITLE_RE=/^(Chapter|Foreword|Interruption|The Wretched|Build Something|The Interval|Cleaning House|Friend|Naming|Possibility|Sefer|Aristotle)/i;
const units=[];
let index=0;
let sx=0,sy=0,moved=false;
function esc(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function lockScroll(){
  document.documentElement.style.overflow='hidden';
  document.body.style.overflow='hidden';
  document.body.style.position='fixed';
  document.body.style.inset='0';
  document.body.style.width='100%';
  document.body.style.height='100dvh';
  window.scrollTo(0,0);
}
function section(cls,html,label){
  const e=document.createElement('section');
  e.className='unit '+cls;
  e.innerHTML=html;
  if(label)e.dataset.label=label;
  reader.appendChild(e);
  units.push(e);
  return e;
}
function folio(label,num){return '<div class="book-folio" aria-hidden="true"><span>'+String(num).padStart(2,'0')+'</span><span>'+esc(label)+'</span></div>'}
function addFolios(){
  let n=0;
  units.forEach(u=>{
    if(u.classList.contains('cover-page'))return;
    n+=1;
    u.insertAdjacentHTML('beforeend',folio(u.dataset.label||'',n));
  });
}
function ouro(){return '<svg viewBox="0 0 200 200" aria-label="Ouroboros"><circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" stroke-width="12"/><circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" stroke-width="10"/><circle cx="155" cy="100" r="8" fill="currentColor"/></svg>'}
function show(n){
  if(!units.length)return;
  if(typeof stopAudio==='function')stopAudio();
  units[index]?.classList.remove('active');
  index=(n+units.length)%units.length;
  units[index].classList.add('active');
  window.scrollTo(0,0);
  const active=units[index];
  if(active.classList.contains('portrait')&&typeof playCue==='function')playCue('portrait');
  if(active.querySelector('[data-id="chapter3"]')&&typeof playCue==='function')playCue('interval');
  if(active.classList.contains('portrait')){active.classList.add('strobe');setTimeout(()=>active.classList.remove('strobe'),1800)}
}
function splitLongParagraph(p,maxChars){
  const clean=p.trim();
  if(clean.length<=maxChars||TITLE_RE.test(clean))return [clean];
  const pieces=clean.match(/[^.!?]+[.!?]+[)”’"]*|.+$/g)||[clean];
  const out=[];
  let cur='';
  pieces.forEach(piece=>{
    const s=piece.trim();
    const next=cur?cur+' '+s:s;
    if(cur&&next.length>maxChars*.72){out.push(cur);cur=s}else{cur=next}
  });
  if(cur)out.push(cur);
  return out;
}
function splitIntoPages(paras,maxChars){
  const softened=paras.flatMap(p=>splitLongParagraph(p,maxChars));
  const pages=[];
  let cur=[],weight=0;
  softened.forEach(p=>{
    const w=p.replace(/\s+/g,' ').length+80;
    if(cur.length&&weight+w>maxChars){pages.push(cur);cur=[];weight=0}
    cur.push(p);weight+=w;
  });
  if(cur.length)pages.push(cur);
  return pages.length?pages:[[]];
}
function textPages(id,txt,cls,label){
  const paras=txt.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
  const max=cls==='piper'?560:cls==='manuscript'?610:640;
  splitIntoPages(paras,max).forEach((chunk,pageIndex)=>{
    const body=chunk.map((p,i)=>{
      const title=pageIndex===0&&i<4&&TITLE_RE.test(p);
      return '<p class="'+(title?'title-line':'')+'">'+esc(p)+'</p>';
    }).join('');
    section(cls+' text-page','<article class="book-copy" data-id="'+id+'">'+body+'</article>',label);
  });
}
function forewordPages(txt){
  const parts=txt.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
  const body=parts.slice(2);
  splitIntoPages(body,520).forEach((chunk,pageIndex)=>{
    const head=pageIndex===0?'<header class="foreword-head"><p class="foreword-kicker">Foreword</p><h1>Possibility<br>and Curiosity</h1><p class="foreword-subtitle">The House That Remembers</p></header>':'';
    const copy='<article class="foreword-copy '+(pageIndex===0?'first-page':'')+'" data-id="foreword">'+chunk.map(p=>'<p>'+esc(p)+'</p>').join('')+'</article>';
    section('manuscript foreword-final text-page',head+copy,'Foreword');
  });
  section('manuscript foreword-final seal-page text-page','<figure class="author-seal-wrap"><img class="author-seal" src="'+sealSrc+'" alt="JD author seal for Joshua Daniels"></figure><aside class="foreword-disclaimer"><strong>Accessibility note:</strong> Later sections of this book may contain flashing, strobing, high-contrast motion, or rapid visual changes. These effects may trigger seizures or discomfort in people with photosensitive epilepsy or related sensitivities. Reader controls and reduced-motion alternatives are planned before final release.</aside>','Foreword');
}
function specialPage(id){
  if(id==='act1')section('void-title text-page','<div class="copy center"><div class="ouro rail">'+ouro()+'</div><div class="kicker">Act I</div><div class="chapter-title">THE VOID<br>STARES BACK</div><div class="number-image">'+pi.repeat(8)+'</div></div>','Act I');
  if(id==='portrait')section('portrait void-title text-page','<div class="copy center"><div class="number-image">'+pi.repeat(6)+'</div><div class="asset-slot">PORTRAIT ASSET</div><div class="audio-cue">The Host of Seraphim · Dead Can Dance</div></div>','Portrait');
  if(id==='artifact')section('artifact text-page','<div class="chat"><div class="msg josh">I need this to be bite-sized.</div><div class="msg piper">One thing at a time.</div></div>','Artifact');
  if(id==='act1end')section('symbols text-page','<div class="symbol-wrap"><div class="symbol-stack">'+['Tree of Life','DNA','Decision Tree'].map((x,i)=>'<div class="symbol-placeholder s'+i+'">'+x+'</div>').join('')+'</div><div class="ladder">“And behold a ladder set up on the earth, and the top of it reached to heaven...”</div></div>','Sequence');
  if(id==='act2')section('act2 text-page','<div class="copy center"><div class="wheel">'+ouro()+'</div><div class="kicker">Act II</div><div class="chapter-title">DEUS EX MACHINA</div><div class="number-image">'+pi.repeat(6)+'</div></div>','Act II');
}
function initRosettaCover(canvas){
  const ctx=canvas.getContext('2d',{alpha:false});
  const img=new Image();
  img.src=coverSrc;
  const PI=pi.replace(/\./g,'');
  let start=0,dpr=1,W=0,H=0,cover=null,stream=[];
  const coverBox={x:0,y:0,w:0,h:0};
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
  const hash=(x,y,salt=0)=>{const s=Math.sin((x*127.1)+(y*311.7)+(salt*74.7))*43758.5453123;return s-Math.floor(s)};
  function resize(){dpr=Math.min(devicePixelRatio||1,2);W=innerWidth;H=innerHeight;canvas.width=W*dpr;canvas.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);layout();buildStream()}
  function layout(){if(!img.naturalWidth||!img.naturalHeight)return;const scale=Math.min(W/img.naturalWidth,H/img.naturalHeight);coverBox.w=img.naturalWidth*scale;coverBox.h=img.naturalHeight*scale;coverBox.x=(W-coverBox.w)/2;coverBox.y=(H-coverBox.h)/2}
  function makeMonochromeCover(){cover=document.createElement('canvas');cover.width=img.naturalWidth;cover.height=img.naturalHeight;const cctx=cover.getContext('2d',{willReadFrequently:true});cctx.drawImage(img,0,0);const frame=cctx.getImageData(0,0,cover.width,cover.height);const data=frame.data;for(let i=0;i<data.length;i+=4){const r=data[i],g=data[i+1],b=data[i+2];let v=(r*.2126+g*.7152+b*.0722)/255;v=clamp((v-.030)/.970);v=Math.pow(v,.82);const out=Math.round(v*255);data[i]=out;data[i+1]=out;data[i+2]=out}cctx.putImageData(frame,0,0)}
  function toCanvas(nx,ny){return{x:coverBox.x+nx*coverBox.w,y:coverBox.y+ny*coverBox.h}}
  function buildStream(){stream=[];if(!img.naturalWidth)return;const count=Math.round(clamp(W*H/1650,180,360));for(let i=0;i<count;i++){stream.push({lane:hash(i,0,1),offset:hash(i,0,2),speed:.045+hash(i,0,3)*.060,drift:(hash(i,0,4)-.5)*2,size:.78+hash(i,0,5)*.62,alpha:.34+hash(i,0,6)*.56,digit:PI[i%PI.length]})}}
  function drawCover(t){if(!cover)return;const reveal=ease(clamp((t-.15)/3.25));const breathe=.96+Math.sin(t*.32)*.04;ctx.save();ctx.globalAlpha=reveal*.62*breathe;ctx.drawImage(cover,coverBox.x,coverBox.y,coverBox.w,coverBox.h);ctx.restore()}
  function drawDataCurrent(t){if(!stream.length)return;const reveal=ease(clamp((t-.35)/2.65));if(!reveal)return;const a=toCanvas(-.060,.395);const b=toCanvas(.435,.535);const dx=b.x-a.x,dy=b.y-a.y;const len=Math.hypot(dx,dy)||1;const nx=-dy/len,ny=dx/len;ctx.save();ctx.textAlign='center';ctx.textBaseline='middle';ctx.globalCompositeOperation='screen';for(let i=0;i<stream.length;i++){const p=stream[i];const travel=(p.offset+t*p.speed)%1;const width=coverBox.w*(.150*(1-travel)+.030);const lane=(p.lane-.5)*2;const wobble=Math.sin(t*1.7+i*.37)*coverBox.w*.007*p.drift;const x=a.x+dx*travel+nx*lane*width+wobble;const y=a.y+dy*travel+ny*lane*width+Math.cos(t*1.35+i)*coverBox.h*.0035;const envelope=Math.sin(Math.PI*travel);const leadingSpark=travel>.72?1.18:1;const alpha=clamp(reveal*envelope*p.alpha*leadingSpark,0,.92);if(alpha<.025)continue;const font=Math.max(5.2,coverBox.w*.0095*p.size);ctx.font=`420 ${font}px ui-monospace,SFMono-Regular,Menlo,monospace`;ctx.fillStyle=`rgba(255,255,255,${alpha})`;ctx.shadowColor='rgba(255,255,255,.24)';ctx.shadowBlur=1.1;ctx.fillText(p.digit,x,y)}ctx.restore()}
  function frame(ts){if(!start)start=ts;const t=(ts-start)/1000;ctx.fillStyle='#000';ctx.fillRect(0,0,W,H);drawCover(t);drawDataCurrent(t);requestAnimationFrame(frame)}
  img.onload=()=>{makeMonochromeCover();resize();addEventListener('resize',resize);requestAnimationFrame(frame)};
}
async function build(){
  lockScroll();
  const cover=section('cover-page rosetta-stream-cover','<canvas class="rosetta-cover-canvas" aria-hidden="true"></canvas><div class="build-marker">ROSETTA STREAM v6</div><div class="page-whisper">tap anywhere to turn the page</div>');
  initRosettaCover(cover.querySelector('canvas'));
  for(const [id,path,cls,label] of files){
    if(path){
      const res=await fetch(path,{cache:'no-store'});
      const txt=await res.text();
      if(id==='foreword')forewordPages(txt);else textPages(id,txt,cls,label);
    }else specialPage(id);
  }
  addFolios();
  units.forEach(u=>u.classList.remove('active'));
  show(0);
}
reader.addEventListener('touchstart',e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;moved=false},{passive:true});
reader.addEventListener('touchmove',e=>{e.preventDefault();const t=e.touches[0];if(Math.abs(t.clientX-sx)>14||Math.abs(t.clientY-sy)>14)moved=true},{passive:false});
reader.addEventListener('touchend',e=>{const t=e.changedTouches[0];const dx=t.clientX-sx;const dy=t.clientY-sy;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){show(index+(dx<0?1:-1));return}if(!moved)show(index+1)},{passive:true});
reader.addEventListener('click',e=>{if(e.target.closest('a,button'))return;show(index+1)});
document.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key===' '||e.key==='PageDown')show(index+1);if(e.key==='ArrowLeft'||e.key==='PageUp')show(index-1)});
document.addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
window.addEventListener('scroll',()=>window.scrollTo(0,0),{passive:true});
build();
