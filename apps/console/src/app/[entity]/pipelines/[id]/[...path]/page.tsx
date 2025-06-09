import { Metadata } from "next";
import { cookies } from "next/headers";

import { Nullable } from "@instill-ai/toolkit";
import {
  fetchNamespacePipeline,
  generateNextMetaBase,
  getPipelineTabTitle,
  PipelineTabNames,
} from "@instill-ai/toolkit/server";

import { PipelineOverviewPageRender } from "./render";

type Props = {
  params: Promise<{ id: string; entity: string; path: string[] }>;
};

export async function generateMetadata(props: Props): Promise<Metadata | undefined> {
  const params = await props.params;
  const cookieStore = await cookies();
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
      namespaceId: entity,
      pipelineId: id,
      accessToken,
      view: "VIEW_BASIC",
      shareCode: null,
    });

    metadata = {
      title: `Instill Core | ${id} | ${getPipelineTabTitle(params.path[0] as PipelineTabNames)}`,
      description: pipeline?.description,
      metadataBase: generateNextMetaBase({
        defaultBase: "http://localhost:3000",
      }),
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };
  } catch (error) {
    metadata = {
      title: `Instill Core | ${id} | ${getPipelineTabTitle(params.path[0] as PipelineTabNames)}`,
      metadataBase: generateNextMetaBase({
        defaultBase: "http://localhost:3000",
      }),
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
