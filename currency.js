const BetBanishCurrency = (() => {
  const FALLBACK = 'GBP';
  // Conservative regional suggestions, reviewed October 2026. Language alone
  // is not a location signal. Unmapped regions keep the GBP fallback.
  const regionCurrencies = {
    GB: 'GBP', GG: 'GBP', IM: 'GBP', JE: 'GBP', US: 'USD', CA: 'CAD',
    AU: 'AUD', NZ: 'NZD', CH: 'CHF', LI: 'CHF', JP: 'JPY', IN: 'INR',
    ZA: 'ZAR', BR: 'BRL', MX: 'MXN', SG: 'SGD', HK: 'HKD', CN: 'CNY',
    TW: 'TWD', KR: 'KRW', SE: 'SEK', NO: 'NOK', DK: 'DKK', PL: 'PLN',
    CZ: 'CZK', HU: 'HUF', RO: 'RON', TR: 'TRY', AE: 'AED', SA: 'SAR',
    IL: 'ILS', PH: 'PHP', MY: 'MYR', ID: 'IDR', TH: 'THB', VN: 'VND',
    PK: 'PKR', BD: 'BDT', NG: 'NGN', KE: 'KES', GH: 'GHS',
    AT: 'EUR', BE: 'EUR', BG: 'EUR', CY: 'EUR', DE: 'EUR', EE: 'EUR',
    ES: 'EUR', FI: 'EUR', FR: 'EUR', GR: 'EUR', HR: 'EUR', IE: 'EUR',
    IT: 'EUR', LT: 'EUR', LU: 'EUR', LV: 'EUR', MT: 'EUR', NL: 'EUR',
    PT: 'EUR', SI: 'EUR', SK: 'EUR', AD: 'EUR', MC: 'EUR', SM: 'EUR', VA: 'EUR'
  };
  const supported = typeof Intl.supportedValuesOf === 'function'
    ? Intl.supportedValuesOf('currency')
    : [...new Set(Object.values(regionCurrencies))].sort();

  function browserLanguages() {
    if (typeof navigator === 'undefined') return [];
    return navigator.languages?.length ? navigator.languages : [navigator.language];
  }

  function locales(languages = browserLanguages()) {
    return (Array.isArray(languages) ? languages : []).flatMap(language => {
      if (typeof language !== 'string' || !language) return [];
      try { return [new Intl.Locale(language)]; } catch { return []; }
    });
  }

  function suggest(languages = browserLanguages()) {
    for (const locale of locales(languages)) {
      const currency = regionCurrencies[locale.region];
      if (currency) return { currency, language: locale.baseName };
    }
    return { currency: FALLBACK, language: null };
  }

  function normalize(value) {
    const code = typeof value === 'string' ? value.trim().toUpperCase() : '';
    return supported.includes(code) ? code : 'auto';
  }

  function resolve(value = 'auto', languages = browserLanguages()) {
    const code = normalize(value);
    return code === 'auto' ? suggest(languages).currency : code;
  }

  function formatter(value = 'auto', languages = browserLanguages()) {
    return new Intl.NumberFormat(locales(languages)[0]?.toString() || 'en-GB', {
      style: 'currency', currency: resolve(value, languages), currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 0, maximumFractionDigits: 0
    });
  }

  return { supported, suggest, normalize, resolve, formatter };
})();

if (typeof module !== 'undefined') module.exports = BetBanishCurrency;
