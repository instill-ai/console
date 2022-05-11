import { Status } from "@/types/general";

export type ModelState =
  | "STATE_ONLINE"
  | "STATE_OFFLINE"
  | "STATE_ERROR"
  | "STATE_UNSPECIFIC";

export type Model = {
  id: string;
  instance: string;
  status: Status;
};

export const transformModelStateToStatus = (state: ModelState): Status => {
  switch (state) {
    case "STATE_ONLINE":
      return "active";
    case "STATE_OFFLINE":
      return "inactive";
    case "STATE_ERROR":
      return "error";
    default:
      return "unspecific";
  }
};
