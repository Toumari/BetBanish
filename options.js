function escapeHtml(str) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function showFeedback(message) {
  const el = document.getElementById('feedback');
  if (!el) return;
  el.textContent = message;
  setTimeout(() => { el.textContent = ''; }, 2500);
}

function renderDefaultSites(disabledDefaults) {
  const container = document.getElementById('default-sites');
  container.innerHTML = DEFAULT_SITES.map(site => `
    <div class="site-row">
      <label>
        <input type="checkbox" data-site="${escapeHtml(site)}" ${disabledDefaults.includes(site) ? '' : 'checked'}>
        ${escapeHtml(site)}
      </label>
    </div>
  `).join('');

  container.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', () => {
      chrome.storage.sync.get({ disabledDefaults: [] }, data => {
        const site = cb.dataset.site;
        let updated = [...data.disabledDefaults];
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
          <button class="remove-btn" title="Remove">✕</button>
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

document.getElementById('add-btn').addEventListener('click', () => {
  const input = document.getElementById('new-site');
  const site = input.value.trim()
    .replace(/^https?:\/\//, '')
    .replace(/\/.*/, '')
    .replace(/^www\./, '');
  if (!site) return;
  if (!/^[a-zA-Z0-9][a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}$/.test(site)) return;
  chrome.storage.sync.get({ customSites: [] }, data => {
    if (data.customSites.includes(site)) return;
    const updated = [...data.customSites, site];
    chrome.storage.sync.set({ customSites: updated }, () => {
      renderCustomSites(updated);
      input.value = '';
      showFeedback('Site added.');
    });
  });
});

document.getElementById('new-site').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('add-btn').click();
});

chrome.storage.sync.get({ disabledDefaults: [], customSites: [] }, data => {
  renderDefaultSites(data.disabledDefaults);
  renderCustomSites(data.customSites);
});
