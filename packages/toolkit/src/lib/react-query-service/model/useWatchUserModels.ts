import { useQuery } from "@tanstack/react-query";
import { watchUserModel, type ModelsWatchState } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useWatchUserModels({
  modelNames,
  accessToken,
  enabled,
  retry,
}: {
  modelNames: Nullable<string[]>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) {
  let enableQuery = false;

  if (modelNames && enabled && modelNames.length > 0) {
    enableQuery = true;
  }

  return useQuery(
    ["models", "watch"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!modelNames || modelNames.length === 0) {
        return Promise.reject(new Error("Model names not provided"));
      }

      let watches: ModelsWatchState = {};

      for (const modelName of modelNames) {
        const watch = await watchUserModel({
          modelName,
          accessToken,
        });
        watches[modelName] = watch;
      }

      return Promise.resolve(watches);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
