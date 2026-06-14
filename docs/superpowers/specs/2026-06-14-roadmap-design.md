# Gambling Blocker — Product Roadmap

**Date:** 2026-06-14  
**Status:** Approved  
**Approach:** Strict versioned milestones — each version ships to the Chrome Web Store before the next begins.

---

## Context

Gambling Blocker is a Chrome MV3 extension that injects a full-screen loss-calculator overlay on 65+ UK gambling sites. A 10-second countdown forces a pause before the user can continue. Users can toggle default sites and add custom ones via an options page. Settings are stored in `chrome.storage.sync`.

The extension is pre-launch. It is currently used personally, with a goal of eventual public offering on the Chrome Web Store.

**Design philosophy:** friction-based nudge, not hard block. The user can always continue — the point is the pause.

---

## v1 — Polish & Launch

**Headline:** Make the extension feel trustworthy and visually distinctive before submitting to the Web Store.

### Overlay redesign
- Stronger typographic hierarchy — the headline "Before you gamble, consider this." should land with emotional weight
- Loss figures styled to feel significant, not like a plain HTML table
- Countdown button redesigned — should feel like a deliberate pause mechanism, not a disabled form field
- Responsive: looks correct on narrow browser windows

### Options page redesign
- Consistent visual language with the overlay
- Clearer section hierarchy between default sites and custom sites
- Inline feedback when a site is added or removed

### Store assets
- Two screenshots at 1280×800: the overlay and the options page
- Privacy policy URL filled in (`store-listing.md` currently has a placeholder)

### Acceptance criteria
Install from unpacked, visit bet365.com, overlay looks polished enough to screenshot for the store listing. Submit to Chrome Web Store.

---

## v2 — Statistics & Streaks

**Headline:** Give users a reason to keep the extension installed long-term by showing them the impact it's having.

### What gets tracked
All data is stored locally and never transmitted.

- **Total intercept count** — how many times the overlay has fired
- **Continue count** — how many times "Continue anyway" was clicked
- **Current streak** — consecutive days where the overlay fired but was not continued through
- **Best streak** — all-time record

### Where stats live
- **Browser action popup** (`popup.html`) — compact stats card shown when clicking the extension icon: intercept count, current streak, best streak
- **Options page** — "Your stats" section with a reset button

### Technical additions
- `background.js` — service worker listening for messages from the content script via `chrome.runtime.sendMessage`
- Stats stored in `chrome.storage.local` (not sync — personal/device data)
- Content script sends a message when the overlay fires, and a separate message when "Continue anyway" is clicked
- `manifest.json` updated to declare `action` and register the background service worker

### Acceptance criteria
Visit a blocked site, dismiss without continuing — intercept count increments, streak updates. Click "Continue anyway" on a separate visit — continue count increments, streak resets to 0.

---

## v3 — Scheduling

**Headline:** Let users define when the blocker is active so it fits their life rather than being all-or-nothing.

### Controls (options page)
- **Active hours** — time range picker (e.g. 8pm–midnight); default: always active
- **Active days** — day-of-week checkboxes (e.g. weekends only); default: all days

### How it works
- Background service worker evaluates current time and day when content script checks in
- Content script sends a "should I block?" message before injecting the overlay; service worker responds based on the active schedule
- No overlay injected if the current time/day falls outside the configured schedule

### Acceptance criteria
Set schedule to "Saturdays only", visit bet365.com on a weekday — no overlay. Visit on a Saturday — overlay fires with correct countdown.

---

## v4 — Platform Reach

**Headline:** Expand beyond Chrome to grow the potential user base.

### Firefox
- WebExtensions API is largely compatible; `chrome.*` calls need aliasing or a polyfill (`browser` namespace)
- Submit to Mozilla Add-ons (addons.mozilla.org)
- Verify overlay z-index and CSS rendering in Firefox (historically differs from Chrome)

### Edge
- Chrome extensions install directly from the Chrome Web Store on Edge
- Verify the extension works correctly; likely zero code changes required

### Safari (stretch goal)
- Requires Xcode and the Safari Web Extension Converter
- Separate App Store submission process
- Significant additional effort — treat as optional

### Acceptance criteria
Install on Firefox via AMO, visit paddypower.com — overlay fires with correct 10-second countdown.

---

## Non-goals (across all versions)

- Hard blocking (no bypass, PIN/password required) — out of scope by design
- Account system or cloud sync of personal stats
- Mobile browser support
- Monetisation features
