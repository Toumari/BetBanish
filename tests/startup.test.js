/**
 * @jest-environment jsdom
 * @jest-environment-options {"url":"https://www.bet365.com"}
 */
const { storageArea, runScript } = require('./helpers/browser');

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = '';
  sessionStorage.clear();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  global.chrome = {
    storage: {
      sync: storageArea({ disabledDefaults: [], customSites: [] }),
      local: storageArea({ personalReminder: 'Remember the holiday' })
    },
    runtime: {}
  };
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
  delete global.chrome;
});

test('a covered visit loads the local reminder into the pause', () => {
  runScript('sites.js', 'currency.js', 'content.js');
  expect(document.getElementById('gambling-blocker-reminder').textContent).toContain('Remember the holiday');
});

test('disabled sites do not show an overlay or read the personal reminder', () => {
  chrome.storage.sync.values.disabledDefaults = ['BET365.COM'];
  runScript('sites.js', 'currency.js', 'content.js');
  expect(document.querySelector('dialog')).toBeNull();
  expect(chrome.storage.local.get).not.toHaveBeenCalled();
});

test('existing session dismissals are respected', () => {
  sessionStorage.setItem('__gambling_blocker_dismissed__', '1');
  runScript('sites.js', 'currency.js', 'content.js');
  expect(document.querySelector('dialog')).toBeNull();
});

test('failed reminder loading still shows the pause', () => {
  chrome.storage.local.get.mockImplementation((defaults, callback) => {
    chrome.runtime.lastError = { message: 'Read failed' };
    callback(undefined);
    delete chrome.runtime.lastError;
  });
  runScript('sites.js', 'currency.js', 'content.js');
  expect(document.querySelector('dialog')).not.toBeNull();
  expect(document.getElementById('gambling-blocker-reminder').hidden).toBe(true);
});

test('a covered visit uses the saved currency, including an unambiguous caption', () => {
  chrome.storage.sync.values.currency = 'EUR';
  runScript('sites.js', 'currency.js', 'content.js');
  expect(document.querySelector('caption').textContent).toContain('(EUR)');
  expect(document.querySelector('tbody').textContent).toContain('€');
  expect(document.querySelector('tbody').textContent).not.toContain('£');
});

test('a visit without a saved preference uses the browser region without saving it', () => {
  jest.spyOn(navigator, 'languages', 'get').mockReturnValue(['fr-CA', 'en-US']);
  runScript('sites.js', 'currency.js', 'content.js');
  expect(document.querySelector('caption').textContent).toContain('(CAD)');
  expect(chrome.storage.sync.set).not.toHaveBeenCalled();
});

test('a saved currency still applies if reading the reminder fails', () => {
  chrome.storage.sync.values.currency = 'CAD';
  chrome.storage.local.get.mockImplementation((defaults, callback) => {
    chrome.runtime.lastError = { message: 'Read failed' };
    callback(undefined);
    delete chrome.runtime.lastError;
  });
  runScript('sites.js', 'currency.js', 'content.js');
  expect(document.querySelector('caption').textContent).toContain('(CAD)');
});
