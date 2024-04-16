import { PipelineTrigger, TriggerByRequest } from "../../../lib";

export function isTriggerByRequest(
  trigger: PipelineTrigger
): trigger is TriggerByRequest {
  return "trigger_by_request" in trigger;
}
