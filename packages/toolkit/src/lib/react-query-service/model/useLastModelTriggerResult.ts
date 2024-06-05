import { useQuery } from "@tanstack/react-query";
import { getModelOperationResult } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useLastModelTriggerResult({
  modelName,
  accessToken,
  enabled,
  fullView,
  retry,
}: {
  modelName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  fullView?: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;
  const queryKey = ["models", "operation"];

  if (modelName && enabled) {
    enableQuery = true;

    queryKey.push(modelName);
    queryKey.push(`fullView=${Boolean(fullView)}`);
  }

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!modelName) {
        return Promise.reject(new Error("Model name not provided"));
      }

      const operation = await getModelOperationResult({
        modelName,
        accessToken,
        fullView: !!fullView,
      });

      return Promise.resolve(operation);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
