export function randomId() {
  return `es-overlay-${Math.random().toString(36).slice(2, 11)}`;
}
