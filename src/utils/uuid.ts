/**
 * Return an uuid composed of current time and a random number
 */
export function uuid(): string {
  return Date.now().toString(36) + Math.random().toString(36)
}
