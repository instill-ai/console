import { NamespaceType, Nullable } from "@instill-ai/toolkit";
import {
  prefetchAuthenticatedUser,
  QueryClient,
  HydrationBoundary,
  dehydrate,
  fetchNamespaceType,
  prefetchUserPipeline,
  prefetchNamespaceType,
} from "@instill-ai/toolkit/server";
import {
  fetchAccessToken,
  prefetchAccessToken,
} from "lib/use-access-token/server";
import { PipelineViewPageRender } from "./render";

export default async function Page({
  params: { entity, id },
}: {
  params: {
    entity: string;
    id: string;
  };
}) {
  const queryClient = new QueryClient();

  await prefetchAccessToken({
    queryClient,
  });

  let accessToken: Nullable<string> = null;

  try {
    accessToken = await fetchAccessToken();
  } catch (error) {
    console.log(error);
  }

  await prefetchAuthenticatedUser({
    accessToken,
    queryClient,
  });

  let namespaceType: Nullable<NamespaceType> = null;

  await prefetchNamespaceType({
    namespace: entity,
    queryClient,
    accessToken,
  });

  try {
    namespaceType = await fetchNamespaceType({
      namespace: entity,
      accessToken,
    });
  } catch (error) {
    console.log(error);
  }

  if (namespaceType === "NAMESPACE_USER") {
    await prefetchUserPipeline({
      pipelineName: `users/${entity}/pipelines/${id}`,
      accessToken,
      queryClient,
    });
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PipelineViewPageRender />
    </HydrationBoundary>
  );
}
