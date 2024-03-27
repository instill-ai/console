import * as React from "react";
import { Logo } from "@instill-ai/design-system";
import {
  DashboardPipelineListPageMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";

import { ConsoleCorePageHead } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/use-access-token/client";
import { useTrackToken } from "../../../lib/useTrackToken";

const PipelinePage: NextPageWithLayout = () => {
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });
  return (
    <React.Fragment>
      <ConsoleCorePageHead title="dashboard" />
      <DashboardPipelineListPageMainView
        accessToken={accessToken.isSuccess ? accessToken.data : null}
        enableQuery={accessToken.isSuccess}
      />
    </React.Fragment>
  );
};

PipelinePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinePage;
