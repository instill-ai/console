import { Metadata } from "next";
import { HubPageRender } from "./render";
import { HubNavigationParams } from "@instill-ai/toolkit";

export async function generateMetadata() {
  const metadata: Metadata = {
    title: `Instill Cloud | Hub`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };

  return Promise.resolve(metadata);
}

export default async function Page() {
  return <HubPageRender />;
}
