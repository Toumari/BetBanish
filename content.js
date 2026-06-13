const PRESET_AMOUNTS = [1, 2, 5, 10, 25, 50];

function calculateLosses(daily) {
  return {
    week: daily * 7,
    month: Math.round(daily * 30.4),
    year: daily * 365
  };
}

function buildTableRows() {
  return PRESET_AMOUNTS.map(amount => {
    const { week, month, year } = calculateLosses(amount);
    return `<tr>
      <td>£${amount}</td>
      <td>£${week.toLocaleString('en-GB')}</td>
      <td>£${month.toLocaleString('en-GB')}</td>
      <td>£${year.toLocaleString('en-GB')}</td>
    </tr>`;
  }).join('');
}

function injectOverlay() {
  if (document.getElementById('gambling-blocker-overlay')) return;
  const container = document.createElement('div');
  container.id = 'gambling-blocker-overlay';

  container.innerHTML = `
    <div id="gambling-blocker-card">
      <h2>Before you gamble, consider this.</h2>
      <table>
        <thead>
          <tr>
            <th>Daily spend</th>
            <th>Week</th>
            <th>Month</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>${buildTableRows()}</tbody>
      </table>
      <p>That's real money. You don't have to.</p>
      <button id="gambling-blocker-btn" disabled>Continue in 10s...</button>
      <footer>
        GamCare: 0808 8020 133 &bull;
        <a href="https://www.begambleaware.org" target="_blank" rel="noopener">BeGambleAware</a>
      </footer>
    </div>
  `;

  document.body.appendChild(container);

  let seconds = 10;
  const btn = container.querySelector('#gambling-blocker-btn');

  const interval = setInterval(() => {
    seconds--;
    if (seconds <= 0) {
      clearInterval(interval);
      btn.disabled = false;
      btn.textContent = 'Continue anyway';
    } else {
      btn.textContent = `Continue in ${seconds}s...`;
    }
  }, 1000);

  btn.addEventListener('click', () => {
    clearInterval(interval);
    container.remove();
  });
}

chrome.storage.sync.get({ disabledDefaults: [], customSites: [] }, data => {
  if (isGamblingSite(window.location.hostname, data.disabledDefaults, data.customSites)) {
    injectOverlay();
  }
});
