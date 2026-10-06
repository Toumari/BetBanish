let listener;

beforeEach(() => {
  jest.resetModules();
  global.chrome = {
    runtime: { id: 'betbanish-test', onMessage: { addListener: callback => { listener = callback; } } },
    tabs: { update: jest.fn((id, options, callback) => callback()) }
  };
  require('../background');
});

afterEach(() => { delete global.chrome; });

test('leaves the requesting tab using a fixed destination', () => {
  const respond = jest.fn();
  expect(listener({ type: 'leave-site', url: 'https://untrusted.com', tabId: 99 },
    { id: 'betbanish-test', tab: { id: 7 }, frameId: 0 }, respond)).toBe(true);
  expect(chrome.tabs.update).toHaveBeenCalledWith(7, { url: 'chrome://newtab/' }, expect.any(Function));
  expect(respond).toHaveBeenCalledWith({ ok: true });
});

test.each([
  { id: 'another-extension', tab: { id: 7 }, frameId: 0 },
  { id: 'betbanish-test' },
  { id: 'betbanish-test', tab: { id: 7 }, frameId: 1 }
])('ignores messages from an unexpected sender', sender => {
  expect(listener({ type: 'leave-site' }, sender, jest.fn())).toBe(false);
  expect(chrome.tabs.update).not.toHaveBeenCalled();
});

test('reports navigation failure', () => {
  chrome.runtime.lastError = { message: 'Tab closed' };
  const respond = jest.fn();
  listener({ type: 'leave-site' }, { id: 'betbanish-test', tab: { id: 7 }, frameId: 0 }, respond);
  expect(respond).toHaveBeenCalledWith({ ok: false });
});
