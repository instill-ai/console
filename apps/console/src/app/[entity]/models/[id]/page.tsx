import { fetchUserModel, fetchNamespaceType } from "@instill-ai/toolkit/server";
import { ModelViewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Nullable, Model } from "@instill-ai/toolkit";

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

    let model: Nullable<Model> = null;

    model = await fetchUserModel({
      modelName:
        namespaceType === "NAMESPACE_USER"
          ? `users/${entity}/models/${id}`
          : `organizations/${entity}/models/${id}`,
      accessToken,
    });

    const metadata: Metadata = {
      title: `Instill Core | ${model.id}`,
      description: model.description,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };

    return Promise.resolve(metadata);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export default async function Page() {
  return <ModelViewPageRender />;
}
