import { ModelState, Nullable } from "instill-sdk";

export const OPERATION_POLL_TIMEOUT = 5000;
export const TABLE_PAGE_SIZE = 10;

export const getStatusMessage = (state: Nullable<ModelState>, hardwareType: string) => {
    switch (state) {
        case "STATE_OFFLINE":
            return "Model deployment takes time. Credits won't be consumed during this period. Please wait.";
        case "STATE_ACTIVE":
        case "STATE_SCALING_DOWN":
        case "STATE_STARTING":
        case "STATE_IDLE":
            return "Your request is being processed, please hold on.";
        case "STATE_SCALING_UP":
            return `The requested ${hardwareType || ""} compute resource is being provisioned, please wait.`;
        default:
            return "Our CPU/GPU is powering up—it might take a moment.";
    }
};