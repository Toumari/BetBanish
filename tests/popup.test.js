/** @jest-environment jsdom */
const { storageArea, loadPage, runScript, settle } = require('./helpers/browser');

async function openPopup(url, settings = {}) {
  loadPage('popup.html');
  global.chrome = {
    tabs: { query: jest.fn().mockResolvedValue([{ id: 7, url }]) },
    storage: { sync: storageArea(settings), local: storageArea() },
    runtime: { openOptionsPage: jest.fn().mockResolvedValue() }
  };
  runScript('sites.js', 'popup.js');
  await settle();
}

afterEach(() => { delete global.chrome; });

test('shows coverage on default sites without an add button', async () => {
  await openPopup('https://www.bet365.com');
  expect(document.getElementById('site-name').textContent).toBe('bet365.com');
  expect(document.getElementById('site-status').textContent).toBe('Pause enabled for this site');
  expect(document.getElementById('add-site').hidden).toBe(true);
});

test('adds a current site and persists its normalized hostname only', async () => {
  await openPopup('https://WWW.EXAMPLE.COM/private?value=secret');
  document.getElementById('add-site').click();
  await settle();
  expect(chrome.storage.sync.values.customSites).toEqual(['example.com']);
  expect(document.getElementById('add-site').hidden).toBe(true);
  expect(document.getElementById('feedback').textContent).toContain('Reload');
});

test('re-enables a disabled default instead of adding a duplicate', async () => {
  await openPopup('https://m.bet365.com', { disabledDefaults: ['bet365.com'], customSites: [] });
  document.getElementById('add-site').click();
  await settle();
  expect(chrome.storage.sync.values).toEqual({ disabledDefaults: [], customSites: [] });
});

test.each(['chrome://extensions', 'file:///notes.txt', 'about:blank', 'https://chromewebstore.google.com/detail/test'])
('does not offer to add a restricted page: %s', async url => {
  await openPopup(url);
  expect(document.getElementById('add-site').hidden).toBe(true);
  expect(document.getElementById('site-name').textContent).toBe('Open a website');
});

test('storage failure keeps the add action available and does not claim success', async () => {
  await openPopup('https://example.com');
  chrome.storage.sync.set.mockRejectedValueOnce(new Error('Quota exceeded'));
  document.getElementById('add-site').click();
  await settle();
  expect(document.getElementById('add-site').disabled).toBe(false);
  expect(document.getElementById('add-site').hidden).toBe(false);
  expect(document.getElementById('feedback').dataset.error).toBe('true');
});
