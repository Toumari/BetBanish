(() => {
  const themeToggle = document.getElementById('theme-toggle');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  const currentDark = () => document.documentElement.dataset.theme
    ? document.documentElement.dataset.theme === 'dark' : systemTheme.matches;
  const updateThemeLabel = () => { themeToggle.textContent = currentDark() ? 'Use light theme' : 'Use dark theme'; };
  updateThemeLabel();
  themeToggle.hidden = false;
  themeToggle.addEventListener('click', () => {
    document.documentElement.dataset.theme = currentDark() ? 'light' : 'dark';
    updateThemeLabel();
  });
  systemTheme.addEventListener('change', updateThemeLabel);

  const dialog = document.getElementById('preview-dialog');
  const frame = document.getElementById('preview-frame');
  const opener = document.querySelector('[data-open-demo]');
  if (typeof dialog.showModal !== 'function') return;

  opener.hidden = false;
  opener.addEventListener('click', () => {
    frame.src = 'website/demo.html';
    dialog.showModal();
  });
  document.getElementById('close-preview').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    frame.removeAttribute('src');
    opener.focus();
  });
  window.addEventListener('message', event => {
    if (event.origin === location.origin && event.source === frame.contentWindow && event.data === 'betbanish-close-preview') dialog.close();
  });
})();
