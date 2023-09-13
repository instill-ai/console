import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { PipelineListPageMainView } from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { PageHead, Topbar, Sidebar, PageBase } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const PipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  return (
    <>
      <PageHead title="pipelines" />
      <PipelineListPageMainView
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
        <PageBase.Content contentPadding="p-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
