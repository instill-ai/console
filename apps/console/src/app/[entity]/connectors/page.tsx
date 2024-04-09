import { ConnectorsPageRender } from "./render";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const metadata: Metadata = {
      title: `Instill Core | Connectors`,
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
  return <ConnectorsPageRender />;
}
