import { Nullable, Pipeline } from "@instill-ai/toolkit";
import {
  fetchNamespaceType,
  fetchUserPipeline,
} from "@instill-ai/toolkit/server";
import { PipelineOverviewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
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
        images: [`/api/pipeline?user=${entity}&pipeline=${id}`],
      },
    };

    console.log(metadata, Promise.resolve(metadata));

    return Promise.resolve(metadata);
  } catch (error) {
    console.log(error);
  }
}

export default async function Page() {
  return <PipelineOverviewPageRender />;
}
