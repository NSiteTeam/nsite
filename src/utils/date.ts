/**
 * Convert a timestamp to a date string (french format)
 * @param ISOtimestamp the timestamp to convert
 * @returns the date in format DD/MM/YYYY
 */
export function timestampToFrenchDate(ISOtimestamp: string): string {
  return ISOtimestamp.split('T')[0].split('-').reverse().join('/')
}
