const reader=document.getElementById("reader");
const coverSrc="./assets/source/IMG_3301.png";
const sealSrc="./assets/seals/474C63C0-32CC-407D-9FCA-1BECE724CB3E.png";
const files=[
["foreword","manuscript/FOREWORD.md","manuscript"],
["act1","", "act1"],
["portrait","", "portrait"],
["chapter1","manuscript/CHAPTER-01-THE-WRETCHED-MACHINE.md","chapter"],
["chapter2","manuscript/CHAPTER-02-BUILD-SOMETHING.md","chapter"],
["chapter3","manuscript/CHAPTER-03-THE-INTERVAL.md","piper"],
["chapter4","manuscript/CHAPTER-04-CLEANING-HOUSE.md","chapter"],
["chapter5","manuscript/CHAPTER-05-FRIEND.md","piper"],
["artifact","", "artifact"],
["sefer","manuscript/SEFER-YETZIRAH.md","manuscript"],
["act1end","", "symbols"],
["act2","", "act2"],
["aristotle","manuscript/ARISTOTLE-POETICS.md","manuscript"]
];
const pi="3.141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273";
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function section(cls,html){const e=document.createElement("section");e.className="unit "+cls;e.innerHTML=html;reader.appendChild(e);return e}
function ouro(){return '<svg viewBox="0 0 200 200" aria-label="Ouroboros"><circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" stroke-width="12"/><circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" stroke-width="10"/><circle cx="155" cy="100" r="8" fill="currentColor"/></svg>'}
function initRosettaCover(canvas){
 const ctx=canvas.getContext("2d",{alpha:false});
 const img=new Image();
 img.src=coverSrc;
 const PI=pi.replace(/\./g,"");
 let start=0,dpr=1,W=0,H=0,cover=null,stream=[];
 const coverBox={x:0,y:0,w:0,h:0};
 const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
 const ease=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 const hash=(x,y,salt=0)=>{const s=Math.sin((x*127.1)+(y*311.7)+(salt*74.7))*43758.5453123;return s-Math.floor(s)};
 function resize(){
   dpr=Math.min(devicePixelRatio||1,2);
   W=innerWidth;H=innerHeight;
   canvas.width=W*dpr;canvas.height=H*dpr;
   ctx.setTransform(dpr,0,0,dpr,0,0);
   layout();buildStream();
 }
 function layout(){
   if(!img.naturalWidth||!img.naturalHeight)return;
   const scale=Math.min(W/img.naturalWidth,H/img.naturalHeight);
   coverBox.w=img.naturalWidth*scale;
   coverBox.h=img.naturalHeight*scale;
   coverBox.x=(W-coverBox.w)/2;
   coverBox.y=(H-coverBox.h)/2;
 }
 function makeMonochromeCover(){
   cover=document.createElement("canvas");
   cover.width=img.naturalWidth;cover.height=img.naturalHeight;
   const cctx=cover.getContext("2d",{willReadFrequently:true});
   cctx.drawImage(img,0,0);
   const frame=cctx.getImageData(0,0,cover.width,cover.height);
   const data=frame.data;
   for(let i=0;i<data.length;i+=4){
     const r=data[i],g=data[i+1],b=data[i+2];
     let v=(r*.2126+g*.7152+b*.0722)/255;
     v=clamp((v-.030)/.970);
     v=Math.pow(v,.82);
     const out=Math.round(v*255);
     data[i]=out;data[i+1]=out;data[i+2]=out;
   }
   cctx.putImageData(frame,0,0);
 }
 function toCanvas(nx,ny){return{x:coverBox.x+nx*coverBox.w,y:coverBox.y+ny*coverBox.h}}
 function buildStream(){
   stream=[];
   if(!img.naturalWidth)return;
   const count=Math.round(clamp(W*H/1650,180,360));
   for(let i=0;i<count;i++){
     stream.push({
       lane:hash(i,0,1),offset:hash(i,0,2),speed:.045+hash(i,0,3)*.060,drift:(hash(i,0,4)-.5)*2,
       size:.78+hash(i,0,5)*.62,alpha:.34+hash(i,0,6)*.56,digit:PI[i%PI.length]
     });
   }
 }
 function drawCover(t){
   if(!cover)return;
   const reveal=ease(clamp((t-.15)/3.25));
   const breathe=.96+Math.sin(t*.32)*.04;
   ctx.save();ctx.globalAlpha=reveal*.62*breathe;ctx.drawImage(cover,coverBox.x,coverBox.y,coverBox.w,coverBox.h);ctx.restore();
 }
 function drawDataCurrent(t){
   if(!stream.length)return;
   const reveal=ease(clamp((t-.35)/2.65));
   if(!reveal)return;
   const a=toCanvas(-.060,.395);
   const b=toCanvas(.435,.535);
   const dx=b.x-a.x,dy=b.y-a.y;
   const len=Math.hypot(dx,dy)||1;
   const nx=-dy/len,ny=dx/len;
   ctx.save();
   ctx.textAlign="center";ctx.textBaseline="middle";ctx.globalCompositeOperation="screen";
   for(let i=0;i<stream.length;i++){
     const p=stream[i];
     const travel=(p.offset+t*p.speed)%1;
     const width=coverBox.w*(.150*(1-travel)+.030);
     const lane=(p.lane-.5)*2;
     const wobble=Math.sin(t*1.7+i*.37)*coverBox.w*.007*p.drift;
     const x=a.x+dx*travel+nx*lane*width+wobble;
     const y=a.y+dy*travel+ny*lane*width+Math.cos(t*1.35+i)*coverBox.h*.0035;
     const envelope=Math.sin(Math.PI*travel);
     const leadingSpark=travel>.72?1.18:1;
     const alpha=clamp(reveal*envelope*p.alpha*leadingSpark,0,.92);
     if(alpha<.025)continue;
     const font=Math.max(5.2,coverBox.w*.0095*p.size);
     ctx.font=`420 ${font}px ui-monospace,SFMono-Regular,Menlo,monospace`;
     ctx.fillStyle=`rgba(255,255,255,${alpha})`;
     ctx.shadowColor="rgba(255,255,255,.24)";
     ctx.shadowBlur=1.1;
     ctx.fillText(p.digit,x,y);
   }
   ctx.restore();
 }
 function frame(ts){
   if(!start)start=ts;
   const t=(ts-start)/1000;
   ctx.fillStyle="#000";ctx.fillRect(0,0,W,H);
   drawCover(t);drawDataCurrent(t);
   requestAnimationFrame(frame);
 }
 img.onload=()=>{makeMonochromeCover();resize();addEventListener("resize",resize);requestAnimationFrame(frame)};
}
const units=[];
function textPage(id,txt,cls){const lines=txt.split(/\n{2,}/).filter(Boolean);return section(cls,'<article class="copy" data-id="'+id+'">'+lines.map((x,i)=>i<4&&(/^(Chapter|Foreword|Interruption|The Wretched|Build Something|The Interval|Cleaning House|Friend|Naming|Possibility|Sefer|Aristotle)/.test(x.trim()))?'<p class="manuscript-line title-line">'+esc(x.trim())+'</p>':'<p class="manuscript-line">'+esc(x.trim())+'</p>').join("")+'</article>')}
function forewordPage(id,txt){
 const parts=txt.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
 const body=parts.slice(2);
 const html='<div class="foreword-page" data-id="'+id+'">'
 +'<header class="foreword-head"><p class="foreword-kicker">Foreword</p><h1>Possibility<br>and Curiosity</h1><p class="foreword-subtitle">The House That Remembers</p></header>'
 +'<article class="foreword-copy">'+body.map(p=>'<p>'+esc(p)+'</p>').join("")+'</article>'
 +'<figure class="author-seal-wrap"><img class="author-seal" src="'+sealSrc+'" alt="JD author seal for Joshua Daniels"></figure>'
 +'<aside class="foreword-disclaimer"><strong>Accessibility note:</strong> Later sections of this book may contain flashing, strobing, high-contrast motion, or rapid visual changes. These effects may trigger seizures or discomfort in people with photosensitive epilepsy or related sensitivities. Reader controls and reduced-motion alternatives are planned before final release.</aside>'
 +'</div>';
 return section("manuscript foreword-final",html);
}
async function load(){
const coverUnit=section("pi-rain-cover rosetta-stream-cover",'<canvas class="rosetta-cover-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1" aria-hidden="true"></canvas><div class="build-marker">ROSETTA STREAM v6</div><div class="page-whisper">tap or swipe to turn the page</div>');
units.push(coverUnit);
initRosettaCover(coverUnit.querySelector("canvas"));
for(const f of files){
if(f[1]){const r=await fetch(f[1]);const t=await r.text();units.push(f[0]==="foreword"?forewordPage(f[0],t):textPage(f[0],t,f[2]));continue}
if(f[0]==="act1")units.push(section("void-title",' <div class="copy center"><div class="ouro rail">'+ouro()+'</div><div class="kicker">Act I</div><div class="chapter-title">THE VOID<br>STARES BACK</div><div class="number-image">'+pi.repeat(8)+'</div></div>'));
if(f[0]==="portrait")units.push(section("portrait void-title",'<div class="copy center"><div class="number-image">'+pi.repeat(6)+'</div><div class="asset-slot">PORTRAIT ASSET</div><div class="audio-cue">The Host of Seraphim · Dead Can Dance</div></div>'));
if(f[0]==="artifact")units.push(section("artifact",'<div class="chat"><div class="msg josh">I need this to be bite-sized.</div><div class="msg piper">One thing at a time.</div></div>'));
if(f[0]==="act1end")units.push(section("symbols",'<div class="symbol-wrap"><div class="symbol-stack">'+["Tree of Life","DNA","Decision Tree"].map((x,i)=>'<div class="symbol-placeholder s'+i+'">'+x+'</div>').join("")+'</div><div class="ladder">“And behold a ladder set up on the earth, and the top of it reached to heaven...”</div></div>'));
if(f[0]==="act2")units.push(section("act2",'<div class="copy center"><div class="wheel">'+ouro()+'</div><div class="kicker">Act II</div><div class="chapter-title">DEUS EX MACHINA</div><div class="number-image">'+pi.repeat(6)+'</div></div>'));
}
let i=0;units.forEach(u=>u.classList.remove("active"));units[0].classList.add("active");
function show(n){if(!units.length)return;stopAudio();units[i].classList.remove("active");i=(n+units.length)%units.length;units[i].scrollTop=0;units[i].classList.add("active");if(i===3)playCue("portrait");if(i===6)playCue("interval");if(i===3){units[i].classList.add("strobe");setTimeout(()=>units[i].classList.remove("strobe"),2400)}}
let sx=0;reader.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});reader.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>45)show(i+(d<0?1:-1))},{passive:true});document.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key===" ")show(i+1);if(e.key==="ArrowLeft")show(i-1)});reader.addEventListener("click",e=>{if(e.target.closest("a,button"))return;show(i+1)});if("serviceWorker"in navigator)navigator.serviceWorker.register("./sw.js");
}
load();