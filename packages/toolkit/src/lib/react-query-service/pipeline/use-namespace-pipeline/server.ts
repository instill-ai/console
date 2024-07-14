import { QueryClient } from "@tanstack/react-query";

import { Nullable } from "../../../type";
import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchNamespacePipeline({
  namespacePipelineName,
  accessToken,
  shareCode,
}: {
  namespacePipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode?: string;
}) {
  if (!namespacePipelineName) {
    throw new Error("invalid namespacePipelineName name");
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const pipeline = await client.vdp.pipeline.getNamespacePipeline({
      namespacePipelineName,
      shareCode,
      view: "VIEW_FULL",
    });

    return Promise.resolve(pipeline);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespacePipelineQueryKey(
  namespacePipelineName: Nullable<string>,
) {
  return ["pipelines", namespacePipelineName];
}

export function prefetchNamespacePipeline({
  namespacePipelineName,
  accessToken,
  queryClient,
  shareCode,
}: {
  namespacePipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  shareCode?: string;
}) {
  const queryKey = getUseNamespacePipelineQueryKey(namespacePipelineName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespacePipeline({
        namespacePipelineName,
        accessToken,
        shareCode,
      });
    },
  });
}
