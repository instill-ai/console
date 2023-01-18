import { useQuery } from "react-query";
import { listRepoFileContent } from "@/lib/github";

export const useMgmtDefinition = () => {
  return useQuery(
    ["mgmt", "encoded-definition"],
    async (): Promise<string> => {
      const { content } = await listRepoFileContent(
        "instill-ai",
        "mgmt-backend",
        "config/models/user.json"
      );

      const decode = window.atob(content);
      return Promise.resolve(decode);
    },
    {
      retry: 3,
    }
  );
};
