(() => {
  const BUILD = 'LEGACY V226 DISABLED → V231';
  const TARGET = './?v=book-foreword-v231b-no-v226-phone&legacy-v226-killed=' + Date.now();

  function badge(text) {
    try {
      let el = document.getElementById('legacy-v226-kill-badge');
      if (!el) {
        el = document.createElement('div');
        el.id = 'legacy-v226-kill-badge';
        el.style.cssText = [
          'position:fixed',
          'left:12px',
          'bottom:112px',
          'z-index:2147483647',
          'color:#fff',
          'background:rgba(80,0,0,.88)',
          'border:1px solid rgba(255,255,255,.45)',
          'padding:6px 8px',
          'font:700 10px/1.2 ui-monospace,SFMono-Regular,Menlo,monospace',
          'letter-spacing:.12em',
          'text-transform:uppercase',
          'pointer-events:none'
        ].join(';');
        document.body.appendChild(el);
      }
      el.textContent = text;
    } catch (_) {}
  }

  async function cleanOldShell() {
    badge(BUILD);
    try {
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(key => caches.delete(key)));
      }
    } catch (_) {}
    try {
      if ('serviceWorker' in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(reg => reg.unregister()));
      }
    } catch (_) {}
  }

  cleanOldShell().finally(() => {
    try {
      const params = new URLSearchParams(location.search);
      if (!params.has('legacy-v226-killed')) location.replace(TARGET);
    } catch (_) {}
  });
})();
