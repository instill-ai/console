import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@instill-ai/toolkit/server";
import { DashboardPageRender } from "./render";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  try {
    const metadata: Metadata = {
      title: `Instill Core | Dashboard`,
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
      <DashboardPageRender />
    </HydrationBoundary>
  );
}
