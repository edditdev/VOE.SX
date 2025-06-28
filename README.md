# VOE.SX
VOE.SX | M3U8 URL Extractor 

A lightweight script to automatically capture `.m3u8` video stream URLs loaded by a webpage and display them in a sleek, interactive panel. It lets you quickly find, view, and copy `.m3u8` links used for streaming HLS video content.
---

## Star this repo ⭐️

If you find this script useful, please **star this repository on GitHub** to support further improvements and updates!

---

## What does this script do?

- **Intercepts `.m3u8` URLs** by hooking into the browser's `fetch` API and `XMLHttpRequest` calls.
- Displays a **floating panel** on the webpage showing all unique `.m3u8` URLs captured in real-time.
- Allows you to **copy URLs to clipboard** by clicking either the URL entry or the copy button.
- Automatically **copies the first captured URL** to your clipboard for instant use.
- Tries to **simulate user gestures** to auto-play video elements, helping trigger streams on some pages.
- Styled with a modern, transparent glassmorphism effect and smooth animations for great UX.

---

## How does it work?

The script overrides native browser functions used for network requests (`fetch` and `XMLHttpRequest`) to detect URLs containing `.m3u8`. Whenever such a URL is requested, it is added to the visible panel if it hasn't been seen before.

Each URL entry shows the current page title and the full URL. Clicking the entry or the clipboard icon copies the URL to your clipboard and shows a tooltip confirmation.

The panel can be closed by clicking the top-right ✕ button, and it automatically adds a custom font and styles dynamically to the page.

<p align="center">
  <img src="https://i.imgur.com/8UUI3ca.png" alt="Centered Image" />
</p>

---

## How to use?

1. Open your browser's developer console (usually with `F12` or `Ctrl+Shift+I`).
2. Paste the entire script into the console and press Enter.
3. The M3U8 catcher panel will appear in the bottom-right corner.
4. Browse the site or play videos as usual.
5. Whenever an `.m3u8` URL is detected, it will appear in the panel.
6. Click any URL or the clipboard icon to copy it for use in your favorite video player or downloader.

---

## Why use this?

- Quickly grab streaming `.m3u8` links for analysis, download, or playback.
- No need to inspect network requests manually.
- Easy-to-use interface that works on any modern website streaming HLS content.


*Happy streaming!* 🚀
