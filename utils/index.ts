export function shuffleArray(array: any[]) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function getNumOfColumnns(itemCount: number) {
  if (itemCount <= 1) {
    return 1;
  }
  if (itemCount <= 4) {
    return 2;
  }
  if (itemCount <= 9) {
    return 3;
  }
  if (itemCount <= 12) {
    return 4;
  }
  if (itemCount <= 20) {
    return 5;
  }
  return 6;
}
