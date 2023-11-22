import * as React from "react";
import { useRouter } from "next/router";
import {
  InstillJSONSchema,
  PageBase,
  PipelineListPageMainView,
  useInstillForm,
} from "@instill-ai/toolkit";
import { Form, Logo } from "@instill-ai/design-system";

import { ConsoleCorePageHead, Topbar } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";

const PipelinePage: NextPageWithLayout = () => {
  const router = useRouter();
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="pipelines" />
      <PipelineListPageMainView
        router={router}
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
