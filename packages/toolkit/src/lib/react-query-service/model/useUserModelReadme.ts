import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getUserModelReadmeQuery } from "../../vdp-sdk";

export const useUserModelReadme = ({
  modelName,
  accessToken,
  enabled,
  retry,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (modelName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["models", modelName, "readme"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!modelName) {
        return Promise.reject(new Error("Modelname not provided"));
      }

      const modelReadme = await getUserModelReadmeQuery({
        modelName,
        accessToken,
      });

      return Promise.resolve(window.atob(modelReadme.content));
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
