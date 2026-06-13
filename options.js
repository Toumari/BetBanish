function renderDefaultSites(disabledDefaults) {
  const container = document.getElementById('default-sites');
  container.innerHTML = DEFAULT_SITES.map(site => `
    <div class="site-row">
      <label>
        <input type="checkbox" data-site="${site}" ${disabledDefaults.includes(site) ? '' : 'checked'}>
        ${site}
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
  container.innerHTML = customSites.map(site => `
    <div class="site-row">
      <span style="font-size:0.95rem">${site}</span>
      <button class="remove-btn" data-site="${site}" title="Remove">✕</button>
    </div>
  `).join('');

  container.querySelectorAll('.remove-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      chrome.storage.sync.get({ customSites: [] }, data => {
        const updated = data.customSites.filter(s => s !== btn.dataset.site);
        chrome.storage.sync.set({ customSites: updated }, () => renderCustomSites(updated));
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
  chrome.storage.sync.get({ customSites: [] }, data => {
    if (data.customSites.includes(site)) return;
    const updated = [...data.customSites, site];
    chrome.storage.sync.set({ customSites: updated }, () => {
      renderCustomSites(updated);
      input.value = '';
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
