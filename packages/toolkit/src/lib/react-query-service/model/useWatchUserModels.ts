import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import type { ModelsWatchState } from "../../vdp-sdk";
import { watchUserModel } from "../../vdp-sdk";

export function useWatchUserModels({
  modelNames,
  accessToken,
  enabled,
}: {
  modelNames: Nullable<string[]>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;
  const queryKey = ["models", "watch"];

  if (modelNames && enabled && modelNames.length > 0) {
    enableQuery = true;

    queryKey.push(modelNames.join());
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!modelNames || modelNames.length === 0) {
        return Promise.reject(new Error("Model names not provided"));
      }

      const watches: ModelsWatchState = {};

      for (const modelName of modelNames) {
        try {
          const watch = await watchUserModel({
            modelName,
            accessToken,
          });
          watches[modelName] = watch;
        } catch (error) {
          watches[modelName] = null;
        }
      }

      return Promise.resolve(watches);
    },
    enabled: enableQuery,
  });
}
