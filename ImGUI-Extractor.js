(function () {
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);
  const style = document.createElement('style');
  style.textContent = `
    #m3u8-catcher-panel {
      position: fixed;
      bottom: 30px;
      right: 30px;
      width: 480px;
      height: 500px;
      background: rgba(25, 35, 45, 0.35);
      border-radius: 24px;
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border: 1.8px solid rgba(0, 255, 255, 0.25);
      box-shadow:
        0 8px 32px 0 rgba(0, 255, 255, 0.2),
        inset 0 0 12px rgba(0, 255, 255, 0.15);
      display: flex;
      flex-direction: column;
      font-family: 'Montserrat', sans-serif;
      color: #a0f0ff;
      user-select: none;
      z-index: 9999999;
    }
    #m3u8-catcher-panel header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 22px 28px;
      border-bottom: 1px solid rgba(0, 255, 255, 0.15);
      font-weight: 600;
      font-size: 22px;
      color: #00ffffcc;
      text-shadow: 0 0 14px #00ffffaa;
      user-select: text;
    }
    #m3u8-catcher-panel header #close-btn {
      cursor: pointer;
      font-weight: 700;
      font-size: 26px;
      color: #00ffffcc;
      transition: color 0.3s ease;
      user-select: none;
    }
    #m3u8-catcher-panel header #close-btn:hover {
      color: #00ffff;
      text-shadow: 0 0 20px #00ffff;
    }
    #m3u8-urls-list {
      flex-grow: 1;
      overflow-y: auto;
      padding: 20px 28px;
      scrollbar-width: thin;
      scrollbar-color: #00ffff44 transparent;
      user-select: text;
    }
    #m3u8-urls-list::-webkit-scrollbar {
      width: 10px;
    }
    #m3u8-urls-list::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 6px;
    }
    #m3u8-urls-list::-webkit-scrollbar-thumb {
      background-color: #00ffff44;
      border-radius: 6px;
    }
    .url-entry {
      background: rgba(0, 255, 255, 0.08);
      border-radius: 14px;
      padding: 14px 20px;
      margin-bottom: 16px;
      box-shadow: 0 0 12px 1px rgba(0, 255, 255, 0.2);
      cursor: pointer;
      transition: background 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      user-select: text;
      position: relative;
    }
    .url-entry:hover {
      background: rgba(0, 255, 255, 0.15);
      box-shadow:
        0 0 20px 3px rgba(0, 255, 255, 0.6);
    }
    .url-title {
      font-weight: 600;
      font-size: 15px;
      color: #7effffcc;
      margin-bottom: 6px;
      text-shadow: 0 0 6px rgba(0, 255, 255, 0.7);
      user-select: text;
    }
    .url-link {
      font-size: 13px;
      color: #a0f0ffcc;
      word-break: break-all;
      user-select: text;
    }
    .copy-btn {
      position: absolute;
      top: 14px;
      right: 20px;
      background: rgba(0, 255, 255, 0.12);
      border-radius: 50%;
      width: 26px;
      height: 26px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: #00ffffcc;
      cursor: pointer;
      transition: background 0.3s ease, color 0.3s ease;
      user-select: none;
      box-shadow: 0 0 8px rgba(0, 255, 255, 0.25);
    }
    .copy-btn:hover {
      background: rgba(0, 255, 255, 0.3);
      color: #00ffff;
      box-shadow:
        0 0 12px 3px #00ffffcc,
        0 0 18px 6px #00ffff88;
    }
    .tooltip {
      position: fixed;
      background: #00ffffdd;
      color: #003333;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
      user-select: none;
      white-space: nowrap;
      z-index: 10000001;
      box-shadow: 0 0 10px #00ffffbb;
    }
    .tooltip.visible {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);

  const panel = document.createElement('div');
  panel.id = 'm3u8-catcher-panel';
  panel.innerHTML = `
    <header>
      <div>🎬 Captured .m3u8 URLs</div>
      <div id="close-btn" title="Close panel">&times;</div>
    </header>
    <div id="m3u8-urls-list" aria-live="polite" aria-relevant="additions"></div>
  `;
  document.body.appendChild(panel);

  const closeBtn = panel.querySelector('#close-btn');
  const urlsList = panel.querySelector('#m3u8-urls-list');

  closeBtn.onclick = () => panel.remove();
  let tooltip;
  function showTooltip(text, x, y) {
    if (!tooltip) {
      tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      document.body.appendChild(tooltip);
    }
    tooltip.textContent = text;
    tooltip.style.left = x + 'px';
    tooltip.style.top = y + 'px';
    tooltip.classList.add('visible');
    setTimeout(() => tooltip.classList.remove('visible'), 1200);
  }

  const seenUrls = new Set();

  const pageTitle = document.title.trim() || 'Unknown title';

  function addUrl(url) {
    if (!url || !/^https?:\/\/.+\.m3u8/.test(url)) return;
    if (seenUrls.has(url)) return;
    seenUrls.add(url);

    const entry = document.createElement('div');
    entry.className = 'url-entry';

    const titleDiv = document.createElement('div');
    titleDiv.className = 'url-title';
    titleDiv.textContent = pageTitle;

    const linkDiv = document.createElement('div');
    linkDiv.className = 'url-link';
    linkDiv.textContent = url;

    const copyBtn = document.createElement('div');
    copyBtn.className = 'copy-btn';
    copyBtn.title = 'Copy to clipboard';
    copyBtn.innerHTML = '📋';

    copyBtn.onclick = (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(url).then(() => {
        const rect = copyBtn.getBoundingClientRect();
        showTooltip('Copied!', rect.left + rect.width / 2, rect.top - 28);
      }).catch(() => alert('Failed to copy URL!'));
    };

    entry.appendChild(titleDiv);
    entry.appendChild(linkDiv);
    entry.appendChild(copyBtn);

    entry.onclick = () => {
      navigator.clipboard.writeText(url).then(() => {
        const rect = entry.getBoundingClientRect();
        showTooltip('Copied!', rect.left + rect.width / 2, rect.top - 28);
      }).catch(() => alert('Failed to copy URL!'));
    };

    urlsList.appendChild(entry);

    if (seenUrls.size === 1) {
      console.clear();
      console.log(`✅ First .m3u8 URL captured and copied:\n${url}`);
      navigator.clipboard.writeText(url).catch(() => {});
    } else {
      console.log(`ℹ️ .m3u8 URL captured:\n${url}`);
    }
  }

  if (!window._m3u8CatcherFetchHooked) {
    window._m3u8CatcherFetchHooked = true;
    const originalFetch = window.fetch;
    window.fetch = async function (...args) {
      const url = args[0];
      if (typeof url === 'string' && url.includes('.m3u8')) {
        addUrl(url);
      }
      return originalFetch.apply(this, args);
    };
  }

  if (!window._m3u8CatcherXHRHooked) {
    window._m3u8CatcherXHRHooked = true;
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url, ...rest) {
      if (typeof url === 'string' && url.includes('.m3u8')) {
        addUrl(url);
      }
      return originalOpen.call(this, method, url, ...rest);
    };
  }

  let autoplayAttempts = 0;
  function tryAutoplay() {
    if (autoplayAttempts > 1) return;
    autoplayAttempts++;

    const vids = document.getElementsByTagName('video');
    if (!vids.length) return;
    const video = vids[0];

    ['pointerdown', 'mousedown', 'mouseup', 'click', 'focus'].forEach(evtName => {
      const evt = new Event(evtName, { bubbles: true, cancelable: true });
      video.dispatchEvent(evt);
      document.body.dispatchEvent(evt);
    });

    video.play().then(() => {
      console.log('▶️ Video auto-played after user gesture simulation.');
    }).catch(e => {
      console.warn('❌ Auto-play failed:', e);
    });
  }

  setTimeout(tryAutoplay, 1000);
  setTimeout(tryAutoplay, 3000);
})();
