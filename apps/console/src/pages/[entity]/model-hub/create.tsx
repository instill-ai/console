import * as React from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { Logo } from "@instill-ai/design-system";
import {
  env,
  ModelHubCreatePageMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";

import { Sidebar, ConsoleCorePageHead } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";

export const getServerSideProps: GetServerSideProps = async () => {
  if (env("NEXT_PUBLIC_DISABLE_CREATE_UPDATE_DELETE_RESOURCE")) {
    return {
      redirect: {
        destination: "/model-hub",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

const CreateModelPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Create model" />
      <ModelHubCreatePageMainView
        router={router}
        accessToken={accessToken.isSuccess ? accessToken.data : null}
        enableQuery={accessToken.isSuccess}
        disabledCreateModel={false}
      />
    </React.Fragment>
  );
};

CreateModelPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default CreateModelPage;
