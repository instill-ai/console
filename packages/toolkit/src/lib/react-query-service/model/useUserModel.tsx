import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getUserModelQuery } from "../../vdp-sdk";

export function useUserModel({
  modelName,
  accessToken,
  enabled,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  let enableQuery = false;

  if (modelName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["models", modelName],
    queryFn: async () => {
      if (!modelName) {
        return Promise.reject(new Error("Model name not provided"));
      }

      const model = await getUserModelQuery({ modelName, accessToken });

      return Promise.resolve(model);
    },
    enabled: enableQuery,
  });
}
