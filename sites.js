const DEFAULT_SITES = [
  'bet365.com',
  'williamhill.com',
  'paddypower.com',
  'ladbrokes.com',
  'betfair.com',
  'coral.co.uk',
  'skybet.com',
  'betvictor.com',
  'unibet.co.uk',
  'bwin.com',
  '888sport.com',
  'casumo.com',
  'betway.com',
  'mrgreen.com',
  'jackpotcity.com',
  'draftkings.com',
  'fanduel.com',
  'pokerstars.com',
  'partypoker.com',
  '32red.com'
];

function isGamblingSite(hostname, disabledDefaults, customSites) {
  const cleanHost = hostname.replace(/^www\./, '');
  const enabledDefaults = DEFAULT_SITES.filter(s => !disabledDefaults.includes(s));
  const allBlocked = [...enabledDefaults, ...customSites];
  return allBlocked.some(site => cleanHost === site || cleanHost.endsWith('.' + site));
}

if (typeof module !== 'undefined') module.exports = { DEFAULT_SITES, isGamblingSite };
