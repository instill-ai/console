import { Metadata } from "next";
import { generateNextMetaBase, getCatalogTabTitle, CatalogTabNames } from "@instill-ai/toolkit/server";
import { CatalogTabPageRender } from "./render";

type Props = {
  params: { entity: string; id: string; tab: string[] };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, tab } = params;
  const tabName = (tab[0] as CatalogTabNames) || "catalogs";

  const metadata: Metadata = {
    title: `Instill Cloud | ${id} | ${getCatalogTabTitle(tabName)}`,
    description: `${getCatalogTabTitle(tabName)} tab of ${id} catalog`,
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
