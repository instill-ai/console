import { ProfileSettingPageRender } from "./rendex";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: `Instill Core | Profile Setting`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };
  return Promise.resolve(metadata);
}

export default async function Page() {
  return <ProfileSettingPageRender />;
}
