const currency = require('../currency');

test.each([
  ['en-GB', 'GBP'], ['en-US', 'USD'], ['fr-CA', 'CAD'], ['en-AU', 'AUD'],
  ['de-DE', 'EUR'], ['en-IE', 'EUR'], ['bg-BG', 'EUR'], ['ja-JP', 'JPY'],
  ['hi-IN', 'INR'], ['zh-Hant-TW', 'TWD'], ['de-CH', 'CHF']
])('suggests a currency from the explicit region in %s', (language, expected) => {
  expect(currency.suggest([language])).toEqual({ currency: expected, language });
});

test('respects browser language order and skips a language with no region', () => {
  expect(currency.resolve('auto', ['fr-CA', 'en-US'])).toBe('CAD');
  expect(currency.resolve('auto', ['en', 'de-DE'])).toBe('EUR');
});

test.each([[], ['en'], ['pt'], ['en-001'], ['en-ZZ'], ['bad_locale'], [null], null].map(languages => [languages]))(
  'ambiguous, unknown or malformed languages fall back to GBP: %j', languages => {
    expect(currency.suggest(languages)).toEqual({ currency: 'GBP', language: null });
    expect(() => currency.formatter('auto', languages).format(10)).not.toThrow();
  }
);

test('an explicit choice overrides the suggestion, including a less common currency', () => {
  expect(currency.resolve('USD', ['en-GB'])).toBe('USD');
  expect(currency.resolve(' jpy ', ['fr-FR'])).toBe('JPY');
  expect(currency.resolve('ISK', ['en-US'])).toBe('ISK');
});

test.each(['XYZ', '<script>', null, 42, {}, ''])('invalid stored choices safely use automatic: %j', value => {
  expect(currency.resolve(value, ['fr-FR'])).toBe('EUR');
});
