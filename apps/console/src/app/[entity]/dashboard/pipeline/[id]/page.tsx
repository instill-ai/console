import { PipelineDashboardPageRender } from "./render";
import { Metadata } from "next";

type Props = {
  params: { id: string; entity: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const metadata: Metadata = {
      title: `Instill Core | ${params.id} Dashboard`,
      openGraph: {
        images: ["/instill-open-graph.png"],
      },
    };

    return Promise.resolve(metadata);
  } catch (error) {
    console.log(error);
    return Promise.reject(error);
  }
}

export default async function Page() {
  return <PipelineDashboardPageRender />;
}
