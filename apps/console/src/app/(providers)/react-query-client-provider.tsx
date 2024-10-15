"use client";

// We can not useState or useRef in a server component, which is why we are
// extracting this part out into it's own file with 'use client' on top
import {
  QueryClientProvider,
  REACT_QUERY_MAX_RETRIES,
  ReactQueryDevtools,
} from "@instill-ai/toolkit";
import { QueryClient } from "@instill-ai/toolkit/server";

let browserQueryClient: QueryClient | undefined = undefined;

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,

        // For the following status code, we do not want to retry
        retry: (failureCount, error) => {
          if (failureCount > REACT_QUERY_MAX_RETRIES) {
            return false;
          }

          console.log("error in retry", error);

          if (
            Object.hasOwnProperty.call(error, "status") &&
            //@ts-ignore
            [401, 403, 404].includes(error.status)
          ) {
            //@ts-ignore
            console.log(`Aborting retry due to ${error.status} status`);
            return false;
          }

          return true;
        },
      },
    },
  });
}

export function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return makeQueryClient();
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important so we don't re-make a new client if React
    // suspends during the initial render. This may not be needed if we
    // have a suspense boundary BELOW the creation of the query client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        position="left"
        buttonPosition="bottom-left"
        initialIsOpen={false}
      />
    </QueryClientProvider>
  );
}
