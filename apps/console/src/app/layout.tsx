import { env } from "@instill-ai/toolkit/server";
import { ReactQueryProvider } from "./react-query-client-provider";
import { AmplitudeProvider } from "./amplitude-client-provider";

import "../styles/global.css";
import "../styles/github-markdown.css";
import "@instill-ai/design-system/index.css";
import "@instill-ai/design-tokens/dist/theme/root.css";
import "@instill-ai/design-tokens/dist/theme/light.css";
import "@instill-ai/design-tokens/dist/theme/dark.css";
import "reactflow/dist/style.css";
import "../styles/tip-tap.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          property="og:image"
          content={`${env(
            "NEXT_PUBLIC_CONSOLE_BASE_URL"
          )}/images/instill-open-graph.png`}
        />
        <meta
          property="twitter:image"
          content={`${env(
            "NEXT_PUBLIC_CONSOLE_BASE_URL"
          )}/images/instill-open-graph.png`}
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/__env.js" />
      </head>
      <body>
        <ReactQueryProvider>
          <AmplitudeProvider>{children}</AmplitudeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
