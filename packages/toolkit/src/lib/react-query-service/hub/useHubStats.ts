import { useQuery } from "@tanstack/react-query";

import { getInstillAPIClient } from "../../sdk-helper";

export type HubStatsResponse = {
  numberOfPublicPipelines: number;
  numberOfFeaturedPipelines: number;
};

export function useHubStats({ enabled }: { enabled: boolean }) {
  return useQuery({
    queryKey: ["hub-stats"],
    queryFn: async () => {
      const client = getInstillAPIClient({ accessToken: undefined });

      // This is not a public endpoint, so we directly handle the query here
      const stats = await client.get<HubStatsResponse>("/hub-stats");

      return Promise.resolve(stats);
    },
    enabled,
  });
}
