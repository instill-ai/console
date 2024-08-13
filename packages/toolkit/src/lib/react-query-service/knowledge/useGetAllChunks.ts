import { useQuery } from "@tanstack/react-query";

import { createInstillAxiosClient } from "../../../lib";

export async function getAllChunks(
  accessToken: string,
  ownerName: string,
  kbId: string,
  fileUid: string,
) {
  if (!accessToken) {
    throw new Error("accessToken not provided");
  }
  const client = createInstillAxiosClient(accessToken, true);
  try {
    const response = await client.get(
      `/namespaces/${ownerName}/catalogs/${kbId}/chunks`,
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
  kbId,
  fileUid,
  enabled,
}: {
  accessToken: string | null;
  ownerName: string;
  kbId: string;
  fileUid: string | undefined;
  enabled: boolean;
}) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["chunks", kbId, fileUid],
    queryFn: () =>
      getAllChunks(accessToken || "", ownerName, kbId, fileUid || ""),
    enabled: enabled && !!accessToken && !!fileUid,
  });

  return { data, isLoading, isError, error };
}
