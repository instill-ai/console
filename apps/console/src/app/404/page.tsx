import { Metadata } from "next";
import { NotFoundPageRender } from "./render";

export async function generateMetadata() {
  const metadata: Metadata = {
    title: `Instill Core | Not Found`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };

  return Promise.resolve(metadata);
}

export default async function Page() {
  return <NotFoundPageRender />;
}
