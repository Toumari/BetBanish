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
  delete global.chrome;
});

test('a covered visit loads the local reminder into the pause', () => {
  runScript('sites.js', 'content.js');
  expect(document.getElementById('gambling-blocker-reminder').textContent).toContain('Remember the holiday');
});

test('disabled sites do not show an overlay or read the personal reminder', () => {
  chrome.storage.sync.values.disabledDefaults = ['BET365.COM'];
  runScript('sites.js', 'content.js');
  expect(document.querySelector('dialog')).toBeNull();
  expect(chrome.storage.local.get).not.toHaveBeenCalled();
});

test('existing session dismissals are respected', () => {
  sessionStorage.setItem('__gambling_blocker_dismissed__', '1');
  runScript('sites.js', 'content.js');
  expect(document.querySelector('dialog')).toBeNull();
});

test('failed reminder loading still shows the pause', () => {
  chrome.storage.local.get.mockImplementation((defaults, callback) => {
    chrome.runtime.lastError = { message: 'Read failed' };
    callback(undefined);
    delete chrome.runtime.lastError;
  });
  runScript('sites.js', 'content.js');
  expect(document.querySelector('dialog')).not.toBeNull();
  expect(document.getElementById('gambling-blocker-reminder').hidden).toBe(true);
});
