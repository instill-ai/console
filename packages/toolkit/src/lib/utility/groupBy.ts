/**
 * Credit: https://stackoverflow.com/a/62765924
 */

/* eslint-disable  @typescript-eslint/no-explicit-any */

export function groupBy<T, K extends keyof any>(
  list: T[],
  getKey: (item: T) => K
) {
  return list.reduce(
    (previous, currentItem) => {
      const group = getKey(currentItem);
      if (!previous[group]) previous[group] = [];
      previous[group].push(currentItem);
      return previous;
    },
    {} as Record<K, T[]>
  );
}
