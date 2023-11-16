import * as React from "react";
import { ConsoleCorePageHead, ProfileSidebar, Topbar } from "../../components";
import { PageBase, BillingTab } from "@instill-ai/toolkit";
import { Breadcrumb, Logo } from "@instill-ai/design-system";
import { NextPageWithLayout } from "../_app";
import { useTrackToken } from "../../lib/useTrackToken";

const SettingsPage: NextPageWithLayout = () => {
  useTrackToken({ enabled: true });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Settings" />
      <Breadcrumb
        items={[{ label: "Home", link: "/" }, { label: "Settings" }]}
      />
      <div className="w-full flex mt-16 gap-x-14">
        <div className="w-1/6">
          <ProfileSidebar />
        </div>
        <div className="5/6">
          <BillingTab />
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
