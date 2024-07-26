"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { DeleteKnowledgeBaseFileRequest } from "../../../../../sdk/src/vdp/artifact/types";


export function useDeleteKnowledgeBaseFile() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({
            payload,
            accessToken,
        }: {
            payload: DeleteKnowledgeBaseFileRequest;
            accessToken: Nullable<string>;
        }) => {
            if (!accessToken) {
                return Promise.reject(new Error("accessToken not provided"));
            }
            const client = getInstillAPIClient({ accessToken });
            await client.vdp.artifact.deleteKnowledgeBaseFile(payload);
            return Promise.resolve({ fileUid: payload.fileUid });
        },
        onSuccess: async ({ fileUid }) => {
            queryClient.invalidateQueries({ queryKey: ["knowledgeBaseFiles"] });
        },
    });
}