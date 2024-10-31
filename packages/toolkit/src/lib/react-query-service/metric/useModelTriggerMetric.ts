import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { ModelTriggerTableRecord } from "instill-sdk";

export function useModelTriggerMetric({
    enabled,
    accessToken,
    pageSize,
    page,
    filter,
    requesterId,
    requesterUid,
    start,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    pageSize?: number;
    page?: Nullable<number>;
    filter?: string;
    requesterId: Nullable<string>;
    requesterUid?: string;
    start?: string;
}) {
    return useQuery<ModelTriggerTableRecord[]>({
        queryKey: ["modelTriggerMetrics", pageSize, page, filter, requesterId, start],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error("accessToken not provided");
            }

            const client = getInstillAPIClient({ accessToken });
            const response = await client.core.metric.listModelTriggerMetric({
                pageSize,
                page,
                filter,
                requesterId,
                requesterUid,
                start,
                enablePagination: true,
            });

            if ('modelTriggerTableRecords' in response) {
                return response.modelTriggerTableRecords;
            }
            return response;
        },
        enabled,
    });
}