const DEFAULT_SITES = [
  // Traditional UK high-street bookmakers
  'bet365.com',
  'williamhill.com',
  'paddypower.com',
  'ladbrokes.com',
  'betfair.com',
  'coral.co.uk',
  'skybet.com',
  'betvictor.com',
  'betfred.com',
  'boylesports.com',
  'tote.co.uk',
  'betdaq.co.uk',
  'smarkets.com',
  'matchbook.com',

  // Online bookmakers
  'unibet.co.uk',
  'bwin.com',
  '888sport.com',
  'betway.com',
  '32red.com',
  '10bet.co.uk',
  'betsson.com',
  'novibet.co.uk',
  'quinnbet.com',
  'hollywoodbets.co.uk',
  'livescorebet.com',
  'betuk.com',
  'betgoodwin.co.uk',
  'midnite.com',
  'betmgm.co.uk',
  'mansionbet.com',
  'sportnation.bet',
  'vbet.co.uk',
  'tonybet.co.uk',
  'bethard.com',
  'energybet.com',

  // Sky gambling products
  'skycasino.com',
  'skyvegas.com',
  'skypoker.com',
  'skybingo.com',

  // Online casinos & slots
  'casumo.com',
  'mrgreen.com',
  'leovegas.com',
  '888casino.com',
  'jackpotjoy.com',
  'virgingames.com',
  'gentingcasino.com',
  'galacasino.com',
  'mfortune.co.uk',
  'lottoland.co.uk',
  'partycasino.com',
  'jackpotcity.com',
  'grosvenorcasinos.com',
  'reeltastic.com',

  // Poker
  'pokerstars.com',
  'partypoker.com',
  '888poker.com',

  // US operators with UK presence
  'draftkings.com',
  'fanduel.com',

  // Bingo
  'tombola.co.uk',
  'sunbingo.co.uk',
  'foxybingo.com',
  'galabingo.com',
  '888bingo.com',
  'meccabingo.com',
  'winkbingo.com',

  // User additions
  'goldenbet.com',
];

// Accept a hostname or pasted web URL, including older mixed-case settings.
function normalizeSite(value) {
  if (typeof value !== 'string' || !value.trim() || /\s/.test(value.trim())) return '';
  try {
    const input = value.trim();
    const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(input) ? input : `https://${input}`);
    if (!['http:', 'https:'].includes(url.protocol) || url.username || url.password) return '';
    const hostname = url.hostname.toLowerCase().replace(/^www\./, '').replace(/\.$/, '');
    const labels = hostname.split('.');
    if (hostname.length > 253 || labels.length < 2 || !/[a-z]/.test(labels[labels.length - 1])) return '';
    if (!labels.every(label => /^[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?$/.test(label))) return '';
    return hostname;
  } catch {
    return '';
  }
}

function matchesSite(hostname, site) {
  return hostname === site || hostname.endsWith('.' + site);
}

function isGamblingSite(hostname, disabledDefaults = [], customSites = []) {
  const cleanHost = normalizeSite(hostname);
  if (!cleanHost) return false;
  const disabled = disabledDefaults.map(normalizeSite);
  const enabledDefaults = DEFAULT_SITES.filter(site => !disabled.includes(site));
  return [...enabledDefaults, ...customSites.map(normalizeSite)]
    .some(site => site && matchesSite(cleanHost, site));
}

function settingsWithSite(hostname, disabledDefaults = [], customSites = []) {
  const site = normalizeSite(hostname);
  if (!site) throw new Error('Enter a valid website address, such as example.com.');
  const updated = {
    disabledDefaults: disabledDefaults.map(normalizeSite)
      .filter(disabled => disabled && !matchesSite(site, disabled)),
    customSites: [...new Set(customSites.map(normalizeSite).filter(Boolean))]
  };
  if (!isGamblingSite(site, updated.disabledDefaults, updated.customSites)) {
    updated.customSites.push(site);
  }
  return updated;
}

if (typeof module !== 'undefined') module.exports = { DEFAULT_SITES, normalizeSite, isGamblingSite, settingsWithSite };
