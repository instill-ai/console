import { Nullable } from "../type";

export function isPipelineOverviewPage(path: Nullable<string>) {
  const pathArray = path ? path.split("/") : null;
  if (pathArray && pathArray[2] === "pipelines" && pathArray[3]) {
    return true;
  }
  return false;
}
