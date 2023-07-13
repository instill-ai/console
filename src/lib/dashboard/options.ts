import { Status, StatusCount } from "@/types";
import { SingleSelectOption } from "@instill-ai/design-system";

export const timeLineOptions: SingleSelectOption[] = [
  {
    label: "Today",
    value: "24h",
  },
  {
    label: "Last day",
    value: "1d",
  },
  // {
  //   label: "2 days",
  //   value: "2d",
  // },
  // {
  //   label: "3 days",
  //   value: "3d",
  // },
  // {
  //   label: "4 days",
  //   value: "4d",
  // },
  {
    label: "7 days",
    value: "7d",
  },
  {
    label: "30 days",
    value: "30d",
  },
];

export const modeOptions: SingleSelectOption[] = [
  {
    label: "ALL",
    value: "all",
  },
  {
    label: "SYNC",
    value: "MODE_SYNC",
  },
  {
    label: "ASYNC",
    value: " MODE_ASYNC",
  },
];

export const statusOptions: SingleSelectOption[] = [
  {
    label: "ALL",
    value: "all",
  },
  {
    label: "Active",
    value: "STATE_ACTIVE",
  },
  {
    label: "Inactive",
    value: "STATE_INACTIVE",
  },
  {
    label: "Deleted",
    value: "STATE_ERROR",
  },
];

export const defaultSelectOption: SingleSelectOption = {
  label: "ALL",
  value: "all",
};

export const defaultStatusCount: StatusCount = {
  completed: {
    state: "completed",
    amount: 0,
    type: "pipeline",
    change: 0,
  },
  errored: {
    state: "errored",
    amount: 0,
    type: "pipeline",
    change: 0,
  },
};
