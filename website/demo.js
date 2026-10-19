// Run the real extension overlay with in-memory Chrome API responses.
// This preview never reads or writes the visitor's extension settings.
window.chrome = {
  storage: {
    sync: { get: (_defaults, callback) => callback({ disabledDefaults: [], customSites: [] }) }
  },
  runtime: {
    sendMessage: (_message, callback) => {
      callback({ ok: true });
      showResult('left');
    }
  }
};

function showResult(choice) {
  const overlay = document.getElementById('gambling-blocker-overlay');
  if (overlay) {
    overlay.close();
    overlay.remove();
  }
  document.getElementById('result-title').textContent = choice === 'left'
    ? 'A fresh start in a new tab.'
    : 'The choice stays with you.';
  document.getElementById('result-description').textContent = choice === 'left'
    ? 'In the extension, “Leave this site” opens Chrome’s New Tab page in the same tab, straight away.'
    : 'In the extension, continuing dismisses the pause for that website in the same tab session.';
  const result = document.getElementById('demo-result');
  result.hidden = false;
  result.focus();
}

window.addEventListener('DOMContentLoaded', () => {
  injectOverlay('I’m saving for a weekend away. Keep that promise to myself.', 'GBP');
  // The preview uses the real UI, but does not persist its tab-session flag.
  const continueButton = document.getElementById('gambling-blocker-btn');
  continueButton.addEventListener('click', event => {
    if (continueButton.disabled) return;
    event.stopImmediatePropagation();
    showResult('continued');
  }, true);
  document.getElementById('replay').addEventListener('click', () => location.reload());
});

// The extension intentionally prevents Escape. The website preview must be escapable.
window.addEventListener('keydown', event => {
  if (event.key === 'Escape' && window.parent !== window) {
    window.parent.postMessage('betbanish-close-preview', location.origin);
  }
}, true);
