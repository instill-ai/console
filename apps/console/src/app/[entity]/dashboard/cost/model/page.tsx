import { Metadata } from "next";

import { generateNextMetaBase } from "@instill-ai/toolkit/server";

import CostPipelineRender from "./render";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Instill Core | Pipeline Cost Dashboard",
    metadataBase: generateNextMetaBase({
      defaultBase: "http://localhost:3000",
    }),
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };
}

export default function CostPipelinePage() {
  return <CostPipelineRender />;
}
