import * as React from "react";
import { PageBase, UserProfileView } from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { NextPageWithLayout } from "../_app";
import { ConsoleCorePageHead, Topbar } from "components";

const ProfilePage: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Settings" />
      <UserProfileView />
    </React.Fragment>
  );
};

ProfilePage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 !py-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default ProfilePage;
