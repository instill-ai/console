import { useQuery } from "@tanstack/react-query";
import { getOperatorDefinitionQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useOperatorDefinition = ({
  operatorDefinitionName,
  accessToken,
  enabled,
  retry,
}: {
  operatorDefinitionName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  let enableQuery = false;

  if (operatorDefinitionName && enabled) {
    enableQuery = true;
  }

  return useQuery(
    ["operator-definitions", operatorDefinitionName],
    async () => {
      if (!operatorDefinitionName) {
        return Promise.reject(new Error("operatorDefinitionName not provided"));
      }

      const operatorDefinition = await getOperatorDefinitionQuery({
        operatorDefinitionName,
        accessToken,
      });

      return Promise.resolve(operatorDefinition);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
