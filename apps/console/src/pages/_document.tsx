/* eslint-disable @next/next/no-sync-scripts */

import { Html, Head, Main, NextScript } from "next/document";
import { FC } from "react";
import { env } from "@instill-ai/toolkit";

export const Document: FC = () => {
  return (
    <Html>
      <Head>
        <meta
          property="og:image"
          content={`${env(
            "NEXT_PUBLIC_CONSOLE_BASE_URL",
          )}/images/instill-open-graph.png`}
        />
        <meta
          property="twitter:image"
          content={`${env(
            "NEXT_PUBLIC_CONSOLE_BASE_URL",
          )}/images/instill-open-graph.png`}
        />

        <script src="/__env.js" />
      </Head>
      <body className="overflow-y-hidden">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
