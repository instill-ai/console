import { Metadata } from "next";

export async function generateMetadata() {
  const metadata: Metadata = {
    title: `Instill Cloud | Hub`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };

  return Promise.resolve(metadata);
}

export default async function Page() {
  return null;
}
