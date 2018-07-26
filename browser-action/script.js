var btn = document.getElementById('whitelist-btn');
btn.addEventListener('click', () => {
  chrome.runtime.sendMessage({type: 'WHITE_LIST'});
  btn.disabled = true;
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse();
  switch((message || {}).type) {
    case 'IN_WHITE_LIST':
      btn.disabled = true;
      break;
    case 'NOT_IN_WHITE_LIST':
      btn.disabled = false;
      break;
  }
});

chrome.runtime.sendMessage({ type: 'CHECK_WHITE_LIST' });
