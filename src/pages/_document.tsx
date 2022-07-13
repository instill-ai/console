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
        {`${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}` ===
        "https://demo.instill.tech" ? (
          <>
            <script
              async={true}
              src={`https://www.googletagmanager.com/gtag/js?id=G-EDRC5TDLDT`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EDRC5TDLDT', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />
          </>
        ) : null}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default Document;
