import { Metadata } from "next";

import { KnowladgeBasePageRender } from "./render";

export async function generateMetadata() {
  const metadata: Metadata = {
    title: `Instill Cloud | Catalog`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };

  return Promise.resolve(metadata);
}

export default async function Page() {
  return <KnowladgeBasePageRender />;
}
