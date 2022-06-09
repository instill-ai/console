import { NextPage } from "next";
import { AppProps } from "next/app";
import { ReactElement, ReactNode, useEffect, useState } from "react";
import { QueryCache, QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import "../styles/global.css";
import "@instill-ai/design-system/build/index.cjs.css";
import { useRouter } from "next/router";
import { initAmplitude } from "@/lib/amplitude";
import { useTrackingToken } from "@/services/mgmt";
import { AmplitudeCtx } from "context/AmplitudeContext";

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
    if (!router.isReady) return;

    if (!trackingToken) {
      router.push("/onboarding");
    }

    if (process.env.NODE_ENV === "production" && !amplitudeIsInit) {
      initAmplitude(trackingToken);
      setAmplitudeIsInit(true);
    }
  }, [router.isReady, trackingToken, router.asPath]);

  return (
    <AmplitudeCtx.Provider value={{ amplitudeIsInit, setAmplitudeIsInit }}>
      <QueryClientProvider client={queryClient}>
        {getLayout(<Component {...pageProps} />)}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AmplitudeCtx.Provider>
  );
}

export default MyApp;
