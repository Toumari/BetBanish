# Chrome Web Store Listing — BetBanish

## Name
BetBanish

## Short description (132 chars max)
A personal reminder, a 10-second pause, and a choice to leave on 65+ UK betting sites. Stop and think before you gamble.

## Full description

BetBanish is a free tool to help you stop and think before you gamble.

When you visit a covered gambling website, a full-screen pause shows what daily spending adds up to per week, month, and year. Choose your currency in Settings, or use a suggestion based on your browser's regional language settings. These are spending examples in your chosen currency, not exchange-rate conversions or predictions of losses.

Leave the site immediately with one button, or choose to continue after 10 seconds. Add a personal reminder in Settings to keep your own reason to pause in view. The choice is always yours.

**Features:**
• Spending projections covering daily, weekly, monthly, and yearly spend
• Choose your currency, with an automatic suggestion based on browser language settings
• Leave this site immediately, even during the countdown
• Personal reminder saved only on your device
• Toolbar popup with current-site coverage and a quick Add this site action
• 65+ UK gambling sites blocked by default (Bet365, William Hill, Paddy Power, Ladbrokes, Betfair, Coral, Sky Bet, Betfred, and many more)
• 10-second countdown before you can proceed — enough time to reconsider
• Add your own sites in Settings
• Toggle individual sites on or off
• No accounts or activity analytics; no user data is sent to the developer

**If you need help:**
GamCare helpline: 0808 8020 133 (free, 24/7)
BeGambleAware: www.begambleaware.org

---

## Category
Lifestyle (or: Productivity)

## Language
English (United Kingdom)

## Privacy policy URL
https://toumari.github.io/BetBanish/privacy.html

---

## Permission justification (for Google's review form)

**Storage permission justification (v1.2):**

Stores site preferences, manually added domains, and the chosen currency using chrome.storage.sync, which Chrome may sync through the user's Google account. Stores the optional personal reminder using chrome.storage.local on this device only. Automatic currency suggestions use browser language settings locally, without a location or IP lookup. No browsing-history log or usage analytics are stored.

**Why does this extension need access to all websites?**

This extension runs on regular websites because users can choose which domains show a pause. Its content script compares the current hostname against settings in chrome.storage.sync and shows the overlay when it matches. The toolbar popup reads the current tab's URL to show coverage and let the user add that domain. Only explicitly configured site hostnames are saved, without paths or queries. The optional reminder is saved in chrome.storage.local and displayed in the overlay. No browsing history or activity analytics are collected. Chrome may sync site settings through the user's Google account; the developer receives no data. The leave action navigates the requesting tab to Chrome's New Tab page. No additional permissions are requested by this update.

---

## Listing images for v1.1

Upload these from `store-assets/v1.1/`, in this order:

1. `01-pause-screen.jpg` (1280×800): personal reminder, spending projections, countdown and leave action.
2. `02-toolbar-popup.jpg` (1280×800): current-site coverage and quick add.
3. `03-reminder-settings.jpg` (1280×800): reminder editor and site controls.

Replace the small promotional tile with `04-promo-tile.jpg` (440×280).

These images render the shipped UI with example data and descriptive captions. The rendering helper is development-only and is excluded from the extension ZIP. See `store-assets/v1.1/RELEASE-CHECKLIST.txt` for dashboard declarations and submission steps.
