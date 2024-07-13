import { env, QueryClient } from "../../../../server";
import { Nullable } from "../../../type";
import { getInstillAPIClient, Visibility } from "../../../vdp-sdk";

export async function fetchNamespacePipelines({
  namespaceName,
  accessToken,
  filter,
  visibility,
  disabledViewFull,
  pageSize,
}: {
  namespaceName: Nullable<string>;
  accessToken: Nullable<string>;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  disabledViewFull?: boolean;
  pageSize?: number;
}) {
  if (!namespaceName) {
    throw new Error("namespaceName not provided");
  }

  try {
    const client = getInstillAPIClient({
      accessToken: accessToken ?? undefined,
      publicAccess: accessToken ? false : true,
    });

    const pipelines = await client.vdp.pipeline.listNamespacePipelines({
      namespaceName,
      pageSize: pageSize ?? env("NEXT_PUBLIC_QUERY_PAGE_SIZE"),
      enablePagination: false,
      filter: filter ?? undefined,
      visibility: visibility ?? undefined,
      view: disabledViewFull ? undefined : "VIEW_FULL",
    });

    return Promise.resolve(pipelines);
  } catch (error) {
    return Promise.reject(error);
  }
}

export function getUseNamespacePipelinesQueryKey(
  namespaceName: Nullable<string>,
) {
  return ["pipelines", namespaceName];
}

export function prefetchNamespacePipelines({
  namespaceName,
  accessToken,
  filter,
  visibility,
  queryClient,
  disabledViewFull,
}: {
  namespaceName: Nullable<string>;
  accessToken: Nullable<string>;
  queryClient: QueryClient;
  filter: Nullable<string>;
  visibility: Nullable<Visibility>;
  disabledViewFull?: boolean;
}) {
  const queryKey = getUseNamespacePipelinesQueryKey(namespaceName);

  return queryClient.prefetchQuery({
    queryKey,
    queryFn: async () => {
      return await fetchNamespacePipelines({
        namespaceName,
        accessToken,
        filter,
        visibility,
        disabledViewFull,
      });
    },
  });
}
