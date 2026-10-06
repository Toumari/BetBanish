// Development-only screenshot scenes using the shipped UI and example data.
// Run: node store-assets/render-preview.cjs
// Capture /shot/pause, /shot/popup and /shot/settings at 1280 x 800.
// Capture /promo-tile.html at 440 x 280. This renderer is excluded from the package.
const http = require('http');
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const fixture = `<script>
const sampleSettings = {disabledDefaults: [], customSites: []};
const sampleReminder = {personalReminder: "I'm saving for a holiday."};
function demoStorage(values) { return {
 get(defaults, callback) { const result = {...defaults, ...values}; if (callback) callback(result); return Promise.resolve(result); },
 set(value, callback) { Object.assign(values, value); if (callback) callback(); return Promise.resolve(); }
}; }
window.chrome = {storage: {sync: demoStorage(sampleSettings), local: demoStorage(sampleReminder)},
 tabs: {query: async () => [{url:'https://www.example.com'}]},
 runtime: {sendMessage(message, callback) { callback({ok:false}); }, openOptionsPage: async () => { location.href='/ui/options.html'; }}
};
</script>`;

const scenes = {
  pause: {
    headline: 'A pause.<br>A choice.<br>A way out.',
    description: 'Your reminder. Ten seconds to think.<br>Leave whenever you’re ready.',
    note: 'On 65+ UK betting sites. Add your own, too.',
    surface: '<iframe class="pause-ui" src="/ui/overlay" title="BetBanish pause screen"></iframe>'
  },
  popup: {
    headline: 'Know what’s<br>covered.',
    description: 'Check site coverage from the toolbar.<br>Add a pause with one click.',
    note: 'Your settings, always within reach.',
    surface: '<div class="popup-frame"><iframe src="/ui/popup.html" title="BetBanish toolbar popup"></iframe></div><p class="surface-caption">The BetBanish toolbar popup</p>'
  },
  settings: {
    headline: 'Your reason.<br>In your words.',
    description: 'Choose a reminder that matters to you.<br>See it when you need a moment to pause.',
    note: 'Your reminder stays on this device.',
    surface: '<div class="settings-frame"><iframe src="/ui/options.html" title="BetBanish settings"></iframe></div>'
  }
};

function scene(name) {
  const entry = scenes[name];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>BetBanish ${name} screenshot</title>
  <style>
    * {box-sizing:border-box}
    body {width:1280px;height:800px;margin:0;overflow:hidden;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:oklch(22% .009 25);color:oklch(97% .006 65)}
    .copy {position:absolute;left:64px;top:62px;width:505px;height:676px}
    header {display:flex;align-items:center;gap:13px;font-size:25px;font-weight:700;letter-spacing:-.7px}
    header img {width:42px;height:42px}
    h1 {font-size:64px;line-height:1.06;letter-spacing:-2.8px;font-weight:700;margin:94px 0 30px}
    .description {font-size:21px;line-height:1.55;color:oklch(84% .008 65);margin:0;letter-spacing:-.2px}
    .note {position:absolute;bottom:0;margin:0;color:oklch(72% .008 65);font-size:15px;line-height:1.5}
    .surface {position:absolute;left:626px;top:0;width:654px;height:800px}
    iframe {border:0;display:block}
    .pause-ui {width:640px;height:872px;transform:scale(.88);transform-origin:top left;position:absolute;top:16px;left:20px}
    .popup-frame {position:absolute;left:66px;top:64px;width:425px;height:675px;border-radius:16px;overflow:hidden;box-shadow:0 18px 60px oklch(10% .008 25 / .35)}
    .popup-frame iframe {width:340px;height:540px;transform:scale(1.25);transform-origin:top left}
    .surface-caption {position:absolute;left:66px;top:742px;width:425px;text-align:center;color:oklch(72% .008 65);font-size:13px;margin:0}
    .settings-frame {position:absolute;left:18px;top:42px;width:542px;height:716px;border-radius:16px;overflow:hidden;box-shadow:0 18px 60px oklch(10% .008 25 / .35)}
    .settings-frame iframe {width:480px;height:634px;transform:scale(1.13);transform-origin:top left}
    .popup h1,.settings h1 {margin-top:130px}
  </style></head><body class="${name}"><section class="copy"><header><img src="/icons/icon48.png" alt="">BetBanish</header><h1>${entry.headline}</h1><p class="description">${entry.description}</p><p class="note">${entry.note}</p></section><section class="surface">${entry.surface}</section></body></html>`;
}

const allowed = ['promo-tile.html','options.html','options.js','popup.html','popup.js','popup.css','sites.js','content.js','overlay.css','icons/icon48.png'];
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  res.setHeader('Cache-Control', 'no-store');
  const galleryFile = url.pathname.replace('/assets/', '');
  if (url.pathname.startsWith('/assets/') && ['preview.html', '01-pause-screen.jpg', '02-toolbar-popup.jpg', '03-reminder-settings.jpg', '04-promo-tile.jpg'].includes(galleryFile)) {
    res.setHeader('Content-Type', galleryFile.endsWith('.jpg') ? 'image/jpeg' : 'text/html; charset=utf-8');
    return res.end(fs.readFileSync(path.join(__dirname, 'v1.1', galleryFile)));
  }
  if (url.pathname.startsWith('/shot/')) {
    const name = url.pathname.slice(6);
    if (!scenes[name]) { res.writeHead(404); return res.end(); }
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(scene(name));
  }
  if (url.pathname === '/ui/overlay') {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    return res.end(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/overlay.css"><title>BetBanish pause</title></head><body style="margin:0;background:oklch(22% .009 25)">${fixture}<script src="/sites.js"></script><script src="/content.js"></script><script>injectOverlay(sampleReminder.personalReminder);</script></body></html>`);
  }
  const relative = url.pathname.replace(/^\/ui\//, '').replace(/^\//, '');
  if (!allowed.includes(relative)) { res.writeHead(404); return res.end(); }
  const ext = path.extname(relative);
  res.setHeader('Content-Type', ({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png'})[ext]);
  let data = fs.readFileSync(path.join(root, relative));
  if (['options.html','popup.html'].includes(relative)) data = data.toString().replace('<script src="sites.js">', fixture + '<script src="sites.js">');
  res.end(data);
});
server.listen(4180, '127.0.0.1', () => console.log(`Store screenshots: http://127.0.0.1:4180/shot/pause (PID ${process.pid})`));
