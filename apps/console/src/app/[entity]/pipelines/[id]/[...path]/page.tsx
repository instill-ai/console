import { Metadata } from "next";
import { cookies } from "next/headers";

import { Nullable } from "@instill-ai/toolkit";
import {
  fetchNamespacePipeline,
  getPipelineTabTitle,
  PipelineTabNames,
} from "@instill-ai/toolkit/server";

import { PipelineOverviewPageRender } from "./render";

type Props = {
  params: { id: string; entity: string; path: string[] };
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata | undefined> {
  const cookieStore = cookies();
  const authSessionCookie = cookieStore.get("instill-auth-session")?.value;

  let accessToken: Nullable<string> = null;

  if (authSessionCookie) {
    accessToken = JSON.parse(authSessionCookie).accessToken;
  }

  const entity = params.entity;
  const id = params.id;

  let metadata: Metadata | undefined = undefined;

  try {
    const pipeline = await fetchNamespacePipeline({
      namespacePipelineName: `namespaces/${entity}/pipelines/${id}`,
      accessToken,
    });

    metadata = {
      title: `Instill Core | ${id} | ${getPipelineTabTitle(params.path[0] as PipelineTabNames)}`,
      description: pipeline?.description,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };
  } catch (error) {
    metadata = {
      title: `Instill Core | ${id} | ${getPipelineTabTitle(params.path[0] as PipelineTabNames)}`,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };
  }

  return Promise.resolve(metadata);
}

export default async function Page() {
  return <PipelineOverviewPageRender />;
}
