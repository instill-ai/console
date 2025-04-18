import type { PipelineTriggerRecord } from "instill-sdk";

export function sortByTriggerTime(
  data: PipelineTriggerRecord[],
): PipelineTriggerRecord[] {
  return data.sort(
    (a, b) =>
      new Date(b.triggerTime).getTime() - new Date(a.triggerTime).getTime(),
  );
}
