import { useRouter } from "next/router";
import { Logo } from "@instill-ai/design-system";
import {
  DashboardPipelineDetailsPageMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";

import { ConsoleCorePageHead, Sidebar } from "@/components";
import { NextPageWithLayout } from "@/pages/_app";

const PipelinePage: NextPageWithLayout = () => {
  const router = useRouter();

  return (
    <>
      <ConsoleCorePageHead title="Dashboard pipeline details" />
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
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content contentPadding="py-8 px-16">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
