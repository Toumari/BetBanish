chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type !== 'leave-site' || sender.id !== chrome.runtime.id || !sender.tab || sender.frameId !== 0) {
    return false;
  }

  // The destination and tab come from the extension, never from page input.
  chrome.tabs.update(sender.tab.id, { url: 'chrome://newtab/' }, () => {
    sendResponse({ ok: !chrome.runtime.lastError });
  });
  return true;
});
