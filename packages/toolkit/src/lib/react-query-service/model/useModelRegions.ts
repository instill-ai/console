import { useQuery } from "@tanstack/react-query";

import type { Nullable } from "../../type";
import { listModelRegionsQuery } from "../../vdp-sdk";

export function useModelRegions({
  accessToken,
}: {
  accessToken: Nullable<string>;
}) {
  const queryKey = ["available-model-regions"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const regions = await listModelRegionsQuery({ accessToken });

      return Promise.resolve(regions);
    },
  });
}
