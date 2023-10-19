/* eslint-disable @typescript-eslint/no-explicit-any */

export function chunk<T>(arr: T[], chunkSize: number) {
  if (!chunkSize || chunkSize <= 0) throw "Invalid chunk size";
  const chunk: T[][] = [];
  for (let i = 0, len = arr.length; i < len; i += chunkSize) {
    chunk.push(arr.slice(i, i + chunkSize));
  }
  return chunk;
}
