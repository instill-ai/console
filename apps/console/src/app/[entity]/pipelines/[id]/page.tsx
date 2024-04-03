import { Nullable, Pipeline } from "@instill-ai/toolkit";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  fetchNamespaceType,
  fetchUserPipeline,
} from "@instill-ai/toolkit/server";
import { PipelineOverviewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props) {
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

    const metadata: Metadata = {
      title: `Instill Core | ${id}`,
      description: pipeline?.readme,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };

    return Promise.resolve(metadata);
  } catch (error) {
    return Promise.reject(error);
  }
}

export default async function Page() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PipelineOverviewPageRender />
    </HydrationBoundary>
  );
}
