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
  runScript('sites.js', 'options.js');
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
