export function fillArrayWithZeros<T>(arr: T[], length: number): T[] {
  const resultArray = Array.from(
    { length },
    (_, index) => arr[index] || (0 as T)
  );
  return resultArray;
}
