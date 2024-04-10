import { fetchUserModel, fetchNamespaceType } from "@instill-ai/toolkit/server";
import { ModelViewPageRender } from "./render";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { Nullable, Model } from "@instill-ai/toolkit";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metadata: Metadata = {
    title: `Instill Core | ${params.id}`,

    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };
  return Promise.resolve(metadata);
}

export default async function Page() {
  return <ModelViewPageRender />;
}
