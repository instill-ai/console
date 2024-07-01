import { Nullable } from "../type";

export function isPipelineBuilderPage(path: Nullable<string>) {
  const pathArray = path ? path.split("/") : null;

  if (pathArray && pathArray[2] === "pipelines" && pathArray[4] === "editor") {
    return true;
  }
  return false;
}
