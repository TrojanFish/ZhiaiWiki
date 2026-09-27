import { spawn } from 'child_process';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const tempProfile = 'C:\\Users\\Administrator\\AppData\\Local\\Temp\\edge_cdp_profile_' + Math.floor(Math.random() * 10000);

const edgeProc = spawn(edgePath, [
  '--headless=new',
  '--remote-debugging-port=9222',
  '--user-data-dir=' + tempProfile,
  '--no-first-run',
  '--no-default-browser-check',
  'about:blank'
]);

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function getWsUrl() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch('http://localhost:9222/json/new?http://localhost:3000/?consent=1', { method: 'PUT' });
      const data = await res.json();
      if (data && data.webSocketDebuggerUrl) return data.webSocketDebuggerUrl;
    } catch {
      await wait(300);
    }
  }
  throw new Error('Failed to get WebSocket debugger URL');
}

async function run() {
  try {
    const wsUrl = await getWsUrl();
    const ws = new WebSocket(wsUrl);
    
    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const msgId = id++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', handler);
            resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await new Promise(r => ws.onopen = r);

    // Emulate iPhone 12/13/14 (390 x 844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    });

    await send('Page.navigate', { url: 'http://localhost:3000/?consent=1' });
    await wait(3000);

    // Evaluate in page
    const expr = `
      (() => {
        const vw = window.innerWidth;
        const bodySw = document.body.scrollWidth;
        const htmlSw = document.documentElement.scrollWidth;
        
        const heroSection = document.querySelector('section');
        const statsBanner = heroSection ? heroSection.nextElementSibling : null;
        const workflowSection = document.getElementById('workflow');
        
        function getInfo(el, name) {
          if (!el) return null;
          const r = el.getBoundingClientRect();
          const s = window.getComputedStyle(el);
          return {
            name,
            tag: el.tagName,
            left: r.left,
            right: r.right,
            width: r.width,
            paddingLeft: s.paddingLeft,
            paddingRight: s.paddingRight,
            marginLeft: s.marginLeft,
            marginRight: s.marginRight
          };
        }
        
        // Find elements that touch or exceed the right edge (right >= 380)
        const nearRightEdge = [];
        document.querySelectorAll('*').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.right >= 385 && r.width < 500 && r.top < 1500) {
            nearRightEdge.push({
              tag: el.tagName,
              className: (el.className || '').toString().slice(0, 60),
              left: Math.round(r.left),
              right: Math.round(r.right),
              width: Math.round(r.width),
              text: (el.innerText || '').slice(0, 30).replace(/\\n/g, ' ')
            });
          }
        });
        
        return {
          vw,
          bodySw,
          htmlSw,
          hero: getInfo(heroSection, 'hero'),
          stats: getInfo(statsBanner, 'stats'),
          workflow: getInfo(workflowSection, 'workflow'),
          nearRightEdge: nearRightEdge.slice(0, 20)
        };
      })()
    `;

    const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
    console.log('=== INSPECTION DATA ===');
    console.log(JSON.stringify(res.result.value, null, 2));

    ws.close();
  } catch (err) {
    console.error('Inspection error:', err);
  } finally {
    edgeProc.kill();
  }
}

run();
