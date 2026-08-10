/**
 * Reduce a User-Agent header to a coarse "browser on OS" label.
 *
 * A full UA string is a fingerprinting surface: it carries browser and engine
 * versions, build identifiers, and often the device model. Stored next to a
 * name, email, and message body, that is far more identifying than anything the
 * lead record needs.
 *
 * Hashing would be the wrong tool here. UA strings have low entropy — many
 * people share one exactly — so a hash protects little while destroying the
 * only thing the value was useful for. Coarsening keeps the signal that is
 * actually wanted ("this came from Chrome on Android") and drops the rest.
 */

const BROWSERS: Array<[RegExp, string]> = [
  // Order matters: Edge and Opera also advertise Chrome, Chrome also
  // advertises Safari.
  [/\bEdg(?:e|A|iOS)?\//i, 'Edge'],
  [/\bOPR\/|\bOpera\//i, 'Opera'],
  [/\bSamsungBrowser\//i, 'Samsung Internet'],
  [/\bFirefox\/|\bFxiOS\//i, 'Firefox'],
  [/\bChrome\/|\bCriOS\//i, 'Chrome'],
  [/\bSafari\//i, 'Safari'],
];

const PLATFORMS: Array<[RegExp, string]> = [
  // iPadOS reports as Macintosh in desktop mode, so check touch hints first.
  [/\biPhone\b|\biPad\b|\biPod\b/i, 'iOS'],
  [/\bAndroid\b/i, 'Android'],
  [/\bCrOS\b/i, 'ChromeOS'],
  [/\bWindows\b/i, 'Windows'],
  [/\bMac OS X\b|\bMacintosh\b/i, 'macOS'],
  [/\bLinux\b/i, 'Linux'],
];

/**
 * Returns something like "Chrome on Windows", "Safari on iOS", "Bot", or
 * "Unknown". Never returns the original string.
 */
export function coarseUserAgent(ua: string | null | undefined): string | null {
  const s = (ua || '').trim();
  if (!s) return null;

  if (/\bbot\b|\bcrawler\b|\bspider\b|\bslurp\b|curl\/|wget\/|python-requests/i.test(s)) {
    return 'Bot';
  }

  const browser = BROWSERS.find(([re]) => re.test(s))?.[1];
  const platform = PLATFORMS.find(([re]) => re.test(s))?.[1];

  if (browser && platform) return `${browser} on ${platform}`;
  if (browser) return browser;
  if (platform) return platform;
  return 'Unknown';
}
