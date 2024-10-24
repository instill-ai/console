import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export function useModelTriggers({
    enabled,
    accessToken,
    namespaceId,
    start,
    stop,
    aggregationWindow,
}: {
    enabled: boolean;
    namespaceId: Nullable<string>;
    accessToken: Nullable<string>;
    start: Nullable<string>;
    stop: Nullable<string>;
    aggregationWindow: Nullable<string>;
}) {
    const modelTriggerMetrics = useQuery({
        queryKey: ["model-trigger-metrics", namespaceId, start, stop],
        queryFn: async () => {
            if (!accessToken || !namespaceId) {
                throw new Error("Missing required parameters");
            }

            const client = getInstillAPIClient({ accessToken });
            const data = await client.core.metric.listModelTriggerMetric({
                filter: `namespaceId='${namespaceId}'${start ? ` AND start='${start}'` : ""}${stop ? ` AND stop='${stop}'` : ""
                    }`,
                enablePagination: false,
            });

            return data;
        },
        enabled: enabled && Boolean(accessToken) && Boolean(namespaceId),
    });

    const modelTriggerChart = useQuery({
        queryKey: ["model-trigger-chart", namespaceId, start, stop, aggregationWindow],
        queryFn: async () => {
            if (!accessToken || !namespaceId) {
                throw new Error("Missing required parameters");
            }

            const client = getInstillAPIClient({ accessToken });
            const data = await client.core.metric.getModelTriggersChart({
                namespaceId,
                start: start ?? undefined,
                stop: stop ?? undefined,
                aggregationWindow: aggregationWindow ?? undefined,
            });

            return data;
        },
        enabled: enabled && Boolean(accessToken) && Boolean(namespaceId),
    });

    return {
        metrics: modelTriggerMetrics,
        chart: modelTriggerChart,
        isLoading: modelTriggerMetrics.isLoading || modelTriggerChart.isLoading,
        isError: modelTriggerMetrics.isError || modelTriggerChart.isError,
    };
}