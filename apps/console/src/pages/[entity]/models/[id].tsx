import * as React from "react";
import { useRouter } from "next/router";
import {
  ModelHubSettingPageMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { ConsoleCorePageHead } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/use-access-token/client";
import { useTrackToken } from "../../../lib/useTrackToken";

const ModelDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title={id ? id.toString() : null} />
      <ModelHubSettingPageMainView
        router={router}
        accessToken={accessToken.isSuccess ? accessToken.data : null}
        enableQuery={accessToken.isSuccess}
        disabledConfigureModel={false}
      />
    </React.Fragment>
  );
};

ModelDetailsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default ModelDetailsPage;
