/* The House That Remembers — House Mechanics Library v0.2
   Canonical mechanics only. The library records discoveries; it does not predict them.

   ASCII_ENGINE — substrate shared by proven ASCII grammars.
   ORGANIC_FIELD — ambient life / emergence outside the prose.
   GLYPH_CURRENT — directional glyph flow, proven by Rosetta.
   DIAGNOSTIC — observation without epistemic certainty.
*/
window.HouseMechanics = (() => {
  const PI = '31415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679';
  const TICKER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?/:.-π';
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const hash=(x,y,salt=0)=>{const s=Math.sin((x*127.1)+(y*311.7)+(salt*74.7))*43758.5453123;return s-Math.floor(s)};

  const ASCII_ENGINE = Object.freeze({
    name:'ASCII_ENGINE',
    role:'substrate',
    meaning:'shared character-based rendering substrate; meaning belongs to grammars, not the engine',
    defaultGlyphSource:PI,
    contract:'Own deterministic glyph sources, seeded variation, placement, scale, opacity/luminance, motion inputs, and rendering primitives. Do not encode narrative meaning here.'
  });

  function makeAsciiGlyphs({count,source=PI,seed=0,factory}={}){
    const n=Math.max(0,Math.floor(count||0));
    return Array.from({length:n},(_,i)=>{
      const base={
        index:i,
        glyph:source[i%source.length],
        seed,
        rand:(salt=0)=>hash(i,seed,salt)
      };
      return factory?Object.assign(base,factory(base)):base;
    });
  }

  const ORGANIC_FIELD = Object.freeze({
    name:'ORGANIC_FIELD',
    engine:ASCII_ENGINE.name,
    meaning:'ambient life / emergence outside the prose',
    glyphSource:PI,
    fieldOpacity:0.5,
    residentMotion:'small local drift',
    wandererMotion:'slow long excursions',
    topology:'colonies; sparse; non-uniform',
    contract:'Do not turn the field into a border, marching line, uniform current, or decorative screensaver.'
  });

  const GLYPH_CURRENT = Object.freeze({
    name:'GLYPH_CURRENT',
    engine:ASCII_ENGINE.name,
    canonicalSpecimen:'Rosetta',
    meaning:'directional ASCII flow through space',
    countRule:'responsive field population',
    lane:'seeded lateral position across a narrowing path',
    travel:'seeded offset plus individual speed',
    motion:'directional travel + perpendicular lane displacement + individual wobble',
    envelope:'sin(pi * travel)',
    rendering:'monochrome additive/screen glyph rendering with restrained glow',
    contract:'The current owns glyph flow only. Rosetta-specific cover treatment, image breathing, reveal timing, and authored trajectory remain composition-level choices.'
  });

  function makeGlyphCurrent({count,source=PI,seed=0}={}){
    return makeAsciiGlyphs({count,source,seed,factory:({rand})=>({
      lane:rand(1),
      offset:rand(2),
      speed:.045+rand(3)*.060,
      drift:(rand(4)-.5)*2,
      size:.78+rand(5)*.62,
      alpha:.34+rand(6)*.56
    })});
  }

  function glyphCurrentPosition(g,t,{a,b,startWidth=.150,endWidth=.030,wobbleScale=.007}={}){
    if(!a||!b)throw new Error('GLYPH_CURRENT requires path endpoints a and b');
    const travel=(g.offset+t*g.speed)%1;
    const dx=b.x-a.x,dy=b.y-a.y,len=Math.hypot(dx,dy)||1;
    const nx=-dy/len,ny=dx/len;
    const pathScale=Math.hypot(dx,dy);
    const width=pathScale*(startWidth*(1-travel)+endWidth);
    const lane=(g.lane-.5)*2;
    const wobble=Math.sin(t*1.7+g.index*.37)*pathScale*wobbleScale*g.drift;
    return {
      travel,
      x:a.x+dx*travel+nx*lane*width+wobble,
      y:a.y+dy*travel+ny*lane*width,
      envelope:Math.sin(Math.PI*travel),
      leadingIntensity:travel>.72?1.18:1
    };
  }

  const DIAGNOSTIC = Object.freeze({
    name:'DIAGNOSTIC',
    meaning:'observation without epistemic certainty',
    scan:Object.freeze({delayMs:1200,durationMs:1450}),
    wakeMs:2450,
    signal:Object.freeze({text:'SIGNAL DETECTED',delayMs:2450,step:34,settle:2,jitter:0}),
    classification:Object.freeze({text:'CLASSIFICATION: UNRESOLVED',delayMs:3300,step:58,settle:3,jitter:9}),
    clearMs:7200,
    contract:'Detection resolves decisively. Interpretation searches longer. Minimal monochrome machinery; graceful rather than aggressive.'
  });

  function ticker(el,target,{delay=0,step=42,settle=2,jitter=0,chars=TICKER_CHARS}={}){
    const out=Array(target.length).fill(' ');
    let locked=0;
    const start=performance.now()+delay;
    function frame(now){
      if(now<start){requestAnimationFrame(frame);return}
      const elapsed=now-start;
      locked=Math.min(target.length,Math.floor(elapsed/(step*settle)));
      for(let i=0;i<target.length;i++){
        if(i<locked||target[i]===' '||target[i]===':')out[i]=target[i];
        else{const n=Math.floor(now/(step+jitter))+i*7;out[i]=chars[n%chars.length]}
      }
      el.textContent=out.join('');
      if(locked<target.length)requestAnimationFrame(frame);else el.textContent=target;
    }
    requestAnimationFrame(frame);
  }

  function runDiagnostic({signalEl,classificationEl,specimenEl,signal=DIAGNOSTIC.signal,classification=DIAGNOSTIC.classification,clearMs=DIAGNOSTIC.clearMs}={}){
    if(!signalEl||!classificationEl||!specimenEl)throw new Error('DIAGNOSTIC requires signalEl, classificationEl, and specimenEl');
    const now=performance.now();
    ticker(signalEl,signal.text,{delay:Math.max(0,signal.delayMs-DIAGNOSTIC.wakeMs),step:signal.step,settle:signal.settle,jitter:signal.jitter});
    ticker(classificationEl,classification.text,{delay:Math.max(0,classification.delayMs-DIAGNOSTIC.wakeMs),step:classification.step,settle:classification.settle,jitter:classification.jitter});
    setTimeout(()=>specimenEl.classList.add('clear'),Math.max(0,clearMs-DIAGNOSTIC.wakeMs));
    return {startedAt:now,mechanic:DIAGNOSTIC.name};
  }

  return Object.freeze({
    version:'0.2',
    ASCII_ENGINE,ORGANIC_FIELD,GLYPH_CURRENT,DIAGNOSTIC,
    makeAsciiGlyphs,makeGlyphCurrent,glyphCurrentPosition,ticker,runDiagnostic
  });
})();
