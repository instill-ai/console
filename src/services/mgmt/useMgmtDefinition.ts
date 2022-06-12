import { useQuery } from "react-query";
import { parse } from "yaml";
import { listRepoFileContent } from "@/lib/github";

const useMgmtDefinition = () => {
  return useQuery(
    ["mgmt", "encoded-definition"],
    async (): Promise<string> => {
      const { content } = await listRepoFileContent(
        "instill-ai",
        "mgmt-backend",
        "protocol/mgmt_protocol.yaml"
      );

      const decode = window.atob(content);
      return Promise.resolve(parse(decode));
    },
    {
      retry: 3,
    }
  );
};

export default useMgmtDefinition;
