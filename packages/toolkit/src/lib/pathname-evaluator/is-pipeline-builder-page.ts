import { Nullable } from "../type";

export function isPipelineBuilderPage(path: Nullable<string>) {
  if (
    path &&
    path.split("/")[2] === "pipelines" &&
    path.split("/")[4] === "builder"
  ) {
    return true;
  }
  return false;
}
