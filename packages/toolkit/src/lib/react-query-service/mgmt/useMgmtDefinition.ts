import { useQuery } from "@tanstack/react-query";
import { listRepoFileContent } from "../../github";

export const useMgmtDefinition = ({
  enabled,
  retry,
}: {
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
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
      enabled: enabled,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
