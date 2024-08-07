"use client";

import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { env } from "../../../server";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useOperatorDefinitions({
  accessToken,
  enabled,
  retry,
  disableViewFull,
}: {
  accessToken: Nullable<string>;
  enabled: boolean;
  retry?: false | number;
  disableViewFull?: boolean;
}) {
  return useQuery({
    queryKey: ["operator-definitions"],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillAPIClient({ accessToken });

      const operatorDefinitions =
        await client.vdp.component.listOperatorDefinitions({
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          enablePagination: false,
          view: disableViewFull ? undefined : "VIEW_FULL",
        });

      return Promise.resolve(operatorDefinitions);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
