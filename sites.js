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

function isGamblingSite(hostname, disabledDefaults, customSites) {
  const cleanHost = hostname.replace(/^www\./, '');
  const enabledDefaults = DEFAULT_SITES.filter(s => !disabledDefaults.includes(s));
  const allBlocked = [...enabledDefaults, ...customSites];
  return allBlocked.some(site => cleanHost === site || cleanHost.endsWith('.' + site));
}

if (typeof module !== 'undefined') module.exports = { DEFAULT_SITES, isGamblingSite };
