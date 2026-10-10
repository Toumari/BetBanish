/** @jest-environment jsdom */
const { storageArea, loadPage, runScript, settle } = require('./helpers/browser');

beforeEach(async () => {
  jest.useFakeTimers();
  loadPage('options.html');
  global.chrome = {
    storage: {
      sync: storageArea({ disabledDefaults: ['bet365.com'], customSites: ['OLD.COM'] }),
      local: storageArea({ personalReminder: 'My existing reminder' })
    },
    runtime: {}
  };
  runScript('sites.js', 'currency.js', 'options.js');
  await settle();
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  delete global.chrome;
});

function submitReminder(value) {
  document.getElementById('personal-reminder').value = value;
  document.getElementById('reminder-form').dispatchEvent(new Event('submit', { cancelable: true }));
}

test('loads the existing reminder and saves edits locally without changing site settings', async () => {
  expect(document.getElementById('personal-reminder').value).toBe('My existing reminder');
  submitReminder('  My holiday fund  ');
  await settle();
  expect(chrome.storage.local.values.personalReminder).toBe('My holiday fund');
  expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  expect(document.getElementById('reminder-feedback').textContent).toContain('Saved');
});

test('saving blank removes the reminder', async () => {
  submitReminder('  ');
  await settle();
  expect(chrome.storage.local.values.personalReminder).toBe('');
  expect(document.getElementById('reminder-feedback').textContent).toBe('Reminder removed.');
});

test('save failure preserves the draft and allows retry', async () => {
  chrome.storage.local.set.mockRejectedValueOnce(new Error('Disk error'));
  submitReminder('Keep this draft');
  await settle();
  expect(document.getElementById('personal-reminder').value).toBe('Keep this draft');
  expect(document.getElementById('save-reminder').disabled).toBe(false);
  expect(document.getElementById('reminder-feedback').dataset.error).toBe('true');
});

test('normalizes pasted URLs and preserves disabled default choices', async () => {
  document.getElementById('new-site').value = 'HTTPS://WWW.Example.COM/path';
  document.getElementById('add-btn').click();
  await settle();
  expect(chrome.storage.sync.values).toEqual({ disabledDefaults: ['bet365.com'], customSites: ['old.com', 'example.com'] });
});

test('invalid site input provides feedback without saving', async () => {
  document.getElementById('new-site').value = 'bad..domain.com';
  document.getElementById('add-btn').click();
  await settle();
  expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  expect(document.getElementById('feedback').dataset.error).toBe('true');
});

function submitCurrency(value) {
  document.getElementById('currency').value = value;
  document.getElementById('currency').dispatchEvent(new Event('change'));
  document.getElementById('currency-form').dispatchEvent(new Event('submit', { cancelable: true }));
}

test('existing users get automatic currency without overwriting any saved settings', () => {
  expect(document.getElementById('currency').value).toBe('auto');
  expect(document.getElementById('currency').disabled).toBe(false);
  expect(chrome.storage.sync.set).not.toHaveBeenCalled();
});

test('currency preview and save preserve site choices and the local reminder', async () => {
  submitCurrency('EUR');
  await settle();
  expect(document.getElementById('currency-preview').textContent).toContain('EUR');
  expect(document.getElementById('currency-preview').textContent).toContain('€');
  expect(chrome.storage.sync.values).toEqual({
    disabledDefaults: ['bet365.com'], customSites: ['OLD.COM'], currency: 'EUR'
  });
  expect(chrome.storage.local.set).not.toHaveBeenCalled();
  expect(document.getElementById('currency-feedback').textContent).toContain('Saved');
});

test('saved currency is restored when reopening Settings and can return to automatic', async () => {
  chrome.storage.sync.values.currency = 'JPY';
  loadPage('options.html');
  runScript('sites.js', 'currency.js', 'options.js');
  await settle();
  expect(document.getElementById('currency').value).toBe('JPY');
  expect(document.getElementById('currency-preview').textContent).toContain('JPY');
  submitCurrency('auto');
  await settle();
  expect(chrome.storage.sync.values.currency).toBe('auto');
});

test('failed currency save retains the selected value and lets the user retry', async () => {
  chrome.storage.sync.set.mockRejectedValueOnce(new Error('Sync unavailable'));
  submitCurrency('USD');
  await settle();
  expect(chrome.storage.sync.values.currency).toBeUndefined();
  expect(document.getElementById('currency').value).toBe('USD');
  expect(document.getElementById('save-currency').disabled).toBe(false);
  expect(document.getElementById('currency-feedback').dataset.error).toBe('true');
  submitCurrency('USD');
  await settle();
  expect(chrome.storage.sync.values.currency).toBe('USD');
});

test('failed currency load keeps saving disabled to protect an existing preference', async () => {
  const originalGet = chrome.storage.sync.get.getMockImplementation();
  chrome.storage.sync.get.mockImplementation((defaults, callback) =>
    Object.hasOwn(defaults, 'currency') ? Promise.reject(new Error('Sync unavailable')) : originalGet(defaults, callback));
  loadPage('options.html');
  runScript('sites.js', 'currency.js', 'options.js');
  await settle();
  expect(document.getElementById('currency').disabled).toBe(true);
  expect(document.getElementById('save-currency').disabled).toBe(true);
  expect(document.getElementById('currency-feedback').textContent).toContain('Could not load');
});
