import { env, QueryClient } from "../../../../server";
import { getInstillAPIClient } from "../../../sdk-helper";
import { Nullable } from "../../../type";

export async function fetchNamespacePipelineReleases({
  namespacePipelineName,
  accessToken,
  shareCode,
  disableViewFull,
}: {
  namespacePipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  shareCode?: string;
  disableViewFull?: boolean;
}) {
  if (!namespacePipelineName) {
    throw new Error("namespacePipelineName not provided");
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
    });

    const pipelineReleases =
      await client.vdp.release.listNamespacePipelineReleases({
        namespacePipelineName,
        pageSize: env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
        shareCode: shareCode,
        enablePagination: false,
        view: disableViewFull ? undefined : "VIEW_FULL",
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
  disableViewFull,
}: {
  namespacePipelineName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  shareCode?: string;
  disableViewFull?: boolean;
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
        disableViewFull,
      });
    },
  });
}
