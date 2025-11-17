export function getRandomItems(items, count) {
  if (!Array.isArray(items) || items.length === 0 || count <= 0) {
    return [];
  }

  if (items.length <= count) {
    return [...items];
  }

  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}
