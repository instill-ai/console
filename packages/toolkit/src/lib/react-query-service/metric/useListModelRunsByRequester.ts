"use client";

import { useQuery } from "@tanstack/react-query";
import { ListModelRunsByRequesterResponse, Nullable } from "instill-sdk";

import { getInstillModelAPIClient } from "../../sdk-helper";

export function useListModelRunsByRequester({
  enabled,
  accessToken,
  pageSize,
  page,
  orderBy,
  requesterId,
  requesterUid,
  start,
}: {
  enabled: boolean;
  accessToken: Nullable<string>;
  pageSize?: number;
  page: Nullable<number>;
  orderBy?: string;
  requesterId?: string;
  requesterUid?: string;
  start?: string;
}) {
  return useQuery<ListModelRunsByRequesterResponse>({
    queryKey: [
      "modelRuns",
      requesterId,
      requesterUid,
      pageSize,
      page,
      orderBy,
      start,
    ],
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const client = getInstillModelAPIClient({
        accessToken,
      });

      const data = await client.model.listModelRunsByRequester({
        pageSize,
        page,
        orderBy,
        requesterId,
        requesterUid,
        start,
        enablePagination: true,
      });

      return data;
    },
    enabled: enabled,
  });
}
