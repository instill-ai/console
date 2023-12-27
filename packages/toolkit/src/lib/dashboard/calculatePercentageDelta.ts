export function calculatePercentageDelta(
  previousCount: number,
  currentCount: number
): number {
  if (previousCount === 0 && currentCount === 0) {
    return 0; // Both counts are zero, return 0 as percentage change
  }
  if (previousCount === 0) {
    return 100; // Previous count is zero, change is 100
  }
  if (currentCount === 0) {
    return -100; // Previous count is zero, change is -100
  }
  const delta = currentCount - previousCount;
  const percentageDelta = (delta / previousCount) * 100;
  return Math.round(percentageDelta);
}
