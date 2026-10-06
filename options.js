function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let feedbackTimer = null;
function showFeedback(message, isError = false) {
  const el = document.getElementById('feedback');
  if (!el) return;
  clearTimeout(feedbackTimer);
  el.textContent = message;
  el.dataset.error = String(isError);
  feedbackTimer = setTimeout(() => { el.textContent = ''; }, 2500);
}

function renderDefaultSites(disabledDefaults) {
  const container = document.getElementById('default-sites');
  container.innerHTML = DEFAULT_SITES.map(site => `
    <div class="site-row">
      <label>
        <input type="checkbox" data-site="${escapeHtml(site)}" ${disabledDefaults.map(normalizeSite).includes(site) ? '' : 'checked'}>
        ${escapeHtml(site)}
      </label>
    </div>
  `).join('');

  container.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      chrome.storage.sync.get({ disabledDefaults: [] }, data => {
        const site = cb.dataset.site;
        let updated = data.disabledDefaults.map(normalizeSite).filter(Boolean);
        if (cb.checked) {
          updated = updated.filter(s => s !== site);
        } else if (!updated.includes(site)) {
          updated.push(site);
        }
        chrome.storage.sync.set({ disabledDefaults: updated });
      });
    });
  });
}

function renderCustomSites(customSites) {
  const container = document.getElementById('custom-sites');
  container.innerHTML = customSites.length
    ? customSites.map(site => `
        <div class="site-row">
          <span style="font-size:0.9rem">${escapeHtml(site)}</span>
          <button class="remove-btn" title="Remove" aria-label="Remove ${escapeHtml(site)}">✕</button>
        </div>
      `).join('')
    : '<p style="font-size:0.85rem;color:#aaa;padding:8px 0 4px">No custom sites added yet.</p>';

  const buttons = container.querySelectorAll('.remove-btn');
  customSites.forEach((site, i) => {
    buttons[i].addEventListener('click', () => {
      chrome.storage.sync.get({ customSites: [] }, data => {
        const updated = data.customSites.filter(s => s !== site);
        chrome.storage.sync.set({ customSites: updated }, () => {
          renderCustomSites(updated);
          showFeedback('Site removed.');
        });
      });
    });
  });
}

document.getElementById('add-btn').addEventListener('click', async () => {
  const input = document.getElementById('new-site');
  const site = normalizeSite(input.value);
  if (!site) {
    showFeedback('Enter a valid website address, such as example.com.', true);
    input.focus();
    return;
  }
  const button = document.getElementById('add-btn');
  button.disabled = true;
  try {
    const data = await chrome.storage.sync.get({ disabledDefaults: [], customSites: [] });
    if (isGamblingSite(site, data.disabledDefaults, data.customSites)) {
      showFeedback('This site already has a pause.');
      return;
    }
    const updated = settingsWithSite(site, data.disabledDefaults, data.customSites);
    await chrome.storage.sync.set(updated);
    renderCustomSites(updated.customSites);
    renderDefaultSites(updated.disabledDefaults);
    input.value = '';
    showFeedback('Pause enabled. Reload the site or visit again to apply it.');
  } catch {
    showFeedback('Could not save this site. Please try again.', true);
  } finally {
    button.disabled = false;
  }
});

document.getElementById('new-site').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-btn').click();
});

chrome.storage.sync.get({ disabledDefaults: [], customSites: [] }, data => {
  if (chrome.runtime.lastError) {
    showFeedback('Could not load your sites. Reopen Settings to try again.', true);
    return;
  }
  renderDefaultSites(data.disabledDefaults);
  renderCustomSites(data.customSites);
});

const reminderInput = document.getElementById('personal-reminder');
const reminderButton = document.getElementById('save-reminder');
const reminderFeedback = document.getElementById('reminder-feedback');

chrome.storage.local.get({ personalReminder: '' }).then(data => {
  reminderInput.value = typeof data.personalReminder === 'string' ? data.personalReminder.slice(0, 160) : '';
  reminderInput.disabled = false;
  reminderButton.disabled = false;
}).catch(() => {
  reminderFeedback.textContent = 'Could not load your reminder. Reopen Settings to try again.';
  reminderFeedback.dataset.error = 'true';
});

document.getElementById('reminder-form').addEventListener('submit', async event => {
  event.preventDefault();
  if (reminderButton.disabled) return;
  reminderButton.disabled = true;
  reminderInput.disabled = true;
  reminderFeedback.textContent = '';
  try {
    const personalReminder = reminderInput.value.trim().slice(0, 160);
    await chrome.storage.local.set({ personalReminder });
    reminderInput.value = personalReminder;
    reminderFeedback.textContent = personalReminder ? 'Saved on this device. You’ll see it on your next pause.' : 'Reminder removed.';
    reminderFeedback.dataset.error = 'false';
  } catch {
    reminderFeedback.textContent = 'Could not save your reminder. Please try again.';
    reminderFeedback.dataset.error = 'true';
  } finally {
    reminderInput.disabled = false;
    reminderButton.disabled = false;
  }
});
