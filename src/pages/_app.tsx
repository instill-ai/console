import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  initAmplitude,
  AmplitudeCtx,
  env,
} from "@instill-ai/toolkit";
import "../styles/global.css";
import "../styles/github-markdown.css";
import "@code-hike/mdx/dist/index.css";
import "../styles/shiki.css";
import "@instill-ai/design-system/dist/index.css";

import { useRouter } from "next/router";
import { useTrackingToken } from "@/lib";
import { ErrorBoundary } from "@/components/ui";

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

    if (
      env("NEXT_PUBLIC_CONSOLE_EDITION") !== "local:ce-dev" &&
      !amplitudeIsInit
    ) {
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
      </QueryClientProvider>
    </AmplitudeCtx.Provider>
  );
}

export default MyApp;
