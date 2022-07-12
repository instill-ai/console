import { Html, Head, Main, NextScript } from "next/document";
import { FC } from "react";

export const Document: FC = () => {
  return (
    <Html>
      <Head>
        <meta
          property="og:image"
          content={`${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}/images/instill-open-graph.png`}
        />
        <meta
          property="twitter:image"
          content={`${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}/images/instill-open-graph.png`}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
