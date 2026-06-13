const { isGamblingSite, DEFAULT_SITES } = require('../sites');

test('DEFAULT_SITES contains at least 20 entries', () => {
  expect(DEFAULT_SITES.length).toBeGreaterThanOrEqual(20);
});

test('matches exact hostname', () => {
  expect(isGamblingSite('bet365.com', [], [])).toBe(true);
});

test('matches www subdomain', () => {
  expect(isGamblingSite('www.bet365.com', [], [])).toBe(true);
});

test('does not match an unrelated site', () => {
  expect(isGamblingSite('google.com', [], [])).toBe(false);
});

test('does not partially match — bbet365.com is not bet365.com', () => {
  expect(isGamblingSite('bbet365.com', [], [])).toBe(false);
});

test('respects disabledDefaults — disabled site is not blocked', () => {
  expect(isGamblingSite('bet365.com', ['bet365.com'], [])).toBe(false);
});

test('matches a custom site', () => {
  expect(isGamblingSite('mylocalbookies.com', [], ['mylocalbookies.com'])).toBe(true);
});

test('matches www prefix on custom site', () => {
  expect(isGamblingSite('www.mylocalbookies.com', [], ['mylocalbookies.com'])).toBe(true);
});
