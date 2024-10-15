import { Metadata } from "next";
import { redirect } from "next/navigation";

import { generateNextMetaBase } from "@instill-ai/toolkit/server";

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: `Instill Cloud | Setting`,
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
  redirect("/settings/profile");
}
