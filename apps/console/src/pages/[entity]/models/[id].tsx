import * as React from "react";
import { useRouter } from "next/router";
import {
  useUserModelReadme,
  ModelHubSettingPageMainView,
  PageBase,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import {
  ModelReadmeMarkdown,
  ConsoleCorePageHead,
  Topbar,
} from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";

const ModelDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id, entity } = router.query;
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  const modelReadme = useUserModelReadme({
    modelName: id ? `users/${entity}/models/${id}` : null,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    enabled: accessToken.isSuccess,
  });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title={`models/${id}`} />
      <ModelHubSettingPageMainView
        router={router}
        accessToken={accessToken.isSuccess ? accessToken.data : null}
        enableQuery={accessToken.isSuccess}
        modelReadme={
          <ModelReadmeMarkdown
            isLoading={modelReadme.isLoading}
            markdown={modelReadme.isSuccess ? modelReadme.data : null}
            className="mb-5"
          />
        }
        modelNamespace="admin"
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
