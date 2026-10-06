/** @jest-environment jsdom */
const { injectOverlay, wasDismissed } = require('../content');

beforeEach(() => {
  jest.useFakeTimers();
  document.body.innerHTML = '<button id="original">Original page</button>';
  sessionStorage.clear();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () { this.open = false; };
  global.chrome = { runtime: { sendMessage: jest.fn((message, callback) => callback({ ok: true })) } };
});

afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
  delete global.chrome;
});

test('leaving is available immediately and never marks the visit as continued', () => {
  injectOverlay();
  const leave = document.getElementById('gambling-blocker-leave');
  expect(document.activeElement).toBe(leave);
  expect(document.getElementById('gambling-blocker-btn').disabled).toBe(true);
  leave.click();
  expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({ type: 'leave-site' }, expect.any(Function));
  expect(wasDismissed()).toBe(false);
});

test('continue stays disabled for ten seconds, then dismisses and restores focus', () => {
  const original = document.getElementById('original');
  original.focus();
  injectOverlay();
  const proceed = document.getElementById('gambling-blocker-btn');
  jest.advanceTimersByTime(9999);
  proceed.click();
  expect(wasDismissed()).toBe(false);
  expect(proceed.disabled).toBe(true);
  jest.advanceTimersByTime(1);
  expect(proceed.textContent).toBe('Continue anyway');
  proceed.click();
  expect(wasDismissed()).toBe(true);
  expect(document.querySelector('dialog')).toBeNull();
  expect(document.activeElement).toBe(original);
});

test('reminder is plain text, even when it contains HTML', () => {
  injectOverlay('<img src=x onerror=alert(1)> My reason');
  const reminder = document.getElementById('gambling-blocker-reminder');
  expect(reminder.hidden).toBe(false);
  expect(reminder.querySelector('p').textContent).toBe('<img src=x onerror=alert(1)> My reason');
  expect(reminder.querySelector('img')).toBeNull();
});

test('empty reminders are hidden and repeated injection does not duplicate the pause', () => {
  injectOverlay('  ');
  injectOverlay('Another reason');
  expect(document.querySelectorAll('dialog')).toHaveLength(1);
  expect(document.getElementById('gambling-blocker-reminder').hidden).toBe(true);
});

test('escape does not bypass the pause', () => {
  injectOverlay();
  const event = new Event('cancel', { cancelable: true });
  document.querySelector('dialog').dispatchEvent(event);
  expect(event.defaultPrevented).toBe(true);
  const key = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
  document.querySelector('dialog').dispatchEvent(key);
  expect(key.defaultPrevented).toBe(true);
});

test('failed leave request gives a retry without enabling continue early', () => {
  chrome.runtime.sendMessage.mockImplementation((message, callback) => callback({ ok: false }));
  injectOverlay();
  document.getElementById('gambling-blocker-leave').click();
  expect(document.getElementById('gambling-blocker-leave').disabled).toBe(false);
  expect(document.getElementById('gambling-blocker-error').hidden).toBe(false);
  expect(document.getElementById('gambling-blocker-btn').disabled).toBe(true);
});

test('unavailable page storage does not prevent showing or dismissing a pause', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage blocked'); });
  jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage blocked'); });
  expect(wasDismissed()).toBe(false);
  injectOverlay();
  jest.advanceTimersByTime(10000);
  document.getElementById('gambling-blocker-btn').click();
  expect(document.querySelector('dialog')).toBeNull();
});
