import { useQuery } from "@tanstack/react-query";
import { getOperatorDefinitionQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export function useOperatorDefinition({
  operatorDefinitionName,
  accessToken,
  enabled,
  retry,
}: {
  operatorDefinitionName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
}) {
  let enableQuery = false;

  if (operatorDefinitionName && enabled) {
    enableQuery = true;
  }

  return useQuery({
    queryKey: ["operator-definitions", operatorDefinitionName],
    queryFn: async () => {
      if (!operatorDefinitionName) {
        return Promise.reject(new Error("operatorDefinitionName not provided"));
      }

      const operatorDefinition = await getOperatorDefinitionQuery({
        operatorDefinitionName,
        accessToken,
      });

      return Promise.resolve(operatorDefinition);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
