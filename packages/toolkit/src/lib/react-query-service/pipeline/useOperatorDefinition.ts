"use client";

import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useOperatorDefinition({
  operatorDefinitionName,
  accessToken,
  enabled,
  retry,
  view,
}: {
  operatorDefinitionName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  view?: string;
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

      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken, publicAccess: false });

      const operatorDefinition =
        await client.vdp.component.getOperatorDefinition({
          operatorDefinitionName,
          view,
        });

      return Promise.resolve(operatorDefinition);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
