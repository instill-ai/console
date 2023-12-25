import { NextPage } from "next";
import { AppProps } from "next/app";
import {
  ReactElement,
  ReactNode,
  useEffect,
  useState,
  useLayoutEffect,
} from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
  AmplitudeCtx,
  ReactQueryDevtools,
  useInstillStore,
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
import { ErrorBoundary } from "../components";
import { Toaster, useToast } from "@instill-ai/design-system";

export const queryCache = new QueryCache();

export const queryClient = new QueryClient({ queryCache });

/* eslint-disable-next-line @typescript-eslint/ban-types */
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
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

  const initPipelineBuilder = useInstillStore(
    (state) => state.initPipelineBuilder,
  );
  const initCreateResourceFormStore = useCreateResourceFormStore(
    (state) => state.init,
  );

  const { dismiss: dismissToast } = useToast();

  function isPipelineDetailPage(path: string) {
    if (path.split("/")[2] === "pipelines" && path.split("/")[3]) {
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
