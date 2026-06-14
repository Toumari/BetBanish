# BetBanish

A Chrome extension that makes you stop and think before you gamble.

Every time you visit a gambling site, a full-screen overlay appears showing you a simple loss calculator: if you bet £1, £2, £5, £10, £25, or £50 every day — here's what it costs you per week, month, and year. After 10 seconds, you can choose to continue. The choice is always yours.

No accounts. No tracking. No data collection.

---

## How it works

1. You visit a gambling site (65+ UK sites covered by default)
2. A full-screen overlay fires immediately, showing the loss calculator
3. A 10-second countdown runs before the "Continue anyway" button enables
4. You choose to continue or close the tab — the overlay doesn't appear again in the same session

The goal is friction, not a hard block. A pause is enough to reconsider.

---

## Features

- Loss calculator across daily, weekly, monthly, and yearly spend
- 65+ UK gambling sites blocked by default — Bet365, William Hill, Paddy Power, Ladbrokes, Betfair, Coral, Sky Bet, Betfred, and more
- Toggle individual default sites on or off in Settings
- Add your own sites in Settings
- 10-second countdown before you can proceed
- Session-based: once dismissed per tab session, you won't see it again on that tab

---

## Installation

### From the Chrome Web Store

*(Coming soon)*

### Load unpacked (for development or personal use)

1. Clone the repo:
   ```bash
   git clone https://github.com/Toumari/BetBanish.git
   cd BetBanish
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle, top-right)
4. Click **Load unpacked** and select the `BetBanish` folder
5. Visit any site on the blocklist (e.g. `https://www.bet365.com`) in an Incognito window to test

---

## Development

### Prerequisites

- Node.js (for running tests)
- Chrome (for manual testing)

### Setup

```bash
npm install
```

### Run tests

```bash
npm test
```

15 tests covering the site-matching logic and loss calculator.

### Project structure

```
BetBanish/
├── manifest.json        # Chrome MV3 manifest
├── content.js           # Overlay injection and loss calculator
├── overlay.css          # Overlay styles
├── sites.js             # Default site list and hostname matcher
├── options.html         # Settings page
├── options.js           # Settings page logic
├── privacy.html         # Privacy policy
├── icons/               # Extension icons
└── tests/
    ├── sites.test.js    # Site matching tests
    └── content.test.js  # Loss calculator tests
```

### Making changes

After editing any file, reload the extension in `chrome://extensions` by clicking the refresh icon on the BetBanish card. Then test in an Incognito window (session storage is clean there).

---

## Blocked sites

The default list covers 65+ UK gambling sites across:

- High-street bookmakers (Bet365, William Hill, Ladbrokes, Coral, Betfair…)
- Online bookmakers (Sky Bet, Betfred, Unibet, Paddy Power…)
- Online casinos (Casumo, LeoVegas, 888 Casino, Jackpotjoy…)
- Poker (PokerStars, PartyPoker, 888 Poker)
- Bingo (Tombola, Mecca Bingo, Foxy Bingo…)
- US operators with UK presence (DraftKings, FanDuel)

You can disable any default site or add your own in the extension's Settings page.

---

## Privacy

BetBanish collects nothing. It does not transmit any data to any server.

Your settings (blocked/unblocked sites, custom sites) are stored locally via Chrome's `chrome.storage.sync` API, which syncs across your own Chrome devices if you're signed into Chrome — but they are never sent to us or any third party.

The extension checks the hostname of every page you visit to decide whether to show the overlay. This check happens entirely inside your browser. No URLs, hostnames, or browsing history are recorded or transmitted.

Full policy: https://toumari.github.io/BetBanish/privacy.html

---

## If you need help

**GamCare helpline:** 0808 8020 133 (free, 24/7)

**BeGambleAware:** https://www.begambleaware.org

---

## Roadmap

- **v1 (current):** Visual polish, 65+ UK sites, settings page — Chrome Web Store launch
- **v2:** Statistics — intercept count, streak tracking, browser action popup
- **v3:** Scheduling — activate only at certain times or days
- **v4:** Platform reach — Firefox (AMO), Edge verification

---

## Licence

MIT
