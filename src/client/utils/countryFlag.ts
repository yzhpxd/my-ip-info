/** Convert an ISO 3166-1 alpha-2 country code to an emoji flag (e.g. "US" -> 🇺🇸). */
export function getCountryFlag(code?: string): string {
  if (code?.length !== 2) return '🌐';
  const codePoints = code
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}
