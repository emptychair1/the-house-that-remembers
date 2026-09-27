/* The House That Remembers — Page Controller v1.0
   Clean-page boundary after frozen legacy Pages 1–3.
   One page = one owner. Mechanics never decide page entry. Selectors never escape root.
*/
window.HousePageController = (() => {
  const sleep=ms=>new Promise(r=>setTimeout(r,Math.max(0,ms||0)));
  function create({root,rootSelector,entryDelayMs=3000,activeClass='active',mechanics=window.HouseMechanics,onError=console.error}={}){
    const page=root||(rootSelector&&document.querySelector(rootSelector));
    if(!page)throw Error('HousePageController requires a page root');
    if(!mechanics)throw Error('HousePageController requires HouseMechanics');
    let started=false,running=false,completed=false,cancelled=false;
    const $=selector=>{const el=page.querySelector(selector);if(!el)throw Error('Page-scoped target not found: '+selector);return el};
    const isActive=()=>page.classList.contains(activeClass);
    const waitUntilActive=()=>new Promise(resolve=>{if(isActive())return resolve();const observer=new MutationObserver(()=>{if(isActive()){observer.disconnect();resolve()}});observer.observe(page,{attributes:true,attributeFilter:['class']})});
    async function run(score=[]){if(started)return;started=true;await waitUntilActive();await sleep(entryDelayMs);if(!isActive()||cancelled){started=false;return}running=true;try{for(const cue of score){if(cancelled||!isActive())break;const target=typeof cue.target==='string'?$(cue.target):cue.target;if(cue.waitBeforeMs)await sleep(cue.waitBeforeMs);await mechanics.runBeat(cue.mechanic,target,cue.options||{});if(cue.waitAfterMs)await sleep(cue.waitAfterMs)}completed=!cancelled&&isActive()}catch(err){onError(err)}finally{running=false}}
    function cancel(){cancelled=true}
    return Object.freeze({root:page,$,run,cancel,isActive,get state(){return Object.freeze({started,running,completed,cancelled})}})
  }
  return Object.freeze({version:'1.0',create});
})();
