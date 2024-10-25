import { useQuery } from "@tanstack/react-query";
import { ListModelRunsByRequesterResponse, Nullable } from "instill-sdk";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useListModelRunsByRequester({
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
    return useQuery<ListModelRunsByRequesterResponse>({
        queryKey: ['modelRuns', pageSize, pageToken, filter, requesterUid],
        queryFn: async () => {
            if (!accessToken) {
                return Promise.reject(new Error("accessToken not provided"));
            }

            const client = getInstillAPIClient({
                accessToken,
            });

            const data = await client.core.metric.listModelRunsByRequester({
                pageSize,
                pageToken,
                filter,
                requesterUid,
                enablePagination: true,
            });

            //need to fix the casting 
            return data as ListModelRunsByRequesterResponse;

        },
        enabled: enabled,
    });
}