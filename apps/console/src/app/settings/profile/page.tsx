import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@instill-ai/toolkit/server";
import { ProfileSettingPageRender } from "./rendex";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const metadata: Metadata = {
      title: `Instill Core | Profile Setting`,
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
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfileSettingPageRender />
    </HydrationBoundary>
  );
}
