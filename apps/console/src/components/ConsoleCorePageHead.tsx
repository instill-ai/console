import { Nullable, PageHead } from "@instill-ai/toolkit";

export type ConsoleCorePageHeadProps = {
  title: Nullable<string>;
};

export const ConsoleCorePageHead = ({ title }: ConsoleCorePageHeadProps) => {
  return (
    <PageHead
      meta={{
        type: "website",
        siteName: "Instill AI - Versatile Data Pipeline (VDP)",
        title: title
          ? `Instill Core | ${title}`
          : "Instill Core | Build unstructured data pipelines 10x faster",
        pageDescription:
          "Versatile Data Pipeline (VDP) is a data ETL tool to streamline the end-to-end unstructured data processing pipeline",
      }}
    />
  );
};
