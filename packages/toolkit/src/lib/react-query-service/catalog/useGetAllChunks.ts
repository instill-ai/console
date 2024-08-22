import { useQuery } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../..";

export async function getAllChunks(
  accessToken: string,
  ownerName: string,
  catalogId: string,
  fileUid: string,
) {
  if (!accessToken) {
    throw new Error("accessToken not provided");
  }
  const client = createInstillAxiosClient(accessToken, true);
  try {
    const response = await client.get(
      `/namespaces/${ownerName}/catalogs/${catalogId}/chunks`,
      {
        params: { fileUid },
      },
    );
    return response.data.chunks;
  } catch (error) {
    console.error("Error fetching chunks:", error);
    throw new Error("Failed to fetch chunks. Please try again later.");
  }
}

export function useGetAllChunks({
  accessToken,
  ownerName,
  catalogId,
  fileUid,
  enabled,
}: {
  accessToken: string | null;
  ownerName: string;
  catalogId: string;
  fileUid: string | undefined;
  enabled: boolean;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["chunks", catalogId, fileUid],
    queryFn: () =>
      getAllChunks(accessToken || "", ownerName, catalogId, fileUid || ""),
    enabled: enabled && !!accessToken && !!fileUid,
  });

  return { data, isLoading, isError, error };
}
