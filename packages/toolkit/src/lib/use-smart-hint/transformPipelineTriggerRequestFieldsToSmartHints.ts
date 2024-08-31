import type { PipelineVariableFieldMap } from "instill-sdk";

import { SmartHint } from "./types";

export function transformPipelineTriggerRequestFieldsToSmartHints(
  fields: PipelineVariableFieldMap,
): SmartHint[] {
  const hints: SmartHint[] = [];
  for (const [key, value] of Object.entries(fields)) {
    if (value) {
      hints.push({
        path: `variable.${key}`,
        key: key,
        instillFormat: value.instillFormat ?? "null",
        type: "null",
      });
    }
  }

  return hints;
}
