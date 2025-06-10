import { Metadata } from "next";
import { cookies } from "next/headers";
import { Nullable } from "instill-sdk";

import {
  fetchNamespaceModel,
  generateNextMetaBase,
  getModelTabTitle,
  ModelTabNames,
} from "@instill-ai/toolkit/server";

import { ModelViewPageRender } from "./render";

type Props = {
  params: Promise<{ id: string; entity: string; path: string[] }>;
};

export async function generateMetadata(
  props: Props,
): Promise<Metadata | undefined> {
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
    const model = await fetchNamespaceModel({
      namespaceId: entity,
      modelId: id,
      accessToken,
      view: "VIEW_BASIC",
    });

    metadata = {
      title: `Instill Core | ${id} | ${getModelTabTitle(params.path[0] as ModelTabNames)}`,
      description: model?.description,
      metadataBase: generateNextMetaBase({
        defaultBase: "http://localhost:3000",
      }),
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };
  } catch (error) {
    console.log(error);
    metadata = {
      title: `Instill Core | ${id} | ${getModelTabTitle(params.path[0] as ModelTabNames)}`,
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
  return <ModelViewPageRender />;
}
