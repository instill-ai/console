import { GetServerSideProps, Metadata } from "next";
import React from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/settings/profile",
      permanent: false,
    },
  };
};

export async function generateMetadata(): Promise<Metadata> {
  const metadata: Metadata = {
    title: `Instill Cloud | Setting`,
    openGraph: {
      images: ["/instill-open-graph.png"],
    },
  };
  return Promise.resolve(metadata);
}

export default async function Page() {
  return <React.Fragment />;
}
