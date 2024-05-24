import { useQuery } from "@tanstack/react-query";
import { getHubStatsQuery } from "../../vdp-sdk/hub/queries";

export function useHubStats({
  enabled,
  retry,
}: {
  enabled: boolean;
  retry?: false | number;
}) {
  return useQuery({
    queryKey: ["hub-stats"],
    queryFn: async () => {
      const stats = getHubStatsQuery();

      return Promise.resolve(stats);
    },
    enabled,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
