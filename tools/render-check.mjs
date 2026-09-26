#!/usr/bin/env node
import http from 'node:http';
import path from 'node:path';
import { createReadStream, existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, devices } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const artifactDir = path.join(rootDir, '.render-check');
const strictBook = process.env.STRICT_BOOK === '1';
const expectTapAdvances = process.env.EXPECT_TAP_ADVANCES === '1';
const requestedUrl = process.env.BOOK_URL || '';
const expectedBuild = process.env.EXPECT_BUILD || 'BOOK FOREWORD v2';
const expectedPageCount = String(process.env.EXPECT_PAGE_COUNT || '32');

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav'
};

function serveFile(req, res) {
  try {
    const url = new URL(req.url, 'http://local-render-check.test');
    let pathname = decodeURIComponent(url.pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const filePath = path.resolve(rootDir, `.${pathname}`);
    if (!filePath.startsWith(rootDir)) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }
    if (!existsSync(filePath)) {
      res.writeHead(404);
      res.end(`Not found: ${pathname}`);
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      'content-type': mime[ext] || 'application/octet-stream',
      'cache-control': 'no-store, max-age=0'
    });
    createReadStream(filePath).pipe(res);
  } catch (err) {
    res.writeHead(500);
    res.end(String(err?.stack || err));
  }
}

function startServer() {
  return new Promise(resolve => {
    const server = http.createServer(serveFile);
    server.listen(0, '127.0.0.1', () => {
      resolve({ server, port: server.address().port });
    });
  });
}

function addCacheBuster(url) {
  const u = new URL(url);
  u.searchParams.set('renderCheck', String(Date.now()));
  return u.toString();
}

function assert(checks, ok, message, details = {}) {
  checks.push({ ok: Boolean(ok), message, details });
}

function summarizeChecks(checks) {
  const failed = checks.filter(c => !c.ok);
  const passed = checks.length - failed.length;
  console.log(`\nRender check: ${passed}/${checks.length} checks passed`);
  for (const c of checks) {
    const mark = c.ok ? '✓' : '✗';
    console.log(`${mark} ${c.message}`);
    if (!c.ok && Object.keys(c.details || {}).length) console.log(`  ${JSON.stringify(c.details, null, 2)}`);
  }
  return failed;
}

async function snapshot(page) {
  return page.evaluate(() => {
    const vv = window.visualViewport;
    const html = document.documentElement;
    const body = document.body;
    const reader = document.getElementById('reader');
    const facts = document.getElementById('render-facts');
    const all = [...document.querySelectorAll('*')];

    const rectOf = el => {
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        top: Math.round(r.top * 100) / 100,
        left: Math.round(r.left * 100) / 100,
        width: Math.round(r.width * 100) / 100,
        height: Math.round(r.height * 100) / 100,
        bottom: Math.round(r.bottom * 100) / 100,
        right: Math.round(r.right * 100) / 100
      };
    };

    const isVisible = el => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      return cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity || 1) !== 0 && r.width > 0 && r.height > 0 && r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
    };

    const pageNodes = [...document.querySelectorAll('.book-page,[data-book-page],.unit')].map((el, index) => ({
      index,
      tag: el.tagName.toLowerCase(),
      id: el.id || '',
      className: String(el.className || ''),
      dataPage: el.getAttribute('data-book-page') || '',
      active: el.classList.contains('active') || el.classList.contains('is-current'),
      visible: isVisible(el),
      rect: rectOf(el),
      overflowY: getComputedStyle(el).overflowY,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 260)
    }));

    const visibleScrollables = all
      .filter(el => {
        if (!isVisible(el)) return false;
        const cs = getComputedStyle(el);
        return /(auto|scroll)/.test(cs.overflowY) && el.scrollHeight > el.clientHeight + 4;
      })
      .slice(0, 30)
      .map(el => ({
        tag: el.tagName.toLowerCase(),
        id: el.id || '',
        className: String(el.className || ''),
        overflowY: getComputedStyle(el).overflowY,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        rect: rectOf(el),
        text: (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 140)
      }));

    const markers = [...document.querySelectorAll('.build-marker, [data-build], .debug-marker, .version-marker')]
      .filter(isVisible)
      .map(el => (el.innerText || el.getAttribute('data-build') || '').trim())
      .filter(Boolean);

    const bodyText = (document.body.innerText || '').replace(/\s+/g, ' ').trim();
    const visibleText = pageNodes.filter(p => p.visible || p.active).map(p => p.text).filter(Boolean).join(' | ');
    const forbiddenTerms = ['FLAT v2', 'PORTRAIT ASSET', 'One thing at a time', 'THE VOID', 'DEUS EX MACHINA', 'Sefer Yetzirah', 'Aristotle'];

    return {
      href: location.href,
      title: document.title,
      viewport: {
        innerWidth,
        innerHeight,
        devicePixelRatio,
        visualWidth: vv ? Math.round(vv.width * 100) / 100 : null,
        visualHeight: vv ? Math.round(vv.height * 100) / 100 : null
      },
      document: {
        scrollX,
        scrollY,
        htmlClientHeight: html.clientHeight,
        htmlScrollHeight: html.scrollHeight,
        bodyClientHeight: body.clientHeight,
        bodyScrollHeight: body.scrollHeight,
        htmlOverflowY: getComputedStyle(html).overflowY,
        bodyOverflowY: getComputedStyle(body).overflowY,
        bodyPosition: getComputedStyle(body).position
      },
      reader: reader ? {
        exists: true,
        rect: rectOf(reader),
        overflowY: getComputedStyle(reader).overflowY,
        position: getComputedStyle(reader).position,
        scrollHeight: reader.scrollHeight,
        clientHeight: reader.clientHeight
      } : { exists: false },
      facts: facts ? { ...facts.dataset } : {},
      flipEngine: html.dataset.flipEngine || '',
      htmlBookPage: html.dataset.bookPage || '',
      pageNodes,
      bookPages: pageNodes.filter(p => p.className.includes('book-page')),
      visiblePages: pageNodes.filter(p => p.visible),
      activePages: pageNodes.filter(p => p.active),
      visibleScrollables,
      markers,
      visibleText,
      forbiddenVisibleText: forbiddenTerms.filter(term => visibleText.includes(term)),
      forbiddenBodyText: forbiddenTerms.filter(term => bodyText.includes(term))
    };
  });
}

async function main() {
  await mkdir(artifactDir, { recursive: true });
  let server;
  let url = requestedUrl;
  if (!url) {
    const local = await startServer();
    server = local.server;
    url = `http://127.0.0.1:${local.port}/`;
  }
  url = addCacheBuster(url);

  const browser = await chromium.launch({ headless: true });
  try {
    const iPhone = devices['iPhone 14 Pro'] || {
      viewport: { width: 393, height: 852 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      defaultBrowserType: 'chromium'
    };
    const context = await browser.newContext({
      ...iPhone,
      reducedMotion: 'reduce',
      ignoreHTTPSErrors: true
    });
    const page = await context.newPage();
    const consoleLines = [];
    page.on('console', msg => consoleLines.push({ type: msg.type(), text: msg.text() }).slice(-80));

    console.log(`Opening ${url}`);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
    await page.waitForLoadState('networkidle', { timeout: 9000 }).catch(() => {});
    await page.waitForTimeout(1500);

    const before = await snapshot(page);
    const beforePath = path.join(artifactDir, 'iphone-before.png');
    await page.screenshot({ path: beforePath, fullPage: false });

    await page.evaluate(() => window.scrollTo(0, 160));
    await page.waitForTimeout(140);
    const afterForcedScroll = await snapshot(page);

    let afterRightTap = null;
    let afterLeftTap = null;
    try {
      await page.mouse.click(Math.round(before.viewport.innerWidth * 0.86), Math.round(before.viewport.innerHeight * 0.52));
      await page.waitForTimeout(1100);
      afterRightTap = await snapshot(page);
      const afterPath = path.join(artifactDir, 'iphone-after-right-tap.png');
      await page.screenshot({ path: afterPath, fullPage: false });

      await page.mouse.click(Math.round(before.viewport.innerWidth * 0.14), Math.round(before.viewport.innerHeight * 0.52));
      await page.waitForTimeout(1100);
      afterLeftTap = await snapshot(page);
    } catch (err) {
      afterRightTap = { interactionError: String(err?.message || err) };
    }

    const checks = [];
    assert(checks, before.reader.exists, 'reader element exists');
    assert(checks, before.markers.includes(expectedBuild), 'visible build marker matches expected build', { expectedBuild, markers: before.markers });
    assert(checks, before.facts.build === expectedBuild, 'render facts expose expected build', before.facts);
    assert(checks, before.facts.surface === 'root-pwa', 'render facts identify root PWA surface', before.facts);
    assert(checks, before.facts.pageCount === expectedPageCount, 'clean surface exposes expected page count', { expectedPageCount, facts: before.facts });
    assert(checks, before.bookPages.length === Number(expectedPageCount), 'DOM contains expected .book-page count', { expectedPageCount, actual: before.bookPages.length });
    assert(checks, before.flipEngine === 'stpageflip' || !strictBook, 'StPageFlip initialized in strict mode', { flipEngine: before.flipEngine });
    assert(checks, before.document.htmlOverflowY === 'hidden' && before.document.bodyOverflowY === 'hidden', 'html/body vertical overflow is hidden', before.document);
    assert(checks, before.document.htmlScrollHeight <= before.viewport.innerHeight + 8, 'document is not taller than viewport', before.document);
    assert(checks, afterForcedScroll.document.scrollY === 0, 'forced window scroll remains locked at 0', { scrollY: afterForcedScroll.document.scrollY });
    assert(checks, before.reader.rect && Math.abs(before.reader.rect.height - before.viewport.innerHeight) <= 8, 'reader height matches viewport', before.reader);
    assert(checks, before.visibleScrollables.length === 0, 'no visible nested scroll containers', before.visibleScrollables);
    assert(checks, before.forbiddenVisibleText.length === 0, 'visible page does not contain old scaffold text', before.forbiddenVisibleText);
    if (strictBook) {
      assert(checks, before.forbiddenBodyText.length === 0, 'strict mode: old scaffold text is absent from full DOM', before.forbiddenBodyText);
    }
    if (expectTapAdvances && afterRightTap && !afterRightTap.interactionError) {
      assert(checks, afterRightTap.facts.currentPage === '1' || afterRightTap.htmlBookPage === '1' || afterRightTap.visibleText !== before.visibleText, 'right-edge tap advances from cover to first page', {
        beforePage: before.facts.currentPage || before.htmlBookPage,
        afterPage: afterRightTap.facts.currentPage || afterRightTap.htmlBookPage,
        beforeText: before.visibleText,
        afterText: afterRightTap.visibleText
      });
    }
    if (expectTapAdvances && afterLeftTap && !afterLeftTap.interactionError) {
      assert(checks, afterLeftTap.facts.currentPage === '0' || afterLeftTap.htmlBookPage === '0', 'left-edge tap returns to cover', {
        afterPage: afterLeftTap.facts.currentPage || afterLeftTap.htmlBookPage
      });
    }

    const report = {
      generatedAt: new Date().toISOString(),
      url,
      strictBook,
      expectTapAdvances,
      expectedBuild,
      expectedPageCount,
      artifacts: {
        beforeScreenshot: path.relative(rootDir, beforePath),
        afterRightTapScreenshot: '.render-check/iphone-after-right-tap.png',
        report: '.render-check/render-check-report.json'
      },
      consoleLines,
      before,
      afterForcedScroll,
      afterRightTap,
      afterLeftTap,
      checks
    };
    await writeFile(path.join(artifactDir, 'render-check-report.json'), JSON.stringify(report, null, 2));

    console.log('\nSnapshot:');
    console.log(JSON.stringify({
      url: before.href,
      viewport: before.viewport,
      markers: before.markers,
      facts: before.facts,
      flipEngine: before.flipEngine,
      bookPages: before.bookPages.length,
      visiblePages: before.visiblePages.slice(0, 6).map(p => ({ dataPage: p.dataPage, text: p.text })),
      scrollHeight: before.document.htmlScrollHeight,
      visibleScrollables: before.visibleScrollables.length,
      afterRightTapPage: afterRightTap && !afterRightTap.interactionError ? (afterRightTap.facts.currentPage || afterRightTap.htmlBookPage) : afterRightTap
    }, null, 2));

    console.log(`\nArtifacts written to ${path.relative(rootDir, artifactDir)}/`);
    console.log('- .render-check/iphone-before.png');
    console.log('- .render-check/iphone-after-right-tap.png');
    console.log('- .render-check/render-check-report.json');

    const failed = summarizeChecks(checks);
    if (failed.length) process.exitCode = 1;
  } finally {
    await browser.close();
    if (server) server.close();
  }
}

main().catch(err => {
  console.error(err?.stack || err);
  process.exit(1);
});
