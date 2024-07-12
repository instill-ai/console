import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createInstillAxiosClient } from "../../vdp-sdk/helper";
import { Nullable } from "@instill-ai/toolkit";

export function useDeleteKnowledgeBaseFile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({
            fileUid,
            accessToken,
        }: {
            fileUid: string;
            accessToken: Nullable<string>;
        }) => {
            if (!accessToken) {
                throw new Error("accessToken not provided");
            }
            const client = createInstillAxiosClient(accessToken, true);
            await client.delete(`/knowledge-bases/files?file_uid=${fileUid}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["knowledgeBaseFiles"]);
        },
    });
}