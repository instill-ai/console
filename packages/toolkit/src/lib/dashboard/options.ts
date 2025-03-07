import { SelectOption } from "@instill-ai/design-system";

const timeLineOptions: SelectOption[] = [
  {
    label: "Today",
    value: "24h",
  },
  {
    label: "7 days",
    value: "7d",
  },
  {
    label: "30 days",
    value: "30d",
  },
];

const modeOptions: SelectOption[] = [
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

const statusOptions: SelectOption[] = [
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

export const dashboardOptions = {
  timeLine: timeLineOptions,
  mode: modeOptions,
  status: statusOptions,
};
