import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import {
  useUserModelReadme,
  ModelHubSettingPageMainView,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import {
  PageHead,
  ModelReadmeMarkdown,
  Topbar,
  Sidebar,
  PageBase,
} from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const ModelDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  const modelReadme = useUserModelReadme({
    modelName: id ? `users/instill-ai/models/${id}` : null,
    accessToken: null,
    enabled: !!id,
  });

  return (
    <>
      <PageHead title={`models/${id}`} />
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
