import { SingleSelectOption } from "@instill-ai/design-system";

export const mockMgmtRoles: SingleSelectOption[] = [
  {
    label: "Manager (who makes decisions)",
    value: "Manager",
  },
  {
    label:
      "AI Researcher (who devises ML algorithms, trains and evaluates models)",
    value: "AI Researcher",
  },
  {
    label:
      "AI Engineer (who prepares dataset and makes models delivered by AI Researchers production-ready)",
    value: "AI Engineer",
  },
  {
    label:
      "Data Engineer (who builds data pipeline for data analytics or applications)",
    value: "Data Engineer",
  },
  {
    label: "Data Scientist (who analyses data for distilling business value)",
    value: "Data Scientist",
  },
  {
    label:
      "Analytics Engineer (who possesses skills of both Data Scientist and Data Engineer)",
    value: "Analytics Engineer",
  },
  {
    label: "Hobbyist (I love AI!)",
    value: "Hobbyist",
  },
];
