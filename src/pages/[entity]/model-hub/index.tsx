import { useRouter } from "next/router";
import {
  ModelHubListPageMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { Sidebar, ConsoleCorePageHead } from "@/components";
import { NextPageWithLayout } from "@/pages/_app";

const ModelPage: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <>
      <ConsoleCorePageHead title="models" />
      <ModelHubListPageMainView
        router={router}
        accessToken={null}
        enableQuery={true}
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
