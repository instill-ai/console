import { useQuery } from "@tanstack/react-query";
import { ListUserPipelineReleasesQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";
import { env } from "../../utility";
import { useRouter } from "next/router";

export const useUserPipelineReleases = ({
  pipelineName,
  enabled,
  accessToken,
  retry,
}: {
  pipelineName: Nullable<string>;
  enabled: boolean;
  accessToken: Nullable<string>;
  /**
   * - Default is 3
   * - Set to false to disable retry
   */
  retry?: false | number;
}) => {
  const router = useRouter();
  let enableQuery = false;

  if (pipelineName && enabled) {
    enableQuery = true;
  }

  const pipelineNameFragment = pipelineName ? pipelineName.split("/") : [];
  const userName = `${pipelineNameFragment[0]}/${pipelineNameFragment[1]}`;

  return useQuery(
    ["pipelineReleases", userName],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

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
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
