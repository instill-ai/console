import { Count } from "../vdp-sdk";

export function orderCountsByTriggerTime(counts: Count[]): Count[] {
  const formattedCounts: Count[] = counts.map((count) => {
    const triggerTime = new Date(count.trigger_time);
    return { ...count, trigger_time: triggerTime };
  });

  const sortedCounts = formattedCounts.sort(
    (a, b) =>
      new Date(a.trigger_time).getTime() - new Date(b.trigger_time).getTime()
  );

  return sortedCounts;
}
