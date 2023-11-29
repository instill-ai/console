import React from "react";
import {
  ConsoleCorePageHead,
  OrganizationSidebar,
  Topbar,
} from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";

import {
  PageBase,
  OrganizationSettings,
  APITokenTab,
  BreadcrumbWithLink
} from "@instill-ai/toolkit";
import {  Logo } from "@instill-ai/design-system";

const SettingsPage: NextPageWithLayout = () => {
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Open AI" />
      <BreadcrumbWithLink
        items={[
          { label: "Home", link: "/" },
          { label: "Organisations", link: "/settings/organizations" },
          { label: "Settings" },
        ]}
      />
      <div className="w-full flex mt-16 gap-x-14">
        <div className="w-1/6">
          <OrganizationSidebar />
        </div>
        <div className="w-5/6">
          <APITokenTab
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

SettingsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="px-28 py-10">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default SettingsPage;
