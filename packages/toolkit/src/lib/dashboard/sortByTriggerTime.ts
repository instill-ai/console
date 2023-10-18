import { PipelineTriggerRecord } from "../vdp-sdk";

export function sortByTriggerTime(
  data: PipelineTriggerRecord[]
): PipelineTriggerRecord[] {
  return data.sort(
    (a, b) =>
      new Date(b.trigger_time).getTime() - new Date(a.trigger_time).getTime()
  );
}
