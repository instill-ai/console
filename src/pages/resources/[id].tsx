import { FC, ReactElement } from "react";
import { useRouter } from "next/router";
import { ResourceSettingPageMainView } from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { PageHead, Topbar, Sidebar, PageBase } from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const ResourceDetailsPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <>
      <PageHead title={`resources/${id}`} />
      <ResourceSettingPageMainView
        router={router}
        accessToken={null}
        enableQuery={true}
      />
    </>
  );
};

ResourceDetailsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={180} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default ResourceDetailsPage;
