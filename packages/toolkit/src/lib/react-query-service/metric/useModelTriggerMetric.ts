"use client";

import { ModelTriggerTableRecord, ListModelTriggerMetricResponse } from "instill-sdk";
import { Nullable } from "vitest";
import { useQuery } from "@tanstack/react-query";
import { getInstillAPIClient } from "../../sdk-helper";

export function useModelTriggerMetric({
    enabled,
    accessToken,
    filter,
    requesterId,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    filter: Nullable<string>;
    requesterId: Nullable<string>;
}) {
    return useQuery<ModelTriggerTableRecord[]>({
        queryKey: ["tables", filter, requesterId],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error("accessToken not provided");
            }

            const client = getInstillAPIClient({ accessToken });
            const response = await client.core.metric.listModelTriggerMetric({
                pageSize: undefined,
                filter: filter ?? undefined,
                requesterId,
                enablePagination: false,
            }) as ListModelTriggerMetricResponse | ModelTriggerTableRecord[];

            if (Array.isArray(response)) {
                return response;
            }

            return response.modelTriggerTableRecords || [];
        },
        enabled,
    });
}