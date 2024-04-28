import { QueryClient } from "@tanstack/react-query";
import { Nullable } from "../../../type";
import { getUserPipelineQuery } from "../../../vdp-sdk";

export async function fetchUserPipeline({
  pipelineName,
  accessToken,
  shareCode,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode?: string;
}) {
  try {
    if (!pipelineName) {
      throw new Error("invalid pipeline name");
    }

    const pipeline = await getUserPipelineQuery({
      pipelineName,
      accessToken,
      shareCode,
    });

    return Promise.resolve(pipeline);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseUserPipelineQueryKey(pipelineName: Nullable<string>) {
  return ["pipelines", pipelineName];
}

export function prefetchUserPipeline({
  pipelineName,
  accessToken,
  queryClient,
  shareCode,
}: {
  pipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  shareCode?: string;
}) {
  const queryKey = getUseUserPipelineQueryKey(pipelineName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchUserPipeline({
        pipelineName,
        accessToken,
        shareCode,
      });
    },
  });
}
