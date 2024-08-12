import { useQuery } from "@tanstack/react-query";

import { env } from "../../../server";
import { Nullable } from "../../type";
import { createInstillAxiosClient, getQueryString } from "../../vdp-sdk/helper";
import { File } from "./types";

export async function listKnowledgeBaseFiles({
  namespaceId,
  knowledgeBaseId,
  accessToken,
  pageSize,
  nextPageToken,
}: {
  namespaceId: string;
  knowledgeBaseId: string;
  accessToken: string;
  pageSize: number;
  nextPageToken: Nullable<string>;
}): Promise<{ files: File[]; nextPageToken: Nullable<string> }> {
  const client = createInstillAxiosClient(accessToken, true);
  const queryString = getQueryString({
    baseURL: `/namespaces/${namespaceId}/catalogs/${knowledgeBaseId}/files`,
    pageSize,
    nextPageToken,
  });
  try {
    const { data } = await client.get<{
      files: File[];
      nextPageToken: Nullable<string>;
    }>(queryString);
    return data;
  } catch (error) {
    return Promise.reject(error);
  }
}

export function useListKnowledgeBaseFiles({
  namespaceId,
  knowledgeBaseId,
  accessToken,
  enabled,
}: {
  namespaceId: Nullable<string> | undefined;
  knowledgeBaseId: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<File[]>({
    queryKey: ["knowledgeBaseFiles", namespaceId, knowledgeBaseId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      if (!namespaceId) {
        throw new Error("namespaceId not provided");
      }
      if (!knowledgeBaseId) {
        throw new Error("knowledgeBaseId not provided");
      }

      let allFiles: File[] = [];
      let nextPageToken: Nullable<string> = null;

      do {
        const response = await listKnowledgeBaseFiles({
          namespaceId,
          knowledgeBaseId,
          accessToken,
          pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
          nextPageToken,
        });

        allFiles = [...allFiles, ...response.files];
        nextPageToken = response.nextPageToken;
      } while (nextPageToken && nextPageToken !== "");

      return allFiles;
    },
    enabled,
  });
}
