# BetBanish

A Chrome extension that makes you stop and think before you gamble.

When you visit a covered gambling site, a full-screen pause shows what spending £1, £2, £5, £10, £25, or £50 every day adds up to per week, month, and year. Leave the site immediately, or choose to continue after 10 seconds. You can also add your own reason to pause.

No accounts or activity analytics. No user data is sent to the developer.

---

## How it works

1. You visit a gambling site (65+ UK sites covered by default)
2. A full-screen overlay appears after the page loads, showing spending projections and your optional personal reminder
3. A 10-second countdown runs before the "Continue anyway" button enables
4. Choose **Leave this site** at any time to open Chrome's New Tab page in the same tab, or continue after the countdown. Continuing dismisses the pause for that website in the same tab session.

The goal is friction, not a hard block. A pause is enough to reconsider.

---

## Features

- Spending projections across daily, weekly, monthly, and yearly spend (not a prediction of losses)
- An immediate **Leave this site** action, including during the countdown
- A personal reminder of up to 160 characters, stored only on your device
- Toolbar popup showing current-site coverage, **Add this site**, and a Settings shortcut
- 65+ UK gambling sites blocked by default — Bet365, William Hill, Paddy Power, Ladbrokes, Betfair, Coral, Sky Bet, Betfred, and more
- Toggle individual default sites on or off in Settings
- Add your own sites in Settings
- 10-second countdown before you can proceed
- Session-based: once dismissed per tab session, you won't see it again on that tab

---

## Installation

### From the Chrome Web Store

[Install BetBanish](https://chromewebstore.google.com/detail/betbanish/cmndojlifojfgihdgcjdkcgalcnfhfac). The changes in this repository need a new store submission before installed users receive them.

### Load unpacked (for development or personal use)

1. Clone the repo:
   ```bash
   git clone https://github.com/Toumari/BetBanish.git
   cd BetBanish
   ```
2. Open Chrome and go to `chrome://extensions`
3. Enable **Developer mode** (toggle, top-right)
4. Click **Load unpacked** and select the `BetBanish` folder
5. Reload any existing website tabs after loading or updating the extension. For a safe test, add `example.com` in Settings and open it in a fresh tab. Incognito testing additionally requires enabling **Allow in Incognito** in Chrome's extension details.

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

Tests cover site matching and normalization, spending calculations, the countdown and leave action, local reminders, popup coverage, and storage failures.

### Build the store package

```powershell
./build.ps1
```

Creates `betbanish-v1.1.zip` in the project folder with only runtime files and extension icons. Tests and development dependencies are excluded.

### Project structure

```
BetBanish/
├── manifest.json        # Chrome MV3 manifest
├── background.js        # Leave-site navigation
├── content.js           # Overlay injection and loss calculator
├── overlay.css          # Overlay styles
├── sites.js             # Default site list and hostname matcher
├── options.html         # Settings page
├── options.js           # Settings page logic
├── popup.html           # Toolbar popup
├── popup.js             # Current-site coverage and quick add
├── popup.css            # Toolbar popup styles
├── privacy.html         # Privacy policy
├── icons/               # Extension icons
└── tests/
    ├── sites.test.js    # Site matching tests
    └── content.test.js  # Loss calculator tests
```

### Making changes

After editing any file, reload the extension in `chrome://extensions` by clicking the refresh icon on the BetBanish card. Open a fresh website tab to test without an existing dismissal flag.

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

BetBanish handles website addresses and settings to provide its pause features. No user data is sent to the developer, and there are no activity analytics or developer-operated servers.

Your site settings use `chrome.storage.sync`. Chrome may sync them through your Google account when Chrome sync is enabled; they are never sent to the BetBanish developer. Your personal reminder uses `chrome.storage.local` and is not synced. It is displayed in the webpage's pause overlay, so avoid including sensitive details.

The extension checks website hostnames inside your browser. The toolbar popup reads the current tab's URL to show coverage. Only sites you explicitly add are saved, as hostnames without paths or queries. No browsing history or activity statistics are collected.

Full policy: https://toumari.github.io/BetBanish/privacy.html

---

## If you need help

**GamCare helpline:** 0808 8020 133 (free, 24/7)

**BeGambleAware:** https://www.begambleaware.org

---

## Roadmap

- **v1.1 (this update):** Immediate leave action, personal reminders, toolbar popup, and reliable custom-site input
- **v2:** Statistics — intercept count, streak tracking, browser action popup
- **v3:** Scheduling — activate only at certain times or days
- **v4:** Platform reach — Firefox (AMO), Edge verification

---

## Licence

MIT
