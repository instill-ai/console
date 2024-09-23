import { GeneralRecord, Nullable } from "../../../lib";
import { PipelineMetadata } from "../../pipeline-builder";

export function checkIsValidComponentMetadata(
  metadata?: Nullable<GeneralRecord>,
): metadata is PipelineMetadata {
  if (
    metadata &&
    "component" in metadata &&
    Object.keys(metadata.component).length > 0
  ) {
    return true;
  }

  return false;
}
