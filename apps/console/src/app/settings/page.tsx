import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@instill-ai/toolkit/server";
import { SettingsViewPageRender } from "./render";

export default async function Page() {
  const queryClient = new QueryClient();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingsViewPageRender />
    </HydrationBoundary>
  );
}
