import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";

import { env, CreateAIForm } from "@instill-ai/toolkit";
import { PageTitle, PageHead, Topbar, Sidebar, PageBase } from "@/components";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
    return {
      redirect: {
        destination: "/ais",
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

const CreateAIPage: FC & {
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
          disabledButton={true}
          marginBottom="mb-10"
        />
        <CreateAIForm accessToken={null} onCreate={() => router.push("/ais")} />
      </div>
    </>
  );
};

CreateAIPage.getLayout = (page) => {
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

export default CreateAIPage;
