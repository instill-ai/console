import { useQuery } from "@tanstack/react-query";
import { listRepoFileContent } from "../../github";

export function useMgmtDefinition({
  enabled,
  retry,
}: {
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery(
    ["mgmt", "encoded-definition"],
    async () => {
      const { content } = await listRepoFileContent(
        "instill-ai",
        "mgmt-backend",
        "config/models/user.json"
      );

      const decode = window.atob(content);
      return Promise.resolve(decode);
    },
    {
      enabled: enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
