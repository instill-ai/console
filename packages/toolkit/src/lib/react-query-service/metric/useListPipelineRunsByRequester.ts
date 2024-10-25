import { useQuery } from "@tanstack/react-query";
import { ListPipelineRunsByRequesterResponse, Nullable } from "instill-sdk";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useListPipelineRunsByRequester({
    enabled,
    accessToken,
    pageSize,
    pageToken,
    filter,
    requesterUid,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    pageSize?: number;
    pageToken?: string;
    filter?: string;
    requesterUid?: string;
}) {
    return useQuery<ListPipelineRunsByRequesterResponse>({
        queryKey: ['pipelineRuns', pageSize, pageToken, filter, requesterUid],
        queryFn: async () => {
            if (!accessToken) {
                return Promise.reject(new Error("accessToken not provided"));
            }

            const client = getInstillAPIClient({
                accessToken,
            });

            const data = await client.core.metric.listPipelineRunsByRequester({
                pageSize,
                pageToken,
                filter,
                requesterUid,
                enablePagination: true,
            });
            //need to fix the casting 
            return data as ListPipelineRunsByRequesterResponse;
        },
        enabled: enabled,
    });
}