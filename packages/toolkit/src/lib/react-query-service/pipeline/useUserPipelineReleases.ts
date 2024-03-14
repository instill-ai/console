import { useQuery } from "@tanstack/react-query";
import { ListUserPipelineReleasesQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { env } from "../../../server";
import { useRouter } from "next/router";

export function useUserPipelineReleases({
  pipelineName,
  enabled,
  accessToken,
  retry,
}: {
  pipelineName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  retry?: false | number;
}) {
  const router = useRouter();
  let enableQuery = false;

  if (pipelineName && enabled) {
    enableQuery = true;
  }

  const pipelineNameFragment = pipelineName ? pipelineName.split("/") : [];
  const userName = `${pipelineNameFragment[0]}/${pipelineNameFragment[1]}`;

  return useQuery({
    queryKey: ["pipelineReleases", userName],
    queryFn: async () => {
      if (!pipelineName) {
        return Promise.reject(new Error("pipelineName not provided"));
      }

      const pipelineReleases = await ListUserPipelineReleasesQuery({
        pipelineName,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        nextPageToken: null,
        accessToken,
        shareCode: router.query.view?.toString(),
      });

      return Promise.resolve(pipelineReleases);
    },
    enabled: enableQuery,
    retry: retry === false ? false : retry ? retry : 3,
  });
}
