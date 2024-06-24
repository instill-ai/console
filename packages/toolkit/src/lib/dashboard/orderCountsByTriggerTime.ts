import { Count } from "../vdp-sdk";

export function orderCountsByTriggerTime(counts: Count[]): Count[] {
  const formattedCounts: Count[] = counts.map((count) => {
    const triggerTime = new Date(count.triggerTime);
    return { ...count, triggerTime };
  });

  const sortedCounts = formattedCounts.sort(
    (a, b) =>
      new Date(a.triggerTime).getTime() - new Date(b.triggerTime).getTime(),
  );

  return sortedCounts;
}
