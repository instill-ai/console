import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getUserModelQuery } from "../../../vdp-sdk";
import { getUseUserModelQueryKey } from "./server";

export function useUserModel({
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

  return useQuery({
    queryKey: getUseUserModelQueryKey(modelName),
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!modelName) {
        return Promise.reject(new Error("Model name not provided"));
      }

      const model = await getUserModelQuery({ modelName, accessToken });

      return Promise.resolve(model);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
