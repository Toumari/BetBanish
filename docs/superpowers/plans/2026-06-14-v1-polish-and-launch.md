# Gambling Blocker v1 — Polish & Launch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the overlay and options page to feel visually polished, then complete the Chrome Web Store assets so the extension can be submitted.

**Architecture:** Visual changes are isolated to `overlay.css`, `content.js` (HTML markup only), and `options.html`/`options.js`. No new dependencies. `calculateLosses` is exported from `content.js` behind a module guard so it can be unit tested in Jest — the same pattern already used by `sites.js`.

**Tech Stack:** Vanilla JS, CSS, Chrome MV3 (Manifest V3), Jest 29 (existing test runner)

---

## File Map

| File | Change |
|------|--------|
| `content.js` | Add `<span id="gambling-blocker-eyebrow">` to markup; wrap chrome call in guard; add `module.exports` |
| `overlay.css` | Full redesign — eyebrow, card, table column highlight, button, footer, responsive |
| `options.html` | Full redesign — card layout, background, typography, input/button polish, feedback element |
| `options.js` | Add `showFeedback()` helper; call it on add and remove |
| `store-listing.md` | Replace privacy policy URL placeholder |
| `tests/content.test.js` | New — unit tests for `calculateLosses` |

---

## Task 1: Export `calculateLosses` from `content.js` for testing

**Files:**
- Modify: `content.js`

- [ ] **Step 1: Add the chrome guard and module exports to the bottom of `content.js`**

Replace the current last block:

```js
chrome.storage.sync.get({ disabledDefaults: [], customSites: [] }, data => {
  if (isGamblingSite(window.location.hostname, data.disabledDefaults, data.customSites)) {
    if (!sessionStorage.getItem('__gambling_blocker_dismissed__')) {
      injectOverlay();
    }
  }
});
```

With:

```js
if (typeof chrome !== 'undefined') {
  chrome.storage.sync.get({ disabledDefaults: [], customSites: [] }, data => {
    if (isGamblingSite(window.location.hostname, data.disabledDefaults, data.customSites)) {
      if (!sessionStorage.getItem('__gambling_blocker_dismissed__')) {
        injectOverlay();
      }
    }
  });
}

if (typeof module !== 'undefined') module.exports = { calculateLosses, buildTableRows };
```

- [ ] **Step 2: Commit**

```bash
git add content.js
git commit -m "feat: export calculateLosses for testing, guard chrome API call"
```

---

## Task 2: Write and pass unit tests for `calculateLosses`

**Files:**
- Create: `tests/content.test.js`

- [ ] **Step 1: Create `tests/content.test.js` with these tests**

```js
const { calculateLosses } = require('../content');

test('weekly total is daily × 7', () => {
  expect(calculateLosses(10).week).toBe(70);
});

test('monthly total is daily × 30.4 rounded', () => {
  expect(calculateLosses(10).month).toBe(304);
});

test('yearly total is daily × 365', () => {
  expect(calculateLosses(10).year).toBe(3650);
});

test('all fields correct for £1/day', () => {
  expect(calculateLosses(1)).toEqual({ week: 7, month: 30, year: 365 });
});

test('all fields correct for £50/day (highest preset)', () => {
  expect(calculateLosses(50)).toEqual({ week: 350, month: 1520, year: 18250 });
});
```

- [ ] **Step 2: Run the tests**

```bash
npm test
```

Expected output:
```
PASS  tests/sites.test.js
PASS  tests/content.test.js

Test Suites: 2 passed, 2 total
Tests:       13 passed, 13 total
```

- [ ] **Step 3: Commit**

```bash
git add tests/content.test.js
git commit -m "test: add unit tests for calculateLosses"
```

---

## Task 3: Redesign the overlay — CSS

**Files:**
- Modify: `overlay.css`

- [ ] **Step 1: Replace the entire contents of `overlay.css` with**

```css
#gambling-blocker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.88);
  z-index: 2147483647;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 16px;
  box-sizing: border-box;
}

#gambling-blocker-card {
  background: #fff;
  border-radius: 16px;
  padding: 44px 40px 36px;
  max-width: 580px;
  width: 100%;
  text-align: center;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.55);
}

#gambling-blocker-eyebrow {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: #c00;
  text-transform: uppercase;
  margin-bottom: 10px;
}

#gambling-blocker-card h2 {
  font-size: 1.65rem;
  font-weight: 700;
  color: #111;
  margin: 0 0 28px;
  line-height: 1.3;
}

#gambling-blocker-card table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 24px;
}

#gambling-blocker-card th {
  background: #f5f5f5;
  padding: 10px 14px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  text-align: right;
}

#gambling-blocker-card th:first-child {
  text-align: left;
}

#gambling-blocker-card th:last-child {
  color: #c00;
}

#gambling-blocker-card td {
  padding: 10px 14px;
  border-top: 1px solid #eee;
  font-size: 1rem;
  color: #111;
  text-align: right;
}

#gambling-blocker-card td:first-child {
  text-align: left;
  font-weight: 600;
}

#gambling-blocker-card td:last-child {
  color: #c00;
  font-weight: 600;
}

#gambling-blocker-card tr:hover td {
  background: #fff8f0;
}

#gambling-blocker-card p {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  margin: 0 0 24px;
}

#gambling-blocker-btn {
  display: block;
  width: 100%;
  margin: 0 0 20px;
  padding: 14px 28px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: inherit;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  background: #f7f7f7;
  color: #aaa;
  cursor: not-allowed;
  transition: background 0.2s, color 0.2s, border-color 0.2s;
  letter-spacing: 0.01em;
}

#gambling-blocker-btn:not([disabled]) {
  border-color: #c00;
  background: #fff;
  color: #c00;
  cursor: pointer;
}

#gambling-blocker-btn:not([disabled]):hover {
  background: #c00;
  color: #fff;
}

#gambling-blocker-card footer {
  font-size: 0.8rem;
  color: #999;
  border-top: 1px solid #eee;
  padding-top: 16px;
}

#gambling-blocker-card footer a {
  color: #666;
  text-decoration: underline;
}

@media (max-width: 480px) {
  #gambling-blocker-card {
    padding: 32px 20px 24px;
    border-radius: 12px;
  }

  #gambling-blocker-card h2 {
    font-size: 1.3rem;
  }

  #gambling-blocker-card th,
  #gambling-blocker-card td {
    padding: 8px 8px;
    font-size: 0.9rem;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add overlay.css
git commit -m "design: redesign overlay card, table, button, and responsive layout"
```

---

## Task 4: Add eyebrow element to overlay markup

**Files:**
- Modify: `content.js`

- [ ] **Step 1: In `injectOverlay()`, add `<span id="gambling-blocker-eyebrow">Pause</span>` as the first child of the card**

Replace:

```js
  container.innerHTML = `
    <div id="gambling-blocker-card">
      <h2>Before you gamble, consider this.</h2>
```

With:

```js
  container.innerHTML = `
    <div id="gambling-blocker-card">
      <span id="gambling-blocker-eyebrow">Pause</span>
      <h2>Before you gamble, consider this.</h2>
```

- [ ] **Step 2: Run tests to confirm nothing broke**

```bash
npm test
```

Expected: all 13 tests pass.

- [ ] **Step 3: Manual smoke test**

Open Chrome → `chrome://extensions` → Load unpacked → select the project folder. Visit `https://bet365.com`. Confirm:
- Dark overlay appears
- "PAUSE" eyebrow renders in small red caps above the headline
- Yearly column header and values are red
- Button is grey/disabled for 10 seconds, then turns red/clickable
- Works at narrow width (use DevTools → Toggle device toolbar → set width to 375px)

- [ ] **Step 4: Commit**

```bash
git add content.js
git commit -m "design: add eyebrow label to overlay card"
```

---

## Task 5: Redesign the options page

**Files:**
- Modify: `options.html`

- [ ] **Step 1: Replace the entire contents of `options.html` with**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Gambling Blocker — Settings</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 480px;
      margin: 0 auto;
      padding: 40px 20px 60px;
      color: #111;
      background: #f7f7f7;
    }
    h1 {
      font-size: 1.05rem;
      font-weight: 700;
      margin: 0 0 20px;
    }
    .card {
      background: #fff;
      border-radius: 12px;
      padding: 20px 20px 4px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      margin-bottom: 16px;
    }
    h2 {
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #aaa;
      margin: 0 0 4px;
      font-weight: 600;
    }
    .site-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 0;
      border-bottom: 1px solid #f0f0f0;
    }
    .site-row:last-child { border-bottom: none; }
    .site-row label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    .remove-btn {
      background: none;
      border: none;
      color: #ccc;
      cursor: pointer;
      font-size: 1rem;
      padding: 0 2px;
      line-height: 1;
      transition: color 0.15s;
    }
    .remove-btn:hover { color: #c00; }
    .add-row {
      display: flex;
      gap: 8px;
      padding: 16px 0 8px;
    }
    .add-row input {
      flex: 1;
      padding: 9px 12px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      font-size: 0.9rem;
      font-family: inherit;
      outline: none;
      transition: border-color 0.15s;
    }
    .add-row input:focus { border-color: #111; }
    .add-row button {
      padding: 9px 18px;
      background: #111;
      color: #fff;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 500;
      font-family: inherit;
      transition: background 0.15s;
    }
    .add-row button:hover { background: #333; }
    #feedback {
      font-size: 0.8rem;
      color: #2a7c45;
      min-height: 1.4em;
      padding-bottom: 16px;
      margin: 0;
    }
  </style>
</head>
<body>
  <h1>Gambling Blocker</h1>

  <div class="card">
    <h2>Blocked Sites</h2>
    <div id="default-sites"></div>
  </div>

  <div class="card">
    <h2>Your Custom Sites</h2>
    <div id="custom-sites"></div>
    <div class="add-row">
      <input id="new-site" type="text" placeholder="e.g. mybookies.com">
      <button id="add-btn">Add</button>
    </div>
    <p id="feedback"></p>
  </div>

  <script src="sites.js"></script>
  <script src="options.js"></script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```bash
git add options.html
git commit -m "design: redesign options page with card layout and polished inputs"
```

---

## Task 6: Add inline feedback to options page

**Files:**
- Modify: `options.js`

- [ ] **Step 1: Replace the entire contents of `options.js` with**

```js
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showFeedback(message) {
  const el = document.getElementById('feedback');
  if (!el) return;
  el.textContent = message;
  setTimeout(() => { el.textContent = ''; }, 2500);
}

function renderDefaultSites(disabledDefaults) {
  const container = document.getElementById('default-sites');
  container.innerHTML = DEFAULT_SITES.map(site => `
    <div class="site-row">
      <label>
        <input type="checkbox" data-site="${escapeHtml(site)}" ${disabledDefaults.includes(site) ? '' : 'checked'}>
        ${escapeHtml(site)}
      </label>
    </div>
  `).join('');

  container.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      chrome.storage.sync.get({ disabledDefaults: [] }, data => {
        const site = cb.dataset.site;
        let updated = [...data.disabledDefaults];
        if (cb.checked) {
          updated = updated.filter(s => s !== site);
        } else if (!updated.includes(site)) {
          updated.push(site);
        }
        chrome.storage.sync.set({ disabledDefaults: updated });
      });
    });
  });
}

function renderCustomSites(customSites) {
  const container = document.getElementById('custom-sites');
  container.innerHTML = customSites.length
    ? customSites.map(site => `
        <div class="site-row">
          <span style="font-size:0.9rem">${escapeHtml(site)}</span>
          <button class="remove-btn" title="Remove">✕</button>
        </div>
      `).join('')
    : '<p style="font-size:0.85rem;color:#aaa;padding:8px 0 4px">No custom sites added yet.</p>';

  const buttons = container.querySelectorAll('.remove-btn');
  customSites.forEach((site, i) => {
    buttons[i].addEventListener('click', () => {
      chrome.storage.sync.get({ customSites: [] }, data => {
        const updated = data.customSites.filter(s => s !== site);
        chrome.storage.sync.set({ customSites: updated }, () => {
          renderCustomSites(updated);
          showFeedback('Site removed.');
        });
      });
    });
  });
}

document.getElementById('add-btn').addEventListener('click', () => {
  const input = document.getElementById('new-site');
  const site = input.value.trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*/, '')
    .replace(/^www\./, '');
  if (!site) return;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}$/.test(site)) return;
  chrome.storage.sync.get({ customSites: [] }, data => {
    if (data.customSites.includes(site)) return;
    const updated = [...data.customSites, site];
    chrome.storage.sync.set({ customSites: updated }, () => {
      renderCustomSites(updated);
      input.value = '';
      showFeedback('Site added.');
    });
  });
});

document.getElementById('new-site').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-btn').click();
});

chrome.storage.sync.get({ disabledDefaults: [], customSites: [] }, data => {
  renderDefaultSites(data.disabledDefaults);
  renderCustomSites(data.customSites);
});
```

- [ ] **Step 2: Run all tests to confirm nothing is broken**

```bash
npm test
```

Expected: all 13 tests pass (options.js has no unit tests — it's verified manually below).

- [ ] **Step 3: Manual smoke test**

Open the options page via `chrome://extensions` → Gambling Blocker → Extension options. Confirm:
- Page has a light grey background with white cards
- Adding a site shows "Site added." in green beneath the input for ~2.5 seconds then clears
- Removing a custom site shows "Site removed." the same way
- Empty custom sites state shows "No custom sites added yet."

- [ ] **Step 4: Commit**

```bash
git add options.js
git commit -m "feat: add inline feedback on site add and remove"
```

---

## Task 7: Fill in the store listing privacy policy URL

**Files:**
- Modify: `store-listing.md`

- [ ] **Step 1: Push the repo to GitHub if you haven't already**

```bash
git remote add origin https://github.com/<your-username>/gambling-blocker.git
git push -u origin master
```

- [ ] **Step 2: Enable GitHub Pages**

Go to your repo on GitHub → Settings → Pages → Source: Deploy from a branch → Branch: `master` → Folder: `/ (root)` → Save.

Wait ~60 seconds. Your privacy policy will be live at:
`https://<your-username>.github.io/gambling-blocker/privacy.html`

- [ ] **Step 3: In `store-listing.md`, replace the placeholder line**

Replace:
```
[Your GitHub Pages URL here — e.g. https://yourusername.github.io/gambling-blocker/privacy.html]
```

With:
```
https://<your-username>.github.io/gambling-blocker/privacy.html
```

- [ ] **Step 4: Commit**

```bash
git add store-listing.md
git commit -m "docs: fill in privacy policy URL for store listing"
git push
```

---

## Task 8: Capture store screenshots (manual)

**No files changed — this is a manual capture task.**

- [ ] **Step 1: Reload the extension**

Go to `chrome://extensions` → find Gambling Blocker → click the refresh icon.

- [ ] **Step 2: Capture the overlay screenshot**

1. Open a new tab and navigate to `https://www.bet365.com`
2. The overlay will appear (if you've previously dismissed it, open an Incognito window: `Ctrl+Shift+N`)
3. Open DevTools: `F12`
4. Press `Ctrl+Shift+P` → type `Capture full size screenshot` → Enter
5. Save the file as `screenshots/overlay.png`

- [ ] **Step 3: Capture the options page screenshot**

1. Go to `chrome://extensions` → Gambling Blocker → Extension options
2. Open DevTools on the options page: right-click the page → Inspect
3. Press `Ctrl+Shift+P` → `Capture full size screenshot` → Enter
4. Save as `screenshots/options.png`

- [ ] **Step 4: Commit the screenshots**

```bash
mkdir screenshots
git add screenshots/overlay.png screenshots/options.png
git commit -m "assets: add Chrome Web Store screenshots"
git push
```

---

## Submission checklist

Before submitting to the Chrome Web Store:

- [ ] `npm test` passes with 13 tests
- [ ] Overlay looks polished on bet365.com (test in Incognito)
- [ ] Options page card layout looks correct
- [ ] Add/remove feedback messages work
- [ ] Privacy policy URL in `store-listing.md` is a live GitHub Pages link
- [ ] Two screenshots saved to `screenshots/`
- [ ] All changes pushed to GitHub
