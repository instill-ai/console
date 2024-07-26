import { useQuery } from "@tanstack/react-query";
import { getInstillAPIClient } from "../../vdp-sdk";
import { Nullable } from "../../type";

export function useListKnowledgeBases({
  ownerId,
  accessToken,
  enabled,
}: {
  ownerId: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ['knowledgeBases', ownerId],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = getInstillAPIClient({ accessToken });
      return client.vdp.artifact.listKnowledgeBases({
        ownerId,
        pageSize: 100,
        enablePagination: false,
      });
    },
    enabled,
  });
}