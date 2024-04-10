import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { fetchUserModel, getUseUserModelQueryKey } from "./server";

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
      return await fetchUserModel({
        modelName,
        accessToken,
      });
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
