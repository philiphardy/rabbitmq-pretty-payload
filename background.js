function getDomain(url) {
  return url.split('://')[1].split('/')[0];
}

var whitelistedDomains;
chrome.storage.local.get(null, (domains) => {
  whitelistedDomains = domains;
  whitelistDomain('localhost:15672');
});

function whitelistDomain(domain) {
  chrome.storage.local.set({ [domain]: true });
  whitelistedDomains[domain] = true;
}

function getCurrentTab(callback) {
  chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true }, function (tabs) {
    if (!tabs || !tabs.length) return callback();
    callback(tabs[0]);
  });
}

function getCurrentDomain(callback) {
  getCurrentTab(tab => callback(getDomain(tab.url), tab));
}

function injectScript(tabId) {
  chrome.tabs.executeScript(tabId, { file: 'content-script.js' });
}

// listen for tabs to complete loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && getDomain(tab.url) in whitelistedDomains) {
    injectScript(tabId);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  sendResponse();

  switch((message || {}).type) {
    case 'WHITE_LIST':
        getCurrentDomain((domain, tab) => {
          whitelistDomain(domain);
          injectScript(tab.id);
        });
      break;
    case 'CHECK_WHITE_LIST':
        getCurrentDomain(domain => {
          if (domain in whitelistedDomains) {
            chrome.runtime.sendMessage({type: 'IN_WHITE_LIST'});
          } else {
            chrome.runtime.sendMessage({type: 'NOT_IN_WHITE_LIST'});
          }
        });
      break;
    default:
      break;
  }
});