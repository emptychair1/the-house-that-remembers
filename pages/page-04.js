(()=>{
  function ready(fn){window.HouseBook?fn():window.addEventListener('house:ready',fn,{once:true})}
  ready(()=>{
    const d=document,w=window;if(d.getElementById('page-04-clean-controller'))return;
    const marker=d.createElement('meta');marker.id='page-04-clean-controller';d.head.appendChild(marker);
    function find(text){return [...d.querySelectorAll('.foreword p')].find(p=>p.textContent.includes(text))}
    function wrap(p,text,cls){
      if(!p)return null;
      const tw=d.createTreeWalker(p,NodeFilter.SHOW_TEXT);let n;
      while(n=tw.nextNode()){
        const i=n.nodeValue.indexOf(text);
        if(i>=0){const r=d.createRange(),s=d.createElement('span');r.setStart(n,i);r.setEnd(n,i+text.length);s.className='m4x '+cls;s.textContent=text;r.deleteContents();r.insertNode(s);return s}
      }
      return null;
    }
    const m4=wrap(find('M4 was an artificial intelligence'),'M4','tick');
    const co=wrap(find('produce questions'),'produce questions','compile');
    const ret=wrap(find('she returned to the subject'),'returned','return');
    const gl=wrap(find('That hit me differently'),'That hit me differently','glint');
    if(!m4||!co||!ret||!gl)return;
    const s=d.createElement('style');s.id='page-04-clean-style';s.textContent=`
      .m4x{position:relative;display:inline}.tick{display:inline-block!important;width:1.55em!important;white-space:nowrap;text-align:left;vertical-align:baseline}.compile{display:inline-block}.compile i,.return i{display:inline-block;font-style:normal}.compile.live i{animation:cmp .92s steps(5,end) var(--dl) both}.return.live i{animation:reg .9s cubic-bezier(.18,.8,.2,1) var(--dl) both}.glint.live{color:transparent;background:linear-gradient(105deg,#171513b8 0 34%,#fff 48%,#171513b8 61% 100%);background-size:250% 100%;background-position:120% 0;-webkit-background-clip:text;background-clip:text;animation:sweep 3.2s ease-in-out both}.spark{position:absolute;width:2px;height:2px;border-radius:50%;background:#171513c2;opacity:0}.spark:before,.spark:after{content:'';position:absolute;left:50%;top:50%;background:#171513c2;transform:translate(-50%,-50%)}.spark:before{width:.5rem;height:1px}.spark:after{width:1px;height:.5rem}.glint.live .spark{animation:spark 2.5s ease var(--sd) both}@keyframes cmp{0%{opacity:.15;transform:translateY(.18em) scale(.92);filter:blur(1.6px)}22%{opacity:.95;transform:translateY(-.08em) scale(1.06);filter:blur(.2px)}44%{opacity:.3;transform:translateY(.1em) scale(.96);filter:blur(1px)}68%{opacity:1;transform:translateY(-.03em) scale(1.03);filter:none}100%{opacity:1;transform:none;filter:none}}@keyframes reg{from{opacity:.08;transform:translate(var(--x),var(--y)) rotate(var(--r))}to{opacity:1;transform:none}}@keyframes sweep{to{background-position:-80% 0}}@keyframes spark{0%,100%{opacity:0;transform:scale(.2)}48%{opacity:1;transform:scale(1.3)}}.p3-current.m4current{display:block!important}.p3-current.m4current .p3-glyph{animation-duration:var(--fast)!important}.m4-number{position:fixed;left:50%;bottom:max(1.15rem,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:9500;font:600 .56rem/1 ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.18em;color:rgba(23,21,19,.48);pointer-events:none;display:none}.m4-number.show{display:block}
    `;d.head.appendChild(s);
    function split(el,reg){const t=el.textContent;el.textContent='';[...t].forEach((c,i)=>{const q=d.createElement('i');q.dataset.final=c;q.textContent=c===' '?'\u00a0':c;q.style.setProperty('--dl',i*.045+'s');if(reg){q.style.setProperty('--x',((i%3)-1)*9+'px');q.style.setProperty('--y',i%2?'-7px':'8px');q.style.setProperty('--r',((i%5)-2)*5+'deg')}el.appendChild(q)})}
    split(co);split(ret,1);
    [['left','-.68em','top','-.72em',180],['right','-.58em','top','-.62em',900],['right','-.62em','bottom','-.68em',1600]].forEach(a=>{const q=d.createElement('b');q.className='spark';q.style[a[0]]=a[1];q.style[a[2]]=a[3];q.style.setProperty('--sd',a[4]+'ms');gl.appendChild(q)});
    let cur=d.querySelector('.p3-current');
    if(!cur){cur=d.createElement('div');cur.className='p3-current';d.body.appendChild(cur)}
    const base=[...cur.querySelectorAll('.p3-glyph')],digits='314159';
    while(cur.children.length<52){const i=cur.children.length,q=(base[i%base.length]||d.createElement('span')).cloneNode(true);q.className='p3-glyph';q.textContent=digits[i%6];cur.appendChild(q)}
    [...cur.children].forEach((q,i)=>{q.style.setProperty('--fast',7.2+(i%7)*.55+'s');q.style.setProperty('--delay',-(i*.61%8)+'s');q.style.setProperty('--y',6+(i*31%86)+'%');q.style.setProperty('--a',.25+(i%6)*.03);q.style.setProperty('--s',(.38+(i%7)*.025)+'rem');q.style.setProperty('--dur',(7.2+(i%7)*.55)+'s')});
    const num=d.createElement('div');num.className='m4-number';num.textContent='| 04 |';d.body.appendChild(num);
    const sleep=n=>new Promise(r=>setTimeout(r,n)),CH='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789?/:.-π';
    async function ticker(){const t='M4',st=performance.now();await new Promise(done=>{function a(now){const k=Math.min(2,Math.floor((now-st)/170));let o='';for(let i=0;i<2;i++)o+=i<k?t[i]:CH[(Math.floor(now/55)+i*9)%CH.length];m4.textContent=o;if(k<2)requestAnimationFrame(a);else{m4.textContent=t;done()}}requestAnimationFrame(a)})}
    async function compileBeat(){const nodes=[...co.querySelectorAll('i')],end=nodes.map(n=>n.dataset.final),st=performance.now();await new Promise(done=>{function a(now){const elapsed=now-st;nodes.forEach((n,i)=>{if(end[i]===' '){n.textContent='\u00a0';return}const lock=Math.max(0,Math.min(1,(elapsed-i*38)/760));n.textContent=lock>.78?end[i]:CH[(Math.floor(now/58)+i*7)%CH.length]});if(elapsed<1450)requestAnimationFrame(a);else{nodes.forEach((n,i)=>n.textContent=end[i]===' '?'\u00a0':end[i]);done()}}requestAnimationFrame(a)});co.classList.add('live');await sleep(950);co.classList.remove('live')}
    async function go(){cur.classList.add('m4current','show');num.classList.add('show');await ticker();await sleep(650);await compileBeat();await sleep(500);ret.classList.add('live');await sleep(1750);ret.classList.remove('live');await sleep(550);gl.classList.add('live');await sleep(4200);gl.classList.remove('live')}
    function vis(){const r=m4.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth}
    let seen=0,done=0;function gate(t){if(done)return;if(vis()){cur.classList.add('show');num.classList.add('show');seen=seen||t;if(t-seen>=3000){done=1;go();return}}else{seen=0;num.classList.remove('show')}requestAnimationFrame(gate)}requestAnimationFrame(gate);
  })
})();
