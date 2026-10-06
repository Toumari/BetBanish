const { isGamblingSite, DEFAULT_SITES, normalizeSite, settingsWithSite } = require('../sites');

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

test.each([
  ['EXAMPLE.COM', 'example.com'],
  [' HTTPS://WWW.Example.COM/deposit?offer=yes#top ', 'example.com'],
  ['example.com:443/path', 'example.com'],
  ['example.com.', 'example.com'],
  ['m.example.co.uk', 'm.example.co.uk'],
  ['https://bücher.de', 'xn--bcher-kva.de']
])('normalizes %s', (input, expected) => {
  expect(normalizeSite(input)).toBe(expected);
});

test.each(['', 'not a domain', 'localhost', 'https://', 'ftp://example.com',
  'chrome://settings', 'javascript:alert(1)', 'https://user:pass@example.com',
  'bad..example.com', '-bad.example.com', 'bad-.example.com', '127.0.0.1', '<img>.com'])
('rejects invalid or unsupported input %s', input => {
  expect(normalizeSite(input)).toBe('');
});

test('existing mixed-case custom sites match their subdomains', () => {
  expect(isGamblingSite('play.example.com', [], ['EXAMPLE.COM'])).toBe(true);
});

test('existing mixed-case disabled sites remain disabled', () => {
  expect(isGamblingSite('m.bet365.com', ['BET365.COM'], [])).toBe(false);
});

test('does not match suffix lookalikes or unrelated parent domains', () => {
  expect(isGamblingSite('example.com.evil.com', [], ['example.com'])).toBe(false);
  expect(isGamblingSite('example.com', [], ['play.example.com'])).toBe(false);
});

test('enabling a disabled default re-enables it without a custom duplicate', () => {
  expect(settingsWithSite('m.bet365.com', ['BET365.COM', 'skybet.com'], ['EXAMPLE.COM']))
    .toEqual({ disabledDefaults: ['skybet.com'], customSites: ['example.com'] });
});

test('adding an already covered subdomain preserves the existing parent', () => {
  expect(settingsWithSite('play.example.com', [], ['EXAMPLE.COM', 'example.com']))
    .toEqual({ disabledDefaults: [], customSites: ['example.com'] });
});

test('new custom sites preserve other choices', () => {
  expect(settingsWithSite('HTTPS://WWW.Example.com/path', ['bet365.com'], ['other.com']))
    .toEqual({ disabledDefaults: ['bet365.com'], customSites: ['other.com', 'example.com'] });
});
