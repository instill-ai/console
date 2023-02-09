import { SingleSelectOption } from "@instill-ai/design-system";

export const mockMgmtRoles: SingleSelectOption[] = [
  {
    label: "Manager (who makes decisions)",
    value: "manager",
  },
  {
    label:
      "AI Researcher (who devises ML algorithms, trains and evaluates models)",
    value: "ai-researcher",
  },
  {
    label:
      "AI Engineer (who prepares dataset and makes models delivered by AI Researchers production-ready)",
    value: "ai-engineer",
  },
  {
    label:
      "Data Engineer (who builds data pipeline for data analytics or applications)",
    value: "data-engineer",
  },
  {
    label: "Data Scientist (who analyses data for distilling business value)",
    value: "data-scientist",
  },
  {
    label:
      "Analytics Engineer (who possesses skills of both Data Scientist and Data Engineer)",
    value: "analytics-engineer",
  },
  {
    label: "Hobbyist (I love AI!)",
    value: "hobbyist",
  },
];
