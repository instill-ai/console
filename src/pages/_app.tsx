import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/global.css";
import "../styles/github-markdown.css";
import "@code-hike/mdx/dist/index.css";
import "../styles/shiki.css";

import "@instill-ai/design-system/build/index.cjs.css";
import { useRouter } from "next/router";
import { initAmplitude } from "@/lib/amplitude";
import { useTrackingToken } from "@/services/mgmt";
import { AmplitudeCtx } from "@/contexts/AmplitudeContext";
import { ErrorBoundary } from "@/components/ui";
import { env } from "../utils";

export const queryCache = new QueryCache();

export const queryClient = new QueryClient({ queryCache });

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [amplitudeIsInit, setAmplitudeIsInit] = useState(false);
  const router = useRouter();
  const trackingToken = useTrackingToken();

  useEffect(() => {
    if (!router.isReady || !trackingToken.data) return;

    if (trackingToken.data === "redirect-to-onboard") {
      // We should clear the trackingToken to avoid once user had successfully setup user data, when we push them to the
      // pipelines page, because there has no changes related to state, the trackingToken won't be flushed, so it remains
      // redirect-to-onboard, user will be redirected to onboarding page again.
      trackingToken.setData(null);
      router.push("/onboarding");
      return;
    }

    if (process.env.NODE_ENV === "production" && !amplitudeIsInit) {
      if (env("NEXT_PUBLIC_DISABLE_USAGE_COLLECTION") === "true") {
        setAmplitudeIsInit(false);
      } else {
        initAmplitude(trackingToken.data);
        setAmplitudeIsInit(true);
      }
    }
  }, [router.isReady, trackingToken, router.asPath, amplitudeIsInit, router]);

  return (
    <AmplitudeCtx.Provider value={{ amplitudeIsInit, setAmplitudeIsInit }}>
      <QueryClientProvider client={queryClient}>
        <ErrorBoundary>{getLayout(<Component {...pageProps} />)}</ErrorBoundary>
        <div id="modal-root" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AmplitudeCtx.Provider>
  );
}

export default MyApp;
