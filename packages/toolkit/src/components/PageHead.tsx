import * as React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { env } from "../lib";

export type PageHeadProps = {
  meta: {
    type: string;
    siteName: string;
    title: string;
    pageDescription: string;
  };
  additionHead?: React.ReactNode;
};

export const PageHead = ({ meta, additionHead }: PageHeadProps) => {
  const router = useRouter();

  const canonicalURL =
    router.asPath === "/"
      ? `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}`
      : `${env("NEXT_PUBLIC_CONSOLE_BASE_URL")}/${router.asPath}`;

  return (
    <React.Fragment>
      <Head>
        <title>{meta.title}</title>
        {meta.pageDescription && (
          <meta content={meta.pageDescription} name="description" />
        )}
        <meta property="og:url" content={canonicalURL} />
        <link rel="canonical" href={canonicalURL} />
        <meta property="og:type" content={meta.type} />
        <meta property="og:site_name" content={meta.siteName} />
        <meta property="og:description" content={meta.pageDescription} />
        <meta property="og:title" content={meta.siteName} />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={meta.pageDescription} />
        <meta
          property="og:image"
          content={`${env(
            "NEXT_PUBLIC_CONSOLE_BASE_URL"
          )}/images/instill-open-graph.png`}
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={meta.siteName} />
        <meta name="twitter:title" content={meta.siteName} />
        <meta
          property="twitter:image"
          content={`${env(
            "NEXT_PUBLIC_CONSOLE_BASE_URL"
          )}/images/instill-open-graph.png`}
        />
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
        {additionHead}
      </Head>
    </React.Fragment>
  );
};
