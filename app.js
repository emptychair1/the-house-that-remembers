const reader=document.getElementById("reader");
const coverSrc="https://raw.githubusercontent.com/emptychair1/the-house-that-remembers/main/assets/source/IMG_3301.png";
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
function esc(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function section(cls,html){const e=document.createElement("section");e.className="unit "+cls;e.innerHTML=html;reader.appendChild(e);return e}
function ouro(){return '<svg viewBox="0 0 200 200" aria-label="Ouroboros"><circle cx="100" cy="100" r="72" fill="none" stroke="currentColor" stroke-width="12"/><circle cx="100" cy="100" r="54" fill="none" stroke="currentColor" stroke-width="10"/><circle cx="155" cy="100" r="8" fill="currentColor"/></svg>'}
function piDigits(){return pi.repeat(9).slice(0,720).split("").map((d,i)=>{
const a=i*.61803398875;
const finalX=50+Math.cos(a*6.283)*((i%29)/29)*38;
const finalY=50+Math.sin(a*6.283)*((i%37)/37)*46;
const fromX=50+Math.cos(a*19.4)*120;
const fromY=50+Math.sin(a*13.7)*120;
const depth=(i%17)/16;
const delay=(i%120)*.018;
return '<span style="--fx:'+finalX.toFixed(2)+'%;--fy:'+finalY.toFixed(2)+'%;--sx:'+fromX.toFixed(2)+'%;--sy:'+fromY.toFixed(2)+'%;--z:'+depth.toFixed(2)+';--d:'+delay.toFixed(3)+'s">'+esc(d)+'</span>'
}).join("")}
const units=[];
function textPage(id,txt,cls){const lines=txt.split(/\n{2,}/).filter(Boolean);return section(cls,'<article class="copy" data-id="'+id+'">'+lines.map((x,i)=>i<4&&(/^(Chapter|Foreword|Interruption|The Wretched|Build Something|The Interval|Cleaning House|Friend|Naming|Possibility|Sefer|Aristotle)/.test(x.trim()))?'<p class="manuscript-line title-line">'+esc(x.trim())+'</p>':'<p class="manuscript-line">'+esc(x.trim())+'</p>').join("")+'</article>')}
async function load(){
units.push(section("cover-manifest",'<div class="pi-mist" aria-hidden="true">'+piDigits()+'</div><div class="cover-orbit" aria-hidden="true"></div><figure class="cover-target"><img src="'+coverSrc+'" alt="The House That Remembers cover"></figure><div class="cover-title"><div class="kicker">A living reader proof</div><h1>THE HOUSE<br>THAT REMEMBERS</h1><p>Joshua Daniels</p></div><div class="page-whisper">tap or swipe to turn the page</div>'));
for(const f of files){
if(f[1]){const r=await fetch(f[1]);const t=await r.text();units.push(textPage(f[0],t,f[2]));continue}
if(f[0]==="act1")units.push(section("void-title",' <div class="copy center"><div class="ouro rail">'+ouro()+'</div><div class="kicker">Act I</div><div class="chapter-title">THE VOID<br>STARES BACK</div><div class="number-image">'+pi.repeat(8)+'</div></div>'));
if(f[0]==="portrait")units.push(section("portrait void-title",'<div class="copy center"><div class="number-image">'+pi.repeat(6)+'</div><div class="asset-slot">PORTRAIT ASSET</div><div class="audio-cue">The Host of Seraphim · Dead Can Dance</div></div>'));
if(f[0]==="artifact")units.push(section("artifact",'<div class="chat"><div class="msg josh">I need this to be bite-sized.</div><div class="msg piper">One thing at a time.</div></div>'));
if(f[0]==="act1end")units.push(section("symbols",'<div class="symbol-wrap"><div class="symbol-stack">'+["Tree of Life","DNA","Decision Tree"].map((x,i)=>'<div class="symbol-placeholder s'+i+'">'+x+'</div>').join("")+'</div><div class="ladder">“And behold a ladder set up on the earth, and the top of it reached to heaven...”</div></div>'));
if(f[0]==="act2")units.push(section("act2",'<div class="copy center"><div class="wheel">'+ouro()+'</div><div class="kicker">Act II</div><div class="chapter-title">DEUS EX MACHINA</div><div class="number-image">'+pi.repeat(6)+'</div></div>'));
}
let i=0;units.forEach(u=>u.classList.remove("active"));units[0].classList.add("active");
function show(n){if(!units.length)return;stopAudio();units[i].classList.remove("active");i=(n+units.length)%units.length;units[i].classList.add("active");if(i===3)playCue("portrait");if(i===6)playCue("interval");if(i===3){units[i].classList.add("strobe");setTimeout(()=>units[i].classList.remove("strobe"),2400)}}
let sx=0;reader.addEventListener("touchstart",e=>sx=e.touches[0].clientX,{passive:true});reader.addEventListener("touchend",e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>45)show(i+(d<0?1:-1))},{passive:true});document.addEventListener("keydown",e=>{if(e.key==="ArrowRight"||e.key===" ")show(i+1);if(e.key==="ArrowLeft")show(i-1)});reader.addEventListener("click",e=>{if(e.target.closest("a,button"))return;show(i+1)});if("serviceWorker"in navigator)navigator.serviceWorker.register("/sw.js");
}
load();