import { Metadata } from "next";
import { cookies } from "next/headers";
import { Nullable } from "instill-sdk";

import {
  fetchNamespaceModel,
  getModelTabTitle,
  ModelTabNames,
} from "@instill-ai/toolkit/server";

import { ModelViewPageRender } from "./render";

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
    const model = await fetchNamespaceModel({
      namespaceModelName: `namespaces/${entity}/models/${id}`,
      accessToken,
    });

    metadata = {
      title: `Instill Core | ${id} | ${getModelTabTitle(params.path[0] as ModelTabNames)}`,
      description: model?.description,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };
  } catch (error) {
    console.log(error);
    metadata = {
      title: `Instill Core | ${id} | ${getModelTabTitle(params.path[0] as ModelTabNames)}`,
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
