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
<<<<<<< HEAD
=======
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/favicon.ico" />
>>>>>>> fc870b8 (fix: unify text of console)
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
