import { Metadata } from "next";

import { generateNextMetaBase } from "@instill-ai/toolkit/server";

import { RecipeEditorViewRender } from "./render";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props) {
  const id = params.id;

  const metadata: Metadata = {
    title: `Instill Core | ${id}`,
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
  return <RecipeEditorViewRender />;
}
