import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import { getUserPipelineQuery } from "../../vdp-sdk";
import type { Nullable } from "../../type";

export const useUserPipeline = ({
  pipelineName,
  accessToken,
  enabled,
  retry,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  enabled: boolean;
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

  return useQuery(
    ["pipelines", pipelineName],
    async () => {
      if (!accessToken) {
        return Promise.reject(new Error("accessToken not provided"));
      }

      if (!pipelineName) {
        return Promise.reject(new Error("invalid pipeline name"));
      }

      const pipeline = await getUserPipelineQuery({
        pipelineName,
        accessToken,
        shareCode: router.query.view?.toString(),
      });

      return Promise.resolve(pipeline);
    },
    {
      enabled: enableQuery,
      retry: retry === false ? false : retry ? retry : 3,
    }
  );
};
