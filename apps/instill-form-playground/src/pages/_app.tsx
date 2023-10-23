import "@/styles/globals.css";
import "@instill-ai/design-tokens/dist/theme/root.css";
import "@instill-ai/design-tokens/dist/theme/light.css";
import "@instill-ai/design-tokens/dist/theme/dark.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
