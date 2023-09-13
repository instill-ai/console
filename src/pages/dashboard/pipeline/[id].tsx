import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { Logo } from "@instill-ai/design-system";
import { DashboardPipelineDetailsPageMainView } from "@instill-ai/toolkit";

import { PageBase, PageHead, Sidebar, Topbar } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();

  return (
    <>
      <PageHead title="Dashboard pipeline details" />
      <DashboardPipelineDetailsPageMainView
        router={router}
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
