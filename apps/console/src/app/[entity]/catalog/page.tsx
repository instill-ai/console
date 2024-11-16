import { Metadata } from "next";

import { generateNextMetaBase } from "@instill-ai/toolkit/server";

import { CatalogPageRender } from "./render";

export async function generateMetadata() {
  const metadata: Metadata = {
    title: `Instill Cloud | Artifacts`,
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
  return <CatalogPageRender />;
}
