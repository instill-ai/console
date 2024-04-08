import { Metadata } from "next";
import { PipelineBuilderRender } from "./render";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props) {
  const id = params.id;

  const metadata: Metadata = {
    title: `Instill Core | ${id}`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };

  return Promise.resolve(metadata);
}

export default async function Page() {
  return <PipelineBuilderRender />;
}
