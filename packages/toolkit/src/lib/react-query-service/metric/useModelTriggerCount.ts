"use client";

import { useQuery } from "@tanstack/react-query";
import { ListModelTriggerCountRequest, Nullable } from "instill-sdk";
import { getInstillAPIClient } from "../../sdk-helper";

export function useModelTriggerCount({
    enabled,
    accessToken,
    requesterId,
    start,
    stop,
}: {
    enabled: boolean;
    accessToken: Nullable<string>;
    requesterId: string;
    start?: string;
    stop?: string;
}) {
    return useQuery({
        queryKey: ["modelTriggerCount", requesterId, start, stop],
        queryFn: async () => {
            if (!accessToken) {
                throw new Error("accessToken not provided");
            }

            const client = getInstillAPIClient({ accessToken });

            const request: ListModelTriggerCountRequest = {
                requesterId,
                start,
                stop,
            };

            const data = await client.core.metric.listModelTriggerCount(request);
            return data;
        },
        enabled: enabled && !!requesterId,
    });
}
