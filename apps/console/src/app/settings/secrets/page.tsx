import { Metadata } from "next";

import { generateNextMetaBase } from "@instill-ai/toolkit/server";

import { SecretSettingdPageRender } from "./render";

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: `Instill Core | Secrets Setting`,
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
  return <SecretSettingdPageRender />;
}
