const addButton = document.getElementById('add-site');
const siteName = document.getElementById('site-name');
const siteStatus = document.getElementById('site-status');
const siteDetail = document.getElementById('site-detail');
let currentSite = '';

function popupFeedback(message, isError = false) {
  const feedback = document.getElementById('feedback');
  feedback.textContent = message;
  feedback.dataset.error = String(isError);
  feedback.hidden = false;
}

function renderCoverage(settings) {
  const covered = isGamblingSite(currentSite, settings.disabledDefaults, settings.customSites);
  siteStatus.textContent = covered ? 'Pause enabled for this site' : 'This site is not on your pause list';
  siteDetail.textContent = covered
    ? 'New visits get a 10-second pause. After continuing, the pause stays dismissed for that site in the same tab.'
    : 'Add it to show a pause when you next visit. Its subdomains will be included too.';
  addButton.hidden = covered;
}

async function loadPopup() {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab?.url || 'about:blank');
    const restricted = url.hostname === 'chromewebstore.google.com' ||
      (url.hostname === 'chrome.google.com' && url.pathname.startsWith('/webstore'));
    currentSite = ['http:', 'https:'].includes(url.protocol) && !restricted ? normalizeSite(url.hostname) : '';
    if (!currentSite) {
      siteName.textContent = 'Open a website';
      siteStatus.textContent = 'BetBanish works on regular websites.';
      siteDetail.textContent = 'Browser pages, the Chrome Web Store, and local files cannot show a pause.';
      return;
    }
    siteName.textContent = currentSite;
    const settings = await chrome.storage.sync.get({ disabledDefaults: [], customSites: [] });
    renderCoverage(settings);
  } catch {
    siteName.textContent = 'Site status unavailable';
    siteStatus.textContent = 'Close and reopen this popup to try again.';
  }
}

addButton.addEventListener('click', async () => {
  addButton.disabled = true;
  try {
    const settings = await chrome.storage.sync.get({ disabledDefaults: [], customSites: [] });
    const updated = settingsWithSite(currentSite, settings.disabledDefaults, settings.customSites);
    await chrome.storage.sync.set(updated);
    renderCoverage(updated);
    popupFeedback('Pause enabled. Reload this page or visit again to apply it.');
  } catch {
    popupFeedback('Could not save this site. Please try again.', true);
  } finally {
    addButton.disabled = false;
  }
});

document.getElementById('open-settings').addEventListener('click', async () => {
  try {
    await chrome.runtime.openOptionsPage();
    window.close();
  } catch {
    popupFeedback('Could not open Settings. Please try again.', true);
  }
});

chrome.storage.local.get({ personalReminder: '' }).then(data => {
  if (typeof data.personalReminder === 'string' && data.personalReminder.trim()) {
    document.getElementById('reminder-status').textContent = 'Your personal reminder is ready for your next pause. Edit it in Settings.';
  }
}).catch(() => {
  document.getElementById('reminder-status').textContent = 'Manage your personal reminder in Settings.';
});

loadPopup();
