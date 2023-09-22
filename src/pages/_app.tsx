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
  ReactQueryDevtools,
  usePipelineBuilderStore,
  useCreateResourceFormStore,
} from "@instill-ai/toolkit";
import "../styles/global.css";
import "../styles/github-markdown.css";
import "@instill-ai/design-system/dist/index.css";
import "@instill-ai/design-tokens/dist/theme/root.css";
import "@instill-ai/design-tokens/dist/theme/light.css";
import "@instill-ai/design-tokens/dist/theme/dark.css";
import "reactflow/dist/style.css";

import { useRouter } from "next/router";
import { useTrackingToken } from "@/lib";
import { ErrorBoundary } from "@/components";
import { Toaster, useToast } from "@instill-ai/design-system";

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
  const [previousURL, setPreviousUrl] = useState("");
  const router = useRouter();
  const trackingToken = useTrackingToken();

  const initPipelineBuilder = usePipelineBuilderStore((state) => state.init);
  const initCreateResourceFormStore = useCreateResourceFormStore(
    (state) => state.init
  );

  const { dismiss: dismissToast } = useToast();

  function isPipelineDetailPage(path: string) {
    if (path.split("/")[1] === "pipelines" && path.split("/")[2]) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onRouteChange() {
      // We will only init the pipeline builder when user is previously on the
      // pipeline builder page
      if (
        isPipelineDetailPage(previousURL) &&
        !isPipelineDetailPage(window.history.state.url)
      ) {
        initPipelineBuilder();
      }

      dismissToast();
      setPreviousUrl(window.history.state.url);
      initCreateResourceFormStore();
    }

    router.events.on("routeChangeComplete", onRouteChange);

    return () => {
      router.events.off("routeChangeComplete", onRouteChange);
    };
  }, [
    router.events,
    initPipelineBuilder,
    dismissToast,
    previousURL,
    initCreateResourceFormStore,
  ]);

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
      env("NEXT_PUBLIC_CONSOLE_EDITION") !== "local-ce:dev" &&
      !amplitudeIsInit
    ) {
      if (env("NEXT_PUBLIC_USAGE_COLLECTION_ENABLED")) {
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
        <Toaster additionalViewPortClassName="!top-[var(--topbar-height)]" />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AmplitudeCtx.Provider>
  );
}

export default MyApp;
