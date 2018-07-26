'use strict';

function prettify(jsonStr) {
  try {
    var o = JSON.parse(jsonStr);
    return JSON.stringify(o, null, 4);
  } catch (e) {
    return jsonStr;
  }
}

function observerCallback(mutationsList) {
  for (var mutation of mutationsList) {
    if (mutation.type == 'childList' && mutation.addedNodes && mutation.addedNodes.length) {
      mutation.addedNodes.forEach(node => {
        if (node.className === 'box') {
          const payloadLabel = node.getElementsByClassName('msg-payload')[0];
          if (!payloadLabel.innerText) {
            const intervalHandle = setInterval(() => {
              if (payloadLabel.innerText) {
                payloadLabel.innerText = prettify(payloadLabel.innerText);
                clearInterval(intervalHandle);
              }
            }, 10);

          } else {
            payloadLabel.innerText = prettify(payloadLabel.innerText);
          }
        }
      });
    }
  }
};

var observer;

document.addEventListener('click', () => {
  const wrapperEl = document.getElementById('msg-wrapper');

  if (wrapperEl) {
    if (observer) {
      observer.disconnect();
    }

    observer = new MutationObserver(observerCallback.bind(this));
    observer.observe(wrapperEl, { attributes: true, childList: true, subtree: true });
  }
});