import { GetServerSideProps } from "next";
import { FC, ReactElement } from "react";
import { Logo } from "@instill-ai/design-system";

import { Topbar, Sidebar, PageBase } from "@/components";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/pipelines",
      permanent: false,
    },
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
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default CreatePipelinePage;
