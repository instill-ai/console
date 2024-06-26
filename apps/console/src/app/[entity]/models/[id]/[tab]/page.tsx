import { Metadata } from "next";

import type { ModelTabNames } from "@instill-ai/toolkit/server";
import { getModelTabTitle } from "@instill-ai/toolkit/server";

import { ModelViewPageRender } from "./render";

type Props = {
  params: { id: string; entity: string; tab: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metadata: Metadata = {
    title: `Instill Core | ${params.id} | ${getModelTabTitle(params.tab as ModelTabNames)}`,

    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };
  return Promise.resolve(metadata);
}

export default async function Page() {
  return <ModelViewPageRender />;
}
