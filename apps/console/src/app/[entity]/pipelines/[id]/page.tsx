import { NamespaceType, Nullable, Pipeline } from "@instill-ai/toolkit";
import {
  prefetchAuthenticatedUser,
  QueryClient,
  HydrationBoundary,
  dehydrate,
  fetchNamespaceType,
  prefetchUserPipeline,
  prefetchNamespaceType,
  prefetchOrganization,
  env,
  fetchUserPipeline,
} from "@instill-ai/toolkit/server";
import { PipelineViewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).access_token;
  }

  const entity = params.entity;
  const id = params.id;

  try {
    const namespaceType = await fetchNamespaceType({
      namespace: entity,
      accessToken,
    });

    let pipeline: Nullable<Pipeline> = null;

    if (namespaceType === "NAMESPACE_USER") {
      pipeline = await fetchUserPipeline({
        pipelineName: `users/${entity}/pipelines/${id}`,
        accessToken,
      });
    }

    if (namespaceType === "NAMESPACE_ORGANIZATION") {
      pipeline = await fetchUserPipeline({
        pipelineName: `organizations/${entity}/pipelines/${id}`,
        accessToken,
      });
    }

    return Promise.resolve({
      title: `${pipeline?.id} | Pipeline`,
      description: pipeline?.readme,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    });
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export default async function Page({
  params: { entity, id },
}: {
  params: {
    entity: string;
    id: string;
  };
}) {
  const queryClient = new QueryClient();

  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).access_token;
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
  } else if (namespaceType === "NAMESPACE_ORGANIZATION") {
    await prefetchOrganization({
      organizationID: entity,
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
