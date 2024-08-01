import { createInstillAxiosClient } from "../../../lib";

export async function useGetAllChunks(
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
      `/namespaces/${ownerName}/knowledge-bases/${kbId}/chunks`,
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