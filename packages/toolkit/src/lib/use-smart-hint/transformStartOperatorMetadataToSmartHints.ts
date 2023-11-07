import { PipelineStartComponentConfigurationMetadata } from "../vdp-sdk";
import { SmartHint } from "./types";

export function transformStartOperatorMetadataToSmartHints(
  metadata: PipelineStartComponentConfigurationMetadata
): SmartHint[] {
  const hints: SmartHint[] = [];
  for (const [key, value] of Object.entries(metadata)) {
    hints.push({
      path: `start.${key}`,
      key: key,
      instillFormat: value.instillFormat ?? "null",
      type: value.type ?? "null",
    });
  }

  return hints;
}
