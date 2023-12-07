import * as React from "react";
import { HubView, PageBase, ViewPipelines } from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";
import { ConsoleCorePageHead, Topbar } from "components";
import { useAccessToken } from "lib/useAccessToken";
import { NextPageWithLayout } from "./_app";
import { useTrackToken } from "lib/useTrackToken";

const PipelinesPage: NextPageWithLayout = () => {
  useAccessToken();
  useTrackToken({ enabled: true });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="hub" />
      <HubView />
    </React.Fragment>
  );
};

PipelinesPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PipelinesPage;
