(function () {
  const seenUrls = new Set();

  function logUrl(url) {
    if (!/^https?:\/\/.+\.m3u8/.test(url)) return;
    if (seenUrls.has(url)) return;
    seenUrls.add(url);

    window.chrome.webview.postMessage(url);
    if (seenUrls.size === 1) {
      navigator.clipboard.writeText(url).then(() => {
        console.clear();
        console.log(`✅ Przechwycono pierwszy .m3u8 URL i skopiowano do schowka:\n${url}`);
      }).catch(() => {
        console.log(`✅ Przechwycono pierwszy .m3u8 URL:\n${url}`);
      });
    } else {
      console.log(`ℹ️ Przechwycono dodatkowy .m3u8 URL:\n${url}`);
    }
  }

  // Hook fetch
  const origFetch = window.fetch;
  window.fetch = async function (...args) {
    const url = args[0];
    if (typeof url === 'string' && url.includes('.m3u8')) {
      logUrl(url);
    }
    return origFetch.apply(this, args);
  };

  // Hook XHR
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url, ...rest) {
    if (typeof url === 'string' && url.includes('.m3u8')) {
      logUrl(url);
    }
    return origOpen.call(this, method, url, ...rest);
  };

  // Bypass user gesture
  const simulateUserGesture = () => {
    const videos = document.getElementsByTagName('video');
    if (!videos.length) return false;
    const video = videos[0];

    const events = ['pointerdown', 'mousedown', 'mouseup', 'click', 'focus'];
    for (const evtName of events) {
      const evt = new Event(evtName, { bubbles: true, cancelable: true });
      video.dispatchEvent(evt);
      document.body.dispatchEvent(evt);
    }

    video.play().then(() => {
      console.log('▶️ Video odtwarzane po symulowanym user gesture');
    }).catch(err => {
      console.warn('❌ Nie udało się wymusić play:', err);
    });
    return true;
  };

  const tryStart = () => {
    if (simulateUserGesture()) return;
    setTimeout(() => {
      simulateUserGesture();
    }, 2000);
  };

  tryStart();

  console.log('👂 Nasłuchuję fetch/XHR w celu przechwycenia URL .m3u8');
})();