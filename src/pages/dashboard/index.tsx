import { FC, ReactElement } from "react";
import { Logo } from "@instill-ai/design-system";
import { DashboardPipelineListPageMainView } from "@instill-ai/toolkit";

import { PageBase, PageHead, Sidebar, Topbar } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <>
      <PageHead title="dashboard" />
      <DashboardPipelineListPageMainView
        accessToken={null}
        enableQuery={true}
      />
    </>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content contentPadding="py-8 px-16">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
