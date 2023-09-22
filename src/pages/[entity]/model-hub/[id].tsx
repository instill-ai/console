import { useRouter } from "next/router";
import {
  useUserModelReadme,
  ModelHubSettingPageMainView,
  PageBase,
  Topbar,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import {
  ModelReadmeMarkdown,
  Sidebar,
  ConsoleCorePageHead,
} from "@/components";
import { NextPageWithLayout } from "@/pages/_app";

const ModelDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;

  const modelReadme = useUserModelReadme({
    modelName: id ? `users/instill-ai/models/${id}` : null,
    accessToken: null,
    enabled: !!id,
  });

  return (
    <>
      <ConsoleCorePageHead title={`models/${id}`} />
      <ModelHubSettingPageMainView
        router={router}
        accessToken={null}
        enableQuery={true}
        modelReadme={
          <ModelReadmeMarkdown
            isLoading={modelReadme.isLoading}
            markdown={modelReadme.isSuccess ? modelReadme.data : null}
            className="mb-5"
          />
        }
      />
    </>
  );
};

ModelDetailsPage.getLayout = (page) => {
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

export default ModelDetailsPage;
