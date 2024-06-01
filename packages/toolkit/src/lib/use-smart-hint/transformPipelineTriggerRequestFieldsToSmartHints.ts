import { PipelineVariableFieldMap } from "../vdp-sdk";
import { SmartHint } from "./types";

export function transformPipelineTriggerRequestFieldsToSmartHints(
  fields: PipelineVariableFieldMap
): SmartHint[] {
  const hints: SmartHint[] = [];
  for (const [key, value] of Object.entries(fields)) {
    hints.push({
      path: `trigger.${key}`,
      key: key,
      instillFormat: value.instillFormat ?? "null",
      type: "null",
    });
  }

  return hints;
}
