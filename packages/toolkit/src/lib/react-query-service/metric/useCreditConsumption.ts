import { useQuery } from "@tanstack/react-query";
import { Nullable } from "../../type";
import { getInstillAPIClient } from "../../vdp-sdk";

export type CreditConsumptionRecord = {
    namespaceId: string;
    timeBuckets: string[];
    amount: number[];
    source: string;
};

export type CreditConsumptionResponse = {
    creditConsumptionChartRecords: CreditConsumptionRecord[];
};

export function useCreditConsumption({
    enabled,
    accessToken,
    namespaceId,
    aggregationWindow,
    start,
    stop,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    namespaceId: string;
    aggregationWindow?: string;
    start?: string;
    stop?: string;
}) {
    return useQuery<CreditConsumptionResponse>({
        queryKey: ["creditConsumption", namespaceId, aggregationWindow, start, stop],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error("accessToken not provided");
            }

            const client = getInstillAPIClient({ accessToken });
            const response = await client.core.metric.listCreditConsumptionChartRecords({
                namespaceId,
                aggregationWindow,
                start,
                stop,
            });

            return response;
        },
        enabled,
    });
}