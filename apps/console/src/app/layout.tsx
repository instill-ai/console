import * as React from "react";
import cn from "clsx";
import "../styles/global.css";
import "../styles/github-markdown.css";
import "@instill-ai/design-system/dist/index.css";
import "@instill-ai/design-tokens/dist/theme/root.css";
import "@instill-ai/design-tokens/dist/theme/light.css";
import "@instill-ai/design-tokens/dist/theme/dark.css";
import "reactflow/dist/style.css";
import "../styles/tip-tap.css";

import { env } from "@instill-ai/toolkit";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className={cn(ibmPlexMono.variable, ibmPlexSans.variable)}>
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
        <style></style>
        <script src="/__env.js" />
      </head>
      <body>
        <React.Fragment>{children}</React.Fragment>
      </body>
    </html>
  );
}
