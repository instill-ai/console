import * as React from "react";
import { NextPage } from "next";
import { AppProps } from "next/app";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";

import { ReactElement, ReactNode, useEffect, useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  AmplitudeCtx,
  ReactQueryDevtools,
  useInstillStore,
  useCreateResourceFormStore,
  DefaultOptions,
} from "@instill-ai/toolkit";
import "../styles/global.css";
import "../styles/github-markdown.css";
import "@instill-ai/design-system/dist/index.css";
import "@instill-ai/design-tokens/dist/theme/root.css";
import "@instill-ai/design-tokens/dist/theme/light.css";
import "@instill-ai/design-tokens/dist/theme/dark.css";
import "reactflow/dist/style.css";
import "../styles/tip-tap.css";

import { useRouter } from "next/router";
import { ErrorBoundary } from "../components";
import { Toaster, useToast } from "@instill-ai/design-system";

export const queryCache = new QueryCache();
export const defaultOptions: DefaultOptions = {
  queries: {
    refetchOnWindowFocus: false,
  },
};

export const queryClient = new QueryClient({ defaultOptions, queryCache });

/* eslint-disable-next-line @typescript-eslint/ban-types */
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

const ibmPlexSans = IBM_Plex_Sans({
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  style: ["italic", "normal"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

function isPipelineBuilderPage(path: string) {
  if (path.split("/")[2] === "pipelines" && path.split("/")[4] === "builder") {
    return true;
  }
  return false;
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  const [amplitudeIsInit, setAmplitudeIsInit] = useState(false);
  const [previousURL, setPreviousUrl] = useState("");
  const router = useRouter();

  const initPipelineBuilder = useInstillStore(
    (state) => state.initPipelineBuilder,
  );
  const initCreateResourceFormStore = useCreateResourceFormStore(
    (state) => state.init,
  );

  const { dismiss: dismissToast } = useToast();

  useEffect(() => {
    if (typeof window === "undefined") return;

    function onRouteChange() {
      // We will only init the pipeline builder when user is previously on the
      // pipeline builder page
      if (
        isPipelineBuilderPage(previousURL) &&
        !isPipelineBuilderPage(window.history.state.url)
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

  return (
    <React.Fragment>
      {/*
        We use this instead of setting the className on main due to we
        are using radix-ui Dialog. These Dialogs are created on demand
        and appended under body, they won't have the css variables if
        we appends it on main
      */}
      <style jsx global>
        {`
          :root {
            --font-ibm-plex-sans: ${ibmPlexSans.style.fontFamily};
            --font-ibm-plex-mono: ${ibmPlexMono.style.fontFamily};
          }
        `}
      </style>
      <AmplitudeCtx.Provider value={{ amplitudeIsInit, setAmplitudeIsInit }}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <main>{getLayout(<Component {...pageProps} />)}</main>
          </ErrorBoundary>
          <div id="modal-root" />
          <Toaster additionalViewPortClassName="!top-[var(--topbar-height)]" />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </AmplitudeCtx.Provider>
    </React.Fragment>
  );
}

export default MyApp;
