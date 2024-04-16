import { PipelineTriggerRequestFields } from "../vdp-sdk";
import { SmartHint } from "./types";

export function transformPipelineTriggerRequestFieldsToSmartHints(
  fields: PipelineTriggerRequestFields
): SmartHint[] {
  const hints: SmartHint[] = [];
  for (const [key, value] of Object.entries(fields)) {
    hints.push({
      path: `start.${key}`,
      key: key,
      instillFormat: value.instill_format ?? "null",
      type: "null",
    });
  }

  return hints;
}
