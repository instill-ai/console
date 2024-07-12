import { Nullable } from "@instill-ai/design-system";
import { useQuery } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk";

export function useGetFileDetails({
  fileUid,
  accessToken,
  enabled,
}: {
  fileUid: string;
  accessToken: Nullable<string>;
  enabled: boolean;
}) {
  return useQuery<File>({
    queryKey: ["fileDetails", fileUid],
    queryFn: async () => {
      if (!accessToken) {
        throw new Error("accessToken not provided");
      }
      const client = createInstillAxiosClient(accessToken, true);
      const response = await client.get<{ file: File }>(
        `/knowledge-bases/files/${fileUid}`
      );
      return response.data.file;
    },
    enabled,
  });
}
