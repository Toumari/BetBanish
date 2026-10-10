const PRESET_AMOUNTS = [1, 2, 5, 10, 25, 50];
const currencyTools = typeof module !== 'undefined' && module.exports ? require('./currency') : BetBanishCurrency;

function calculateLosses(daily) {
  return {
    week: daily * 7,
    month: Math.round(daily * 30.4),
    year: daily * 365
  };
}

function buildTableRows(currency = 'auto', languages) {
  const money = currencyTools.formatter(currency, languages);
  return PRESET_AMOUNTS.map(amount => {
    const { week, month, year } = calculateLosses(amount);
    return `<tr>
      <td><bdi>${money.format(amount)}</bdi></td>
      <td><bdi>${money.format(week)}</bdi></td>
      <td><bdi>${money.format(month)}</bdi></td>
      <td><bdi>${money.format(year)}</bdi></td>
    </tr>`;
  }).join('');
}

function injectOverlay(personalReminder = '', currencyPreference = 'auto') {
  if (document.getElementById('gambling-blocker-overlay')) return;
  const currency = currencyTools.resolve(currencyPreference);
  const previousFocus = document.activeElement;
  const container = document.createElement('dialog');
  container.id = 'gambling-blocker-overlay';
  container.setAttribute('aria-labelledby', 'gambling-blocker-heading');
  container.setAttribute('closedby', 'none');

  container.innerHTML = `
    <div id="gambling-blocker-card">
      <div id="gambling-blocker-context" tabindex="0" aria-label="Your reminder and spending projections">
      <span id="gambling-blocker-eyebrow">Pause</span>
      <h2 id="gambling-blocker-heading">Before you gamble, take a moment.</h2>
      <div id="gambling-blocker-reminder" hidden>
        <span>Your reason to pause</span>
        <p></p>
      </div>
      <table>
        <caption>What daily spending adds up to (${currency})</caption>
        <thead>
          <tr>
            <th>Daily spend</th>
            <th>Week</th>
            <th>Month</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>${buildTableRows(currency)}</tbody>
      </table>
      <p id="gambling-blocker-explanation">Spending projections, not a prediction of losses.</p>
      </div>
      <button id="gambling-blocker-leave" type="button">Leave this site</button>
      <button id="gambling-blocker-btn" disabled>Continue in 10s...</button>
      <p id="gambling-blocker-error" role="status" hidden></p>
      <footer>
        GamCare: 0808 8020 133 &bull;
        <a href="https://www.begambleaware.org" target="_blank" rel="noopener">BeGambleAware</a>
      </footer>
    </div>
  `;

  if (typeof personalReminder === 'string' && personalReminder.trim()) {
    const reminder = container.querySelector('#gambling-blocker-reminder');
    reminder.querySelector('p').textContent = personalReminder.trim().slice(0, 160);
    reminder.hidden = false;
  }

  document.body.appendChild(container);
  container.addEventListener('cancel', event => event.preventDefault());
  container.addEventListener('keydown', event => {
    if (event.key === 'Escape') event.preventDefault();
  });
  container.showModal();

  let seconds = 10;
  const btn = container.querySelector('#gambling-blocker-btn');
  const leaveBtn = container.querySelector('#gambling-blocker-leave');
  leaveBtn.focus();

  leaveBtn.addEventListener('click', () => {
    leaveBtn.disabled = true;
    leaveBtn.textContent = 'Leaving…';
    chrome.runtime.sendMessage({ type: 'leave-site' }, response => {
      if (chrome.runtime.lastError || !response?.ok) {
        leaveBtn.disabled = false;
        leaveBtn.textContent = 'Leave this site';
        const error = container.querySelector('#gambling-blocker-error');
        error.textContent = 'Could not leave this page. Try again or close this tab.';
        error.hidden = false;
      }
    });
  });

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
    if (btn.disabled) return;
    clearInterval(interval);
    try {
      sessionStorage.setItem('__gambling_blocker_dismissed__', '1');
    } catch {
      // Browsers can deny page storage; continuing must still work.
    }
    container.close();
    container.remove();
    previousFocus?.focus();
  });
}

function wasDismissed() {
  try {
    return sessionStorage.getItem('__gambling_blocker_dismissed__') === '1';
  } catch {
    return false;
  }
}

if (typeof chrome !== 'undefined') {
  chrome.storage.sync.get({ disabledDefaults: [], customSites: [], currency: 'auto' }, data => {
    if (isGamblingSite(window.location.hostname, data.disabledDefaults, data.customSites)) {
      if (!wasDismissed()) {
        chrome.storage.local.get({ personalReminder: '' }, localData => {
          const reminder = chrome.runtime.lastError ? '' : localData.personalReminder;
          injectOverlay(reminder, data.currency);
        });
      }
    }
  });
}

if (typeof module !== 'undefined') module.exports = { calculateLosses, buildTableRows, injectOverlay, wasDismissed };
