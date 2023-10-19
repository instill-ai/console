import { Model, ModelState } from "../vdp-sdk";

export function determineModelState(models: Model[]): ModelState {
  if (models.some((e) => e.state === "STATE_ERROR")) {
    return "STATE_ERROR";
  } else if (models.some((e) => e.state === "STATE_ONLINE")) {
    return "STATE_ONLINE";
  } else {
    return "STATE_OFFLINE";
  }
}
