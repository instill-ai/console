import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { z } from "zod";

import { env, CreateBlockchainForm } from "@instill-ai/toolkit";
import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
    return {
      redirect: {
        destination: "/blockchains",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

type GetLayOutProps = {
  page: ReactElement;
};

const CreateBlockchainPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <PageHead title="Set up AI connector" />
      <div className="flex flex-col">
        <PageTitle
          title="Set Up New AI Connector"
          breadcrumbs={["AI", "AI Connector Settings"]}
          enableButton={false}
          marginBottom="mb-10"
        />
        <CreateBlockchainForm
          accessToken={null}
          onCreate={() => router.push("/blockchains")}
        />
      </div>
    </>
  );
};

CreateBlockchainPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default CreateBlockchainPage;
