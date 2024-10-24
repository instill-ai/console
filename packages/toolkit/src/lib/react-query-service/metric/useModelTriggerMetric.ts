import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";
import { env } from "../../../server";
import { ModelTriggerTableRecord } from "instill-sdk";

export function useModelTriggerMetric({
    enabled,
    accessToken,
    filter,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    filter: Nullable<string>;
}) {
    return useQuery<ModelTriggerTableRecord[]>({
        queryKey: ["modelTriggerMetrics", filter],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error("accessToken not provided");
            }

            const client = getInstillAPIClient({ accessToken });
            const response = await client.core.metric.listModelTriggerMetric({
                pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
                filter: filter ?? undefined,
                enablePagination: false,
            });

            if ('modelTriggerTableRecords' in response) {
                return response.modelTriggerTableRecords;
            }
            return response;
        },
        enabled,
    });
}