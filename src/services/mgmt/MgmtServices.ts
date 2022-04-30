import { listRepoFileContent } from "lib/github";
import { useMemo } from "react";
import { parse } from "yaml";

import { useQuery } from "react-query";

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
