import { Nullable } from "../type";

export function isPipelineOverviewPage(path: Nullable<string>) {
  if (path && path.split("/")[2] === "pipelines" && path.split("/")[3]) {
    return true;
  }
  return false;
}
