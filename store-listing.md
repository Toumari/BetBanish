# Chrome Web Store Listing — BetBanish

## Name
Bet Banish – Pause Before You Gamble

## Short description (132 chars max)
A personal reminder, a 10-second pause, and a choice to leave on 65+ UK betting sites. Stop and think before you gamble.

## Full description

Bet Banish (BetBanish) is a free Chrome extension that gives you a moment to reconsider before gambling.

When you visit a covered website, a full-screen pause shows what daily spending adds up to over a week, month and year. Choose your currency in Settings, or use an automatic suggestion based on your browser's regional language settings. These are spending examples, not exchange-rate conversions, tracked spending or predictions of losses.

Leave the site immediately with one button, or choose to continue after 10 seconds. Add a personal reminder in Settings to keep your own reason to pause in view.

Features:
• Spending projections for daily, weekly, monthly and yearly amounts
• Your choice of currency, with an automatic suggestion processed locally
• An immediate Leave this site button, including during the countdown
• An optional personal reminder stored only on your device
• A toolbar popup showing current-site coverage, with a quick Add this site action
• More than 65 gambling domains included by default, with a focus on UK sites
• Settings to add your own domains or turn individual sites on or off

BetBanish adds a pause after a covered page loads. You can continue after the countdown; doing so dismisses the pause for that website in the same tab session. It works in desktop Chrome and does not block gambling apps, other browsers or other devices. It does not replace self-exclusion, dedicated blocking software or professional support.

Privacy:
No accounts or activity analytics. No user data is sent to the BetBanish developer. Website addresses are checked inside your browser. Site settings and your currency preference use Chrome Sync and may sync through your Google account. Your optional personal reminder stays on this device and appears in the webpage's pause overlay; avoid including sensitive details. No browsing-history log is stored.

Learn more: https://toumari.github.io/BetBanish/
Privacy policy: https://toumari.github.io/BetBanish/privacy.html

For gambling-related information and support in Great Britain, visit https://www.gamcare.org.uk/. BetBanish is an independent project and is not affiliated with GamCare.

---

## Category
Well-being

## Language
English (United Kingdom)

## Homepage URL
https://toumari.github.io/BetBanish/

## Support URL
https://github.com/Toumari/BetBanish/issues

## Privacy policy URL
https://toumari.github.io/BetBanish/privacy.html

---

## Permission justification (for Google's review form)

**Storage permission justification (v1.2):**

Stores site preferences, manually added domains, and the chosen currency using chrome.storage.sync, which Chrome may sync through the user's Google account. Stores the optional personal reminder using chrome.storage.local on this device only. Automatic currency suggestions use browser language settings locally, without a location or IP lookup. No browsing-history log or usage analytics are stored.

**Why does this extension need access to all websites?**

This extension runs on regular websites because users can choose which domains show a pause. Its content script compares the current hostname against settings in chrome.storage.sync and shows the overlay when it matches. The toolbar popup reads the current tab's URL to show coverage and let the user add that domain. Only explicitly configured site hostnames are saved, without paths or queries. The optional reminder is saved in chrome.storage.local and displayed in the overlay. No browsing history or activity analytics are collected. Chrome may sync site settings through the user's Google account; the developer receives no data. The leave action navigates the requesting tab to Chrome's New Tab page. No additional permissions are requested by this update.

## Data usage declarations

The dashboard draft declares **Web history** for locally handled website addresses and **Website content** for the optional reminder text displayed in the webpage overlay. No remote code is used. The privacy policy explains the local processing and Chrome Sync storage; the developer receives no user data.

## Reviewer test instructions

No login required. Open Settings, save a reminder, choose EUR and click Save currency. Add example.com. Open https://example.com in a fresh tab. Confirm the reminder and EUR spending examples appear. Leave this site should open Chrome's New Tab page immediately. Reopen example.com in a fresh tab; Continue anyway should enable after 10 seconds. In Settings, switch currency to Automatic and save. Remove example.com after testing.

---

## Listing images for v1.1

Upload these from `store-assets/v1.1/`, in this order:

1. `01-pause-screen.jpg` (1280×800): personal reminder, spending projections, countdown and leave action.
2. `02-toolbar-popup.jpg` (1280×800): current-site coverage and quick add.
3. `03-reminder-settings.jpg` (1280×800): reminder editor and site controls.

Replace the small promotional tile with `04-promo-tile.jpg` (440×280).

These images render the shipped UI with example data and descriptive captions. The rendering helper is development-only and is excluded from the extension ZIP. See `store-assets/v1.1/RELEASE-CHECKLIST.txt` for dashboard declarations and submission steps.
