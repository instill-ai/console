import { Nullable } from "../type";

export function isModelOverviewPage(path: Nullable<string>) {
  const pathArray = path ? path.split("/") : null;
  if (pathArray && pathArray[2] === "models" && pathArray[3]) {
    return true;
  }
  return false;
}
