import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { watchUserModel } from "../../vdp-sdk";

export function useWatchUserModel({
  modelName,
  accessToken,
  enabled,
  retry,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (modelName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["models", modelName, "watch"],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!modelName) {
        return Promise.reject(new Error("Model name not provided"));
      }

      const watch = await watchUserModel({
        modelName,
        accessToken,
      });

      return Promise.resolve(watch);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
}
