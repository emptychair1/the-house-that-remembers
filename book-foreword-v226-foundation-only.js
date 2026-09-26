(() => {
  const FOUNDATION_BUILD = 'BOOK FOUNDATION ONLY v226 for v231E';
  const PI_DIGITS = '3141592653589793238462643383279502884197169399375105820974944592307816406286208998628034825342117067982148086513282306647093844609550582231725359408128481117450284102701938521105559644622948954930381964428810975665933446128475648233786783165271201909145648566923460348610454326648213393607260249141273';

  const facts = () => document.getElementById('render-facts');
  const setFact = (name, value) => { const el = facts(); if (el) el.dataset[name] = String(value); };

  let crawlFrame = 0;

  function pageRectFor(svg) {
    const page = svg.closest('.book-page') || svg.parentElement;
    const reader = document.getElementById('reader');
    const root = document.querySelector('.book-root');
    const pageRect = page?.getBoundingClientRect?.();
    const readerRect = reader?.getBoundingClientRect?.();
    const rootRect = root?.getBoundingClientRect?.();
    const width = Math.round(
      (pageRect && pageRect.width > 120 ? pageRect.width : 0) ||
      (page && page.clientWidth > 120 ? page.clientWidth : 0) ||
      (rootRect && rootRect.width > 120 ? rootRect.width : 0) ||
      (readerRect && readerRect.width > 120 ? readerRect.width : 0) ||
      innerWidth
    );
    const height = Math.round(
      (pageRect && pageRect.height > 240 ? pageRect.height : 0) ||
      (page && page.clientHeight > 240 ? page.clientHeight : 0) ||
      (rootRect && rootRect.height > 240 ? rootRect.height : 0) ||
      (readerRect && readerRect.height > 240 ? readerRect.height : 0) ||
      innerHeight
    );
    return { width, height };
  }

  function drawMeasuredPerimeter(svg, index) {
    const { width, height } = pageRectFor(svg);
    if (width < 120 || height < 240) return;
    const prev = svg.dataset.edgeSize || '';
    const next = `${width}x${height}`;
    if (svg.classList.contains('v226-edge-crawl') && prev === next) return;

    const edge = Math.max(10, Math.round(Math.min(width, height) * 0.024));
    const left = edge;
    const top = edge;
    const right = Math.max(edge + 10, width - edge);
    const bottom = Math.max(edge + 10, height - edge);
    const id = `foundation-edge-${index}-${width}-${height}`.replace(/[^a-zA-Z0-9_-]/g, '-');
    const digits = `${PI_DIGITS}${PI_DIGITS}${PI_DIGITS}`;
    const symbols = Array(260).fill('π').join(' ');

    svg.classList.remove('v221-full-perimeter', 'v222-edge-crawl', 'v223-edge-crawl', 'v224-edge-crawl', 'v225-edge-crawl');
    svg.classList.add('v226-edge-crawl');
    svg.dataset.edgeSize = next;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.setAttribute('preserveAspectRatio', 'none');
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.innerHTML = `
      <defs>
        <path id="${id}-symbols" d="M ${left} ${top} H ${right} V ${bottom} H ${left} V ${top}"></path>
        <path id="${id}-digits" d="M ${right} ${top} V ${bottom} H ${left} V ${top} H ${right}"></path>
      </defs>
      <text class="pi-symbol-thread"><textPath class="v226-crawl-forward" href="#${id}-symbols" startOffset="0%">${symbols}</textPath></text>
      <text class="pi-digit-thread"><textPath class="v226-crawl-reverse" href="#${id}-digits" startOffset="52%">${digits}</textPath></text>
    `;
  }

  function upgradeMarginalia() {
    document.querySelectorAll('.pi-marginalia').forEach((svg, index) => drawMeasuredPerimeter(svg, index));
  }

  function startCrawl() {
    if (crawlFrame) cancelAnimationFrame(crawlFrame);
    const origin = performance.now();
    const tick = now => {
      const elapsed = now - origin;
      document.querySelectorAll('.v226-crawl-forward').forEach((path, index) => {
        path.setAttribute('startOffset', `${((elapsed * 0.0026 + index * 5) % 100).toFixed(2)}%`);
      });
      document.querySelectorAll('.v226-crawl-reverse').forEach((path, index) => {
        path.setAttribute('startOffset', `${(100 - ((elapsed * 0.0022 + 52 + index * 3) % 100)).toFixed(2)}%`);
      });
      crawlFrame = requestAnimationFrame(tick);
    };
    crawlFrame = requestAnimationFrame(tick);
  }

  function boot() {
    setFact('foundationOnly', FOUNDATION_BUILD);
    upgradeMarginalia();
    startCrawl();
    setTimeout(upgradeMarginalia, 160);
    setTimeout(upgradeMarginalia, 520);
    setTimeout(upgradeMarginalia, 1200);
    addEventListener('resize', () => requestAnimationFrame(upgradeMarginalia), { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
