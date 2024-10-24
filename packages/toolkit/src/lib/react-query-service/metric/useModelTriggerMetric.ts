import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useModelTriggerMetric({
    enabled,
    accessToken,
    filter,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    filter: Nullable<string>;
}) {
    return useQuery({
        queryKey: ["modelTriggerMetrics", filter],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error("accessToken not provided");
            }

            const client = getInstillAPIClient({ accessToken });

            const modelTriggerMetric = await client.core.metric.listModelTriggerMetric({
                pageSize: 100, // Adjust page size as needed
                filter: filter ?? undefined,
                enablePagination: false, // Set to true if you want to handle pagination
            });

            return modelTriggerMetric;
        },
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
