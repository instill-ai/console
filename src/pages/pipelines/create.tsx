import { GetServerSideProps } from "next";
import { FC, ReactElement } from "react";
import { env } from "@instill-ai/toolkit";

import { Topbar, Sidebar, PageBase } from "@/components";
import { Logo } from "@instill-ai/design-system";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
    return {
      redirect: {
        destination: "/pipelines/create",
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

const CreatePipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return <div />;
};

CreatePipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="ColourLogomarkWhiteType" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default CreatePipelinePage;
