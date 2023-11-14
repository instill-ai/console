import { GetServerSideProps } from "next";
import { Logo } from "@instill-ai/design-system";

import { Sidebar, Topbar } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { PageBase } from "@instill-ai/toolkit";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/pipelines",
      permanent: false,
    },
  };
};

const CreatePipelinePage: NextPageWithLayout = () => {
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
