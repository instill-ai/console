import { FC, ReactElement } from "react";
import { ModelHubListPageMainView } from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";
import { useRouter } from "next/router";

import { PageHead, Topbar, Sidebar, PageBase } from "@/components";
interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  return (
    <>
      <PageHead title="models" />
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
