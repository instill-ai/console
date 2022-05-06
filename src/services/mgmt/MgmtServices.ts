import { listRepoFileContent } from "lib/github";
import { useMemo } from "react";
import { parse } from "yaml";

import { useQuery } from "react-query";
import { SingleSelectOption } from "@instill-ai/design-system";

type MgmtDefinitionJson = {
  title: string;
  type: string;
  $id: string;
  $schema: string;
  additionalProperties: boolean;
  description: string;
  required: string[];
  properties: Record<string, any>;
};

export const useGetMgmtDefinition = () => {
  return useQuery(["mgmt", "encoded-definition"], async (): Promise<string> => {
    const data = await listRepoFileContent(
      "instill-ai",
      "mgmt-backend",
      "protocol/mgmt_protocol.yaml"
    );

    return data.content;
  });
};

export const useMgmtDefinition = () => {
  const { data } = useGetMgmtDefinition();

  const decodedDefinition = useMemo(() => {
    if (data) {
      const decode = window.atob(data);
      return parse(decode);
    }
  }, [data]);

  return { mgmtDefinition: decodedDefinition };
};

export const mockMgmtRoles: SingleSelectOption[] = [
  {
    label: "Manager (who make decisions)",
    value: "manager",
  },
  {
    label:
      "AI Researcher (who devises ML algorithms, train and evaluate models)",
    value: "ai-researcher",
  },
  {
    label:
      "AI Engineer (who prepare dataset and make models delivered by AI Researchers production-ready)",
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
    label: "Hobbyist (I love Vision AI!)",
    value: "hobbyist",
  },
];
