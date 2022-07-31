export function nextFrame(callback: () => void) {
  requestAnimationFrame(() => requestAnimationFrame(callback))
}
