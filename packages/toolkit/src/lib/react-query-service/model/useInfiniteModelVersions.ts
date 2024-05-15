import { useQuery } from "@tanstack/react-query";
import type { Nullable } from "../../type";
import { listModelVersionsQuery } from "../../vdp-sdk";

export function useInfiniteModelVersions({
  accessToken,
  id,
  entityName,
  retry,
}: {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
  id: string;
  entityName: string;
  //pageSize: number;
  retry?: false | number;
}) {
  const queryKey = ["available-model-versions"];

  return useQuery({
    queryKey,
    queryFn: async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      const regions = await listModelVersionsQuery({
        accessToken,
        entityName,
        id,
      });

      return Promise.resolve(regions);
    },
    retry: retry === false ? false : retry ? retry : 3,
  });
}
