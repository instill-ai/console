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
    label: "Completed",
    value: "completed",
  },
  {
    label: "Errored",
    value: "errored",
  },
];

export const defaultSelectOption: SingleSelectOption = {
  label: "ALL",
  value: "all",
};
