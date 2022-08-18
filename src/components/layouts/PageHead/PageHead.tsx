import { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { Nullable } from "@/types/general";

export interface PageHeadProps {
  title: Nullable<string>;
}

const PageHead: FC<PageHeadProps> = ({ title }) => {
  const router = useRouter();
  const meta = {
    type: "website",
    siteName: "Instill AI - Visual Data Preparation (VDP)",
    title: title ? title : "Instill AI - Visual Data Preparation (VDP)",
    pageDescription:
      "Visual Data Preparation (VDP) is an open-source visual data ETL tool to streamline the end-to-end visual data processing pipeline",
  };

  const canonicalURL =
    router.asPath === "/"
      ? `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}${router.asPath}`
      : `${process.env.NEXT_PUBLIC_CONSOLE_BASE_URL}${router.asPath}` + "/";

  const [hostName, setHostName] = useState<Nullable<string>>(null);

  useEffect(() => {
    setHostName(new URL(window.location.href).hostname);
  }, []);

  return (
    <>
      <Head>
        <title>{"VDP | " + meta.title}</title>
        {meta.pageDescription && (
          <meta content={meta.pageDescription} name="description" />
        )}
        <meta property="og:url" content={canonicalURL} />
        <link rel="canonical" href={canonicalURL} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content={meta.siteName} />
        <meta property="og:description" content={meta.pageDescription} />
        <meta property="og:title" content={meta.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={meta.siteName} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.pageDescription} />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/images/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/images/favicon-16x16.png"
        />
        <link rel="shortcut icon" href="/images/favicon.ico" />
        {hostName === "demo.instill.tech" ? (
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
    </>
  );
};

export default PageHead;
