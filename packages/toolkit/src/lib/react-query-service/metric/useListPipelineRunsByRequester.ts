import { useQuery } from "@tanstack/react-query";
import { Nullable } from "instill-sdk";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useListPipelineRunsByRequester({
    enabled,
    accessToken,
    pageSize,
    pageToken,
    filter,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    pageSize?: number;
    pageToken?: string;
    filter?: string;
}) {
    return useQuery({
        queryKey: ['pipelineRuns', pageSize, pageToken, filter],
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
                enablePagination: true,
            });

            return Promise.resolve(data);
        },
        enabled: enabled,
    });
}