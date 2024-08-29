import { ModelState, Nullable } from "instill-sdk";

export const OPERATION_POLL_TIMEOUT = 5000;
export const TABLE_PAGE_SIZE = 10;

export const getStatusMessage = (
  state: Nullable<ModelState>,
  hardwareType: string
) => {
  switch (state) {
    case "STATE_OFFLINE":
    case "STATE_STARTING":
    case "STATE_IDLE":
      return "Model deployment takes time. Credits won't be consumed during this period. Please wait.";
    case "STATE_SCALING_UP":
    case "STATE_SCALING_DOWN":
      return `The requested ${hardwareType || ""} compute resource is being provisioned, please wait.`;
    case "STATE_ACTIVE":
      return "Your request is being processed, please hold on.";
    default:
      return "Your request is being processed, please hold on.";
  }
};