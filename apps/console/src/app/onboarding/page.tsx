import { Metadata } from "next";
import { OnboardingPageRender } from "./render";

export async function generateMetadata() {
  const metadata: Metadata = {
    title: "Instill Core | Onboarding",
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };
  return Promise.resolve(metadata);
}

export default async function Page() {
  return <OnboardingPageRender />;
}
