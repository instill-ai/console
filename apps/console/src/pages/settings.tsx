import { ConsoleCorePageHead, Sidebar } from "../components";
import {
  Topbar,
  PageBase,
  ProfileTab,
  APITokenTab,
  SettingsPageView,
} from "@instill-ai/toolkit";

import { Logo } from "@instill-ai/design-system";
import { NextPageWithLayout } from "./_app";
import { useAccessToken } from "../lib/useAccessToken";

const SettingsPage: NextPageWithLayout = () => {
  const accessToken = useAccessToken();

  const tabs = [
    {
      id: "profile",
      name: "My Details",
      element: (
        <ProfileTab
          accessToken={accessToken.isSuccess ? accessToken.data : null}
          enableQuery={accessToken.isSuccess}
        />
      ),
    },
    {
      id: "api-tokens",
      name: "API Tokens",
      element: (
        <APITokenTab
          accessToken={accessToken.isSuccess ? accessToken.data : null}
          enableQuery={accessToken.isSuccess}
        />
      ),
    },
  ];

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <>
      <ConsoleCorePageHead title="Settings" />
      <SettingsPageView tabs={tabs} enableQuery={accessToken.isSuccess} />
    </>
  );
};

SettingsPage.getLayout = (page) => {
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

export default SettingsPage;
