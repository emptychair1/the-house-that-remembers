(()=>{
  function ready(fn){window.HouseBook?fn():window.addEventListener('house:ready',fn,{once:true})}
  ready(()=>{
    const d=document;
    if(d.getElementById('page-01-clean-controller'))return;
    const marker=d.createElement('meta');marker.id='page-01-clean-controller';d.head.appendChild(marker);
    const fracture=d.querySelector('.answer-fracture');
    const glyphSvg=d.querySelector('.foreword-glyph-test');
    if(!fracture||!glyphSvg)return;
    const style=d.createElement('style');style.id='page-01-clean-style';style.textContent=`
      .answer-fracture{position:relative;display:inline-block}.answer-fracture::after{animation:none!important}.answer-fracture.p1-live::after{content:attr(data-ghost);position:absolute;inset:0;color:inherit;opacity:0;pointer-events:none;animation:p1AnswerRegistration 8.2s ease-in-out .15s 1 both!important}@keyframes p1AnswerRegistration{0%,14%,100%{opacity:0;transform:translate(0,0)}25%{opacity:.22;transform:translate(2px,-1px)}38%{opacity:.30;transform:translate(4px,-2px)}52%{opacity:.30;transform:translate(4px,-2px)}61%{opacity:.24;transform:translate(3px,1px)}69%{opacity:.28;transform:translate(4px,-1px)}78%{opacity:.16;transform:translate(2px,.5px)}90%{opacity:.04;transform:translate(.5px,0)}96%{opacity:0;transform:translate(0,0)}}
      .foreword-glyph-test.p1-live text{transform-box:fill-box;transform-origin:center;animation:p1GlyphDrift var(--p1dur,34s) ease-in-out var(--p1delay,0s) infinite alternate}.foreword-glyph-test.p1-live text:nth-child(2n){--p1dur:39s;--p1x:-5px;--p1y:4px}.foreword-glyph-test.p1-live text:nth-child(3n){--p1dur:31s;--p1x:4px;--p1y:-3px}.foreword-glyph-test.p1-live text:nth-child(5n){--p1dur:43s;--p1x:8px;--p1y:7px}@keyframes p1GlyphDrift{0%{transform:translate(0,0)}45%{transform:translate(var(--p1x,3px),var(--p1y,-2px))}100%{transform:translate(calc(var(--p1x,3px)*-.65),calc(var(--p1y,-2px)*.8))}}
      .p1-page-number{position:fixed;left:50%;bottom:max(1.15rem,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9500;font:600 .56rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;color:rgba(23,21,19,.48);pointer-events:none;display:none}.p1-page-number.show{display:block}
    `;d.head.appendChild(style);
    const num=d.createElement('div');num.className='p1-page-number';num.textContent='| 01 |';d.body.appendChild(num);
    function visible(el){const r=el.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}
    let seen=0,done=0;
    function fire(){fracture.classList.remove('p1-live');void fracture.offsetWidth;fracture.classList.add('p1-live');glyphSvg.classList.add('p1-live');num.classList.add('show')}
    function gate(t){if(done)return;if(visible(fracture)){num.classList.add('show');seen=seen||t;if(t-seen>=700){done=1;fire();return}}else{seen=0;num.classList.remove('show')}requestAnimationFrame(gate)}
    requestAnimationFrame(gate);
  })
})();
