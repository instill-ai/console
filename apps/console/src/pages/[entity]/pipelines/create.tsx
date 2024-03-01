import { GetServerSideProps } from "next";
import { Logo } from "@instill-ai/design-system";
import { PageBase, Topbar } from "@instill-ai/toolkit";

import { NextPageWithLayout } from "../../_app";

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
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default CreatePipelinePage;
