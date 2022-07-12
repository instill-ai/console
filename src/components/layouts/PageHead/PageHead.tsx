import { FC } from "react";
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

  return (
    <>
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
        <meta property="og:title" content={meta.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content={meta.siteName} />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.pageDescription} />
      </Head>
    </>
  );
};

export default PageHead;
