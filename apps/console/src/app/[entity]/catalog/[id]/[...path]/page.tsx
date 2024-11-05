import { Metadata } from "next"
import { generateNextMetaBase } from "@instill-ai/toolkit/server";
import { CatalogTabPageRender } from "./render";

type Props = {
  params: { entity: string; id: string; tab: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, tab } = params;

  const metadata: Metadata = {
    title: `Instill Cloud | Catalog | ${tab}`,
    description: `${tab} tab of ${id} catalog`,
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
  return <CatalogTabPageRender />;
}

