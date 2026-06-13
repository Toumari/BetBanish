# Chrome Web Store Listing — Gambling Blocker

## Name
Gambling Blocker

## Short description (132 chars max)
Shows you exactly what you'll lose before you gamble. A 10-second pause and loss calculator on 65+ UK betting sites.

## Full description

Gambling Blocker is a free tool to help you stop and think before you gamble.

Every time you visit a gambling website, a full-screen popup appears showing you a simple table: if you bet £1, £2, £5, £10, £25, or £50 every day — here's what it costs you per week, month, and year. That's it. No lectures. Just the numbers.

After 10 seconds, you can choose to continue to the site. The choice is always yours.

**Features:**
• Loss calculator covering daily, weekly, monthly, and yearly spend
• 65+ UK gambling sites blocked by default (Bet365, William Hill, Paddy Power, Ladbrokes, Betfair, Coral, Sky Bet, Betfred, and many more)
• 10-second countdown before you can proceed — enough time to reconsider
• Add your own sites in Settings
• Toggle individual sites on or off
• No accounts, no tracking, no data collection

**If you need help:**
GamCare helpline: 0808 8020 133 (free, 24/7)
BeGambleAware: www.begambleaware.org

---

## Category
Lifestyle (or: Productivity)

## Language
English (United Kingdom)

## Privacy policy URL
[Your GitHub Pages URL here — e.g. https://yourusername.github.io/gambling-blocker/privacy.html]

---

## Permission justification (for Google's review form)

**Why does this extension need access to all websites?**

This extension needs to run on all pages because the list of blocked gambling sites is user-configurable — users can add any hostname they choose in the extension's Settings page. Because we cannot know in advance which custom sites a user will add, we cannot restrict the content script to a fixed list of URL patterns in the manifest. Instead, the content script reads the current page's hostname, compares it against the user's configured list stored in chrome.storage.sync, and only shows the popup if there is a match. No page content, URLs, or browsing history is ever recorded or transmitted.

---

## Screenshots needed (take these yourself)

1. **The overlay** — Visit one of the blocked sites, screenshot the popup at full size (1280×800)
2. **The options page** — Screenshot of chrome://extensions options page showing the site list (1280×800)

Tip: Use Chrome DevTools → Ctrl+Shift+P → "Capture full size screenshot" for clean results.
