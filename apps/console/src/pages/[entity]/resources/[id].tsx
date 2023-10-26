import { useRouter } from "next/router";
import {
  PageBase,
  ResourceSettingPageMainView,
  Topbar,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { Sidebar, ConsoleCorePageHead } from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";

const ResourceDetailsPage: NextPageWithLayout = () => {
  const router = useRouter();
  const { id } = router.query;
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });
  return (
    <>
      <ConsoleCorePageHead title={`resources/${id}`} />
      <ResourceSettingPageMainView
        router={router}
        accessToken={accessToken.isSuccess ? accessToken.data : null}
        enableQuery={accessToken.isSuccess}
      />
    </>
  );
};

ResourceDetailsPage.getLayout = (page) => {
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

export default ResourceDetailsPage;
