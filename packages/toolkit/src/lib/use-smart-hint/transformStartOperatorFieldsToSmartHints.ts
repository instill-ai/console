import {
  PipelineStartComponent,
  PipelineStartComponentFields,
  StartOperatorMetadata,
} from "../vdp-sdk";
import { SmartHint } from "./types";

export function transformStartOperatorFieldsToSmartHints(
  fields: PipelineStartComponentFields
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
