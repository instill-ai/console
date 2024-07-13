import { env, QueryClient } from "../../../../server";
import { Nullable } from "../../../type";
import { getInstillAPIClient } from "../../../vdp-sdk";

export async function fetchNamespacePipelineReleases({
  namespacePipelineName,
  accessToken,
  shareCode,
}: {
  namespacePipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode?: string;
}) {
  if (!namespacePipelineName) {
    throw new Error("namespacePipelineName not provided");
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
      publicAccess: accessToken ? false : true,
    });

    const pipelineReleases =
      await client.vdp.release.listNamespacePipelineReleases({
        namespacePipelineName,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        shareCode: shareCode,
        enablePagination: false,
      });

    return Promise.resolve(pipelineReleases);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespacePipelineReleasesQueryKey(
  namespacePipelineName: Nullable<string>,
) {
  return ["pipelineReleases", namespacePipelineName];
}

export function prefetchNamespacePipelineReleases({
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
  const queryKey = getUseNamespacePipelineReleasesQueryKey(
    namespacePipelineName,
  );

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespacePipelineReleases({
        namespacePipelineName,
        accessToken,
        shareCode,
      });
    },
  });
}
