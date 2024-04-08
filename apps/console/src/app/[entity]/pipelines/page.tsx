import { Metadata } from "next";
import { PipelinesViewPageRender } from "./render";

export async function generateMetadata() {
  const metadata: Metadata = {
    title: `Instill Core | Pipelines`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };

  return Promise.resolve(metadata);
}

export default async function Page() {
  return <PipelinesViewPageRender />;
}
