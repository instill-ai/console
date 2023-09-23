import { useRouter } from "next/router";
import {
  ModelHubListPageMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { Sidebar, ConsoleCorePageHead } from "@/components";
import { NextPageWithLayout } from "@/pages/_app";
import { useAccessToken } from "@/lib";

const ModelPage: NextPageWithLayout = () => {
  const router = useRouter();
  const accessToken = useAccessToken();
  return (
    <>
      <ConsoleCorePageHead title="models" />
      <ModelHubListPageMainView
        router={router}
        accessToken={accessToken.isSuccess ? accessToken.data : null}
        enableQuery={accessToken.isSuccess}
      />
    </>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
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
