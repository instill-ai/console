import * as React from "react";
import { useRouter } from "next/router";
import { PageBase, ViewPipeline } from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { ConsoleCorePageHead, Topbar } from "../../../../components";
import { NextPageWithLayout } from "../../../_app";
import { useAccessToken } from "../../../../lib/useAccessToken";
import { useTrackToken } from "../../../../lib/useTrackToken";

const PipelinePage: NextPageWithLayout = () => {
  useAccessToken();
  useTrackToken({ enabled: true });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="pipelines" />
      <ViewPipeline />
    </React.Fragment>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-0">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
