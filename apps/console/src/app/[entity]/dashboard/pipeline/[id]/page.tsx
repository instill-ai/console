import { Metadata } from "next";

import { generateNextMetaBase } from "@instill-ai/toolkit/server";

import { PipelineDashboardPageRender } from "./render";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const metadata: Metadata = {
    title: `Instill Core | ${params.id} Dashboard`,
    metadataBase: generateNextMetaBase({
      defaultBase: "http://localhost:3000",
    }),
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };
  return Promise.resolve(metadata);
}

export default async function Page() {
  return <PipelineDashboardPageRender />;
}