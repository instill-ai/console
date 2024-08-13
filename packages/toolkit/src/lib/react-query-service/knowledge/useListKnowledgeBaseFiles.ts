import { useQuery } from "@tanstack/react-query";

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
}): Promise<{
  files: File[];
  nextPageToken: Nullable<string>;
  totalSize: number;
}> {
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
      totalSize: number;
    }>(queryString);
    return {
      files: data.files,
      nextPageToken: data.nextPageToken,
      totalSize: data.totalSize,
    };
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
      let totalSize = 0;

      do {
        const result = await listKnowledgeBaseFiles({
          namespaceId,
          knowledgeBaseId,
          accessToken,
          pageSize: 10,
          nextPageToken,
        });

        allFiles = [...allFiles, ...result.files];
        nextPageToken = result.nextPageToken;
        totalSize = result.totalSize;

        // Stop fetching if we've received all files
        if (allFiles.length >= totalSize) {
          break;
        }
      } while (nextPageToken && nextPageToken !== "");

      // Ensure we don't return more files than the total
      return allFiles.slice(0, totalSize);
    },
    enabled,
  });
}
