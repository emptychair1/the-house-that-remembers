const reader=document.getElementById("reader");
const coverSrc="./assets/source/IMG_3301.png";
const sealSrc="./assets/seals/474C63C0-32CC-407D-9FCA-1BECE724CB3E.png";
const files=[
["foreword","manuscript/FOREWORD.md","foreword"],
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
const TITLE_RE=/^(Chapter|Foreword|Interruption|The Wretched|Build Something|The Interval|Cleaning House|Friend|Naming|Possibility|Sefer|Aristotle)/;
function esc(s){return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function section(cls,html,label){
 const e=document.createElement("section");
 e.className="unit "+cls;
 e.innerHTML=html;
 if(label)e.dataset.folioLabel=label;
 reader.appendChild(e);
 return e;
}
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
function splitLongParagraph(p,maxChars){
 if(p.length<=maxChars*1.08||TITLE_RE.test(p.trim()))return [p];
 const sentences=p.match(/[^.!?]+[.!?]+[\)”’"]*|.+$/g)||[p];
 const out=[];let cur="";
 sentences.forEach(s=>{
   const next=(cur?cur+" ":"")+s.trim();
   if(cur&&next.length>maxChars*.82){out.push(cur);cur=s.trim()}else{cur=next}
 });
 if(cur)out.push(cur);
 return out;
}
function splitIntoPages(paras,maxChars){
 const softened=paras.flatMap(p=>splitLongParagraph(p,maxChars));
 const pages=[];
 let cur=[],count=0;
 softened.forEach(p=>{
   const weight=p.replace(/\s+/g," ").length+90;
   if(cur.length&&count+weight>maxChars){pages.push(cur);cur=[];count=0}
   cur.push(p);count+=weight;
 });
 if(cur.length)pages.push(cur);
 return pages.length?pages:[[]];
}
function makeFolio(label,index,total){
 const n=String(index).padStart(2,"0");
 return '<div class="book-folio" aria-hidden="true"><span>'+n+'</span><span>'+esc(label||"")+'</span></div>';
}
function decorateFolios(){
 const numbered=units.filter(u=>!u.classList.contains("pi-rain-cover"));
 numbered.forEach((u,idx)=>u.insertAdjacentHTML("beforeend",makeFolio(u.dataset.folioLabel||"",idx+1,numbered.length)));
}
function textPages(id,txt,cls,label){
 const paras=txt.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
 const max=cls==="piper"?760:cls==="manuscript"?850:820;
 const chunks=splitIntoPages(paras,max);
 return chunks.map((chunk,pageIndex)=>{
   const html='<article class="copy paged-copy" data-id="'+id+'" data-page="'+(pageIndex+1)+'">'+chunk.map((x,i)=>{
     const isTitle=(pageIndex===0&&i<4&&TITLE_RE.test(x.trim()));
     return '<p class="manuscript-line '+(isTitle?'title-line':'')+'">'+esc(x.trim())+'</p>';
   }).join("")+'</article>';
   return section(cls+" paginated-page",html,label);
 });
}
function forewordPages(id,txt){
 const parts=txt.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
 const body=parts.slice(2);
 const chunks=splitIntoPages(body,640);
 const pages=chunks.map((chunk,pageIndex)=>{
   const isFirst=pageIndex===0;
   const html='<div class="foreword-page" data-id="'+id+'" data-page="'+(pageIndex+1)+'">'
   +(isFirst?'<header class="foreword-head"><p class="foreword-kicker">Foreword</p><h1>Possibility<br>and Curiosity</h1><p class="foreword-subtitle">The House That Remembers</p></header>':'')
   +'<article class="foreword-copy '+(isFirst?'first-page':'')+'">'+chunk.map(p=>'<p>'+esc(p)+'</p>').join("")+'</article>'
   +'</div>';
   return section("manuscript foreword-final paginated-page",html,"Foreword");
 });
 const sealPage='<div class="foreword-page seal-page" data-id="'+id+'-seal"><figure class="author-seal-wrap"><img class="author-seal" src="'+sealSrc+'" alt="JD author seal for Joshua Daniels"></figure><aside class="foreword-disclaimer"><strong>Accessibility note:</strong> Later sections of this book may contain flashing, strobing, high-contrast motion, or rapid visual changes. These effects may trigger seizures or discomfort in people with photosensitive epilepsy or related sensitivities. Reader controls and reduced-motion alternatives are planned before final release.</aside></div>';
 pages.push(section("manuscript foreword-final author-seal-page paginated-page",sealPage,"Foreword"));
 return pages;
}
async function load(){
 const coverUnit=section("pi-rain-cover rosetta-stream-cover",'<canvas class="rosetta-cover-canvas" style="position:absolute;inset:0;width:100%;height:100%;display:block;z-index:1" aria-hidden="true"></canvas><div class="build-marker">ROSETTA STREAM v6</div><div class="page-whisper">tap anywhere to turn the page</div>');
 units.push(coverUnit);
 initRosettaCover(coverUnit.querySelector("canvas"));
 for(const f of files){
   if(f[1]){
     const r=await fetch(f[1],{cache:"no-store"});
     const t=await r.text();
     const made=f[0]==="foreword"?forewordPages(f[0],t):textPages(f[0],t,f[2],f[0].replace(/chapter/,"Chapter "));
     units.push(...made);
     continue;
   }
   if(f[0]==="act1")units.push(section("void-title paginated-page",' <div class="copy center"><div class="ouro rail">'+ouro()+'</div><div class="kicker">Act I</div><div class="chapter-title">THE VOID<br>STARES BACK</div><div class="number-image">'+pi.repeat(8)+'</div></div>',"Act I"));
   if(f[0]==="portrait")units.push(section("portrait void-title paginated-page",'<div class="copy center"><div class="number-image">'+pi.repeat(6)+'</div><div class="asset-slot">PORTRAIT ASSET</div><div class="audio-cue">The Host of Seraphim · Dead Can Dance</div></div>',"Portrait"));
   if(f[0]==="artifact")units.push(section("artifact paginated-page",'<div class="chat"><div class="msg josh">I need this to be bite-sized.</div><div class="msg piper">One thing at a time.</div></div>',"Artifact"));
   if(f[0]==="act1end")units.push(section("symbols paginated-page",'<div class="symbol-wrap"><div class="symbol-stack">'+["Tree of Life","DNA","Decision Tree"].map((x,i)=>'<div class="symbol-placeholder s'+i+'">'+x+'</div>').join("")+'</div><div class="ladder">“And behold a ladder set up on the earth, and the top of it reached to heaven...”</div></div>',"Sequence"));
   if(f[0]==="act2")units.push(section("act2 paginated-page",'<div class="copy center"><div class="wheel">'+ouro()+'</div><div class="kicker">Act II</div><div class="chapter-title">DEUS EX MACHINA</div><div class="number-image">'+pi.repeat(6)+'</div></div>',"Act II"));
 }
 decorateFolios();
 let i=0;
 units.forEach(u=>u.classList.remove("active"));
 units[0].classList.add("active");
 function show(n){
   if(!units.length)return;
   stopAudio();
   units[i].classList.remove("active");
   i=(n+units.length)%units.length;
   units[i].classList.add("active");
   if(units[i].classList.contains("portrait"))playCue("portrait");
   if(units[i].querySelector('[data-id="chapter3"]'))playCue("interval");
   if(units[i].classList.contains("portrait")){units[i].classList.add("strobe");setTimeout(()=>units[i].classList.remove("strobe"),2400)}
 }
 let sx=0,sy=0,moved=false;
 reader.addEventListener("touchstart",e=>{const t=e.touches[0];sx=t.clientX;sy=t.clientY;moved=false},{passive:true});
 reader.addEventListener("touchmove",e=>{const t=e.touches[0];if(Math.abs(t.clientX-sx)>14||Math.abs(t.clientY-sy)>14)moved=true},{passive:true});
 reader.addEventListener("touchend",e=>{
   const t=e.changedTouches[0];
   const dx=t.clientX-sx;
   const dy=t.clientY-sy;
   if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){show(i+(dx<0?1:-1));return}
   if(!moved)show(i+1);
 },{passive:true});
 document.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key===" "||e.key==="PageDown")show(i+1);if(e.key==="ArrowLeft"||e.key==="PageUp")show(i-1)});
 reader.addEventListener("click",e=>{if(e.target.closest("a,button"))return;show(i+1)});
}
load();
