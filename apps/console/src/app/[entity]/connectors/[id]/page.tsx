import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
  fetchNamespaceType,
  fetchUserConnector,
} from "@instill-ai/toolkit/server";
import { ConnectorViewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { ConnectorWithDefinition, Nullable } from "@instill-ai/toolkit";

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

    let connector: Nullable<ConnectorWithDefinition> = null;

    connector = await fetchUserConnector({
      connectorName:
        namespaceType === "NAMESPACE_USER"
          ? `users/${entity}/connectors/${id}`
          : `organizations/${entity}/connectors/${id}`,
      accessToken,
    });

    const metadata: Metadata = {
      title: `Instill Core | ${connector.id}`,
      description: connector.description,
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
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ConnectorViewPageRender />
    </HydrationBoundary>
  );
}
