export function randomId() {
  return `overlay-kit-${Math.random().toString(36).slice(2, 11)}`;
}
