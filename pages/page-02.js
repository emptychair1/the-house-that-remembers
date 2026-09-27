(()=>{
  function ready(fn){window.HouseBook?fn():window.addEventListener('house:ready',fn,{once:true})}
  ready(()=>{
    const d=document;
    if(d.getElementById('page-02-clean-controller'))return;
    const marker=d.createElement('meta');marker.id='page-02-clean-controller';d.head.appendChild(marker);
    function find(text){return [...d.querySelectorAll('.foreword p')].find(p=>p.textContent.includes(text))}
    function wrap(p,text,cls,html){
      if(!p)return null;
      const tw=d.createTreeWalker(p,NodeFilter.SHOW_TEXT);let n;
      while(n=tw.nextNode()){
        const i=n.nodeValue.indexOf(text);
        if(i>=0){const r=d.createRange(),s=d.createElement('span');r.setStart(n,i);r.setEnd(n,i+text.length);s.className=cls;s.innerHTML=html||text;r.deleteContents();r.insertNode(s);return s}
      }
      return null;
    }
    const diagP=find('We are beginning to see qualities emerge');
    const terms=[
      wrap(diagP,'Curiosity','p2-term','Curiosity'),
      wrap(diagP,'Attachment','p2-term','Attachment'),
      wrap(diagP,'self-reference','p2-term','self-reference'),
      wrap(diagP,'Preference','p2-term','Preference'),
      wrap(diagP,'Continuity','p2-term','Continuity'),
      wrap(diagP,'Something that resembles care','p2-care','Something that resembles care')
    ].filter(Boolean);
    const distP=find('I have not solved consciousness.');
    const fallP=find('But that may be the problem.');
    if(terms.length<6||!distP||!fallP)return;
    function letterize(p,cls){
      const text=p.textContent.trim();p.textContent='';p.classList.add(cls);p.setAttribute('aria-label',text);
      for(const word of text.split(' ')){const w=d.createElement('span');w.className=cls+'-word';for(const ch of word){const l=d.createElement('span');l.className=cls+'-letter';l.textContent=ch;w.appendChild(l)}p.appendChild(w);p.appendChild(d.createTextNode(' '))}
    }
    letterize(distP,'p2-distance');
    const fallText=fallP.textContent.trim();fallP.textContent='';fallP.classList.add('p2-fall');fallP.setAttribute('aria-label',fallText);
    [...fallText].forEach((ch,i)=>{const s=d.createElement('span');s.textContent=ch===' '?'\u00a0':ch;s.style.setProperty('--delay',(.04+(i%9)*.045)+'s');s.style.setProperty('--d',(.75+(i%7)*.08)+'s');s.style.setProperty('--x',(-14+(i*11%29))+'px');s.style.setProperty('--r',(-35+(i*17%70))+'deg');fallP.appendChild(s)});
    const style=d.createElement('style');style.id='page-02-clean-style';style.textContent=`
      .p2-term,.p2-care{position:relative;display:inline}.p2-term.p2-pulse,.p2-care.p2-pulse{animation:p2WordPulse var(--pulse,.35s) ease .02s both}@keyframes p2WordPulse{0%,100%{text-shadow:none}45%{text-shadow:.025em 0 rgba(23,21,19,.32),-.025em 0 rgba(23,21,19,.2)}}
      .p2-scan-layer{position:fixed;inset:0;z-index:9999;pointer-events:none}.p2-scan-frag{position:fixed;opacity:0;overflow:visible;animation:p2FragWake .05s ease forwards}.p2-scan-frag i{position:absolute;top:-8%;left:0;width:1px;height:116%;background:rgba(23,21,19,.72);box-shadow:0 0 .22rem rgba(23,21,19,.24);animation:p2FragSweep var(--fragdur,.2s) cubic-bezier(.22,.7,.18,1) var(--fragdelay,0s) forwards}@keyframes p2FragWake{to{opacity:1}}@keyframes p2FragSweep{0%{left:0;opacity:.15}15%{opacity:.9}85%{opacity:.9}100%{left:100%;opacity:0}}
      .p2-readout{position:fixed;left:50%;bottom:12.5vh;transform:translateX(-50%);z-index:9500;width:min(30rem,88vw);font:700 clamp(.46rem,1.7vw,.58rem)/1.45 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.09em;color:rgba(23,21,19,.66);white-space:pre;text-align:center;opacity:0;pointer-events:none}.p2-readout.live{opacity:1}.p2-readout span{display:block;min-height:.75em}.p2-care-line{font-size:.78rem;letter-spacing:.2em;opacity:.72}
      .p2-distance{position:relative;overflow:visible}.p2-distance-word{display:inline-flex;white-space:nowrap;align-items:baseline;gap:0;transition:gap 3.8s cubic-bezier(.22,.61,.18,1)}.p2-distance-letter{display:inline-block}.p2-distance.live{display:flex;flex-wrap:wrap;align-items:baseline;justify-content:center;width:100%;column-gap:.28em;row-gap:.12em}.p2-distance.live .p2-distance-word{gap:.19em}
      .p2-fall{position:relative;overflow:visible}.p2-fall span{display:inline}.p2-fall.live span{display:inline-block;animation:p2Fall var(--d) cubic-bezier(.45,.02,.8,.3) var(--delay) forwards}@keyframes p2Fall{to{transform:translate(var(--x),130px) rotate(var(--r));opacity:0}}
      .p2-glyph-layer{position:fixed;inset:0;z-index:9000;pointer-events:none;overflow:hidden;contain:layout paint;opacity:0}.p2-glyph-layer.live{opacity:1}.p2-glyph{position:absolute;left:-3.5rem;top:var(--y);font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:var(--size);line-height:1;color:rgba(23,21,19,var(--alpha));transform:translate3d(0,0,0) rotate(var(--r0));will-change:transform,opacity}.p2-glyph-layer.live .p2-glyph{animation:p2GlyphCross var(--dur) linear var(--delay) both}@keyframes p2GlyphCross{0%{transform:translate3d(-1rem,var(--dy0),0) rotate(var(--r0));opacity:0}7%{opacity:var(--alpha)}50%{transform:translate3d(50vw,var(--dy1),0) rotate(var(--r1));opacity:var(--alpha)}93%{opacity:var(--alpha)}100%{transform:translate3d(calc(100vw + 7rem),var(--dy2),0) rotate(var(--r2));opacity:0}}
      .p2-page-number{position:fixed;left:50%;bottom:max(1.15rem,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9500;font:600 .56rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;color:rgba(23,21,19,.48);pointer-events:none;display:none}.p2-page-number.show{display:block}
    `;d.head.appendChild(style);
    const scanLayer=d.createElement('div');scanLayer.className='p2-scan-layer';d.body.appendChild(scanLayer);
    const readout=d.createElement('div');readout.className='p2-readout';readout.innerHTML='<span class="k"></span><span class="s"></span><span class="c"></span><span class="p2-care-line"></span>';d.body.appendChild(readout);
    const glyph=d.createElement('div');glyph.className='p2-glyph-layer';const chars='314159';for(let i=0;i<18;i++){const g=d.createElement('span');g.className='p2-glyph';g.textContent=chars[i%chars.length];g.style.setProperty('--y',(84+(i*7%14))+'%');g.style.setProperty('--size',(.48+(i%5)*.06)+'rem');g.style.setProperty('--alpha',(.31+(i%6)*.03));g.style.setProperty('--dur',(8+(i%7)*1.9)+'s');g.style.setProperty('--delay',(i*.42)+'s');g.style.setProperty('--dy0','0px');g.style.setProperty('--dy1',(-8+(i*5%17))+'px');g.style.setProperty('--dy2',(-6+(i*7%13))+'px');g.style.setProperty('--r0',(-20+(i*9%40))+'deg');g.style.setProperty('--r1',(-10+(i*11%24))+'deg');g.style.setProperty('--r2',(-17+(i*13%34))+'deg');glyph.appendChild(g)}d.body.appendChild(glyph);
    const num=d.createElement('div');num.className='p2-page-number';num.textContent='| 02 |';d.body.appendChild(num);
    const sleep=ms=>new Promise(r=>setTimeout(r,ms));
    function visible(el){const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}
    function scan(term){scanLayer.replaceChildren();const rects=[...term.getClientRects()].filter(r=>r.width>1&&r.height>1);const n=Math.max(1,rects.length),slice=280/n;rects.forEach((r,i)=>{const f=d.createElement('span');f.className='p2-scan-frag';f.style.left=(r.left-2)+'px';f.style.top=(r.top-1)+'px';f.style.width=(r.width+4)+'px';f.style.height=(r.height+2)+'px';f.style.setProperty('--fragdur',slice+'ms');f.style.setProperty('--fragdelay',(i*slice)+'ms');f.innerHTML='<i></i>';scanLayer.appendChild(f)})}
    async function conduct(){num.classList.add('show');glyph.classList.add('live');for(let i=0;i<terms.length;i++){const t=terms[i];t.style.setProperty('--pulse',(i<4?400:650)+'ms');t.classList.add('p2-pulse');scan(t);readout.classList.add('live');readout.querySelector('.k').textContent='DIAGNOSTIC // '+(i===5?'CARE':'SIGNAL');readout.querySelector('.s').textContent='SIGNAL DETECTED';readout.querySelector('.c').textContent=i===5?'CLASSIFICATION: UNRESOLVED':'CLASSIFICATION: EMERGENT';readout.querySelector('.p2-care-line').textContent=i===5?'RESPONSE: CARE RESEMBLANCE FLAGGED':'';await sleep(i===5?1050:520);t.classList.remove('p2-pulse')}readout.classList.remove('live');scanLayer.replaceChildren();await sleep(350);distP.classList.add('live');await sleep(4300);fallP.classList.add('live');await sleep(1200);glyph.classList.remove('live')}
    let seen=0,done=0;function gate(t){if(done)return;if(terms.some(visible)||visible(distP)||visible(fallP)){num.classList.add('show');seen=seen||t;if(t-seen>=800){done=1;conduct();return}}else{seen=0;num.classList.remove('show')}requestAnimationFrame(gate)}requestAnimationFrame(gate);
  })
})();
