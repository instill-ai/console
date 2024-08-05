import { useQuery } from "@tanstack/react-query";

import { Nullable } from "@instill-ai/toolkit";

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
}) {
  const client = createInstillAxiosClient(accessToken, true);
  const queryString = getQueryString({
    baseURL: `/namespaces/${namespaceId}/catalogs/${knowledgeBaseId}/files`,
    pageSize,
    nextPageToken,
  });

  try {
    const files: File[] = [];

    const { data } = await client.get<{
      files: File[];
      nextPageToken: Nullable<string>;
    }>(queryString);

    files.push(...data.files);

    if (data.nextPageToken) {
      const nextFiles = await listKnowledgeBaseFiles({
        namespaceId,
        knowledgeBaseId,
        accessToken,
        pageSize,
        nextPageToken: data.nextPageToken,
      });

      files.push(...nextFiles);
    }

    return Promise.resolve(files);
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

      const files = await listKnowledgeBaseFiles({
        namespaceId,
        knowledgeBaseId,
        accessToken,
        pageSize: 10,
        nextPageToken: null,
      });

      return Promise.resolve(files);
    },
    enabled,
  });
}
