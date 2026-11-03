/**
 * Map Eastern Arabic (٠–٩), Persian/Urdu (۰–۹), and ASCII digits to ASCII.
 * Other characters are left unchanged.
 */
const DIGIT_MAP: Record<string, string> = {
  // Eastern Arabic (Arabic-Indic)
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
  // Persian / Urdu (Extended Arabic-Indic)
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
};

export function normalizeDigits(text: string): string {
  let out = "";
  for (const ch of text) {
    out += DIGIT_MAP[ch] ?? ch;
  }
  return out;
}
