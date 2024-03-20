import * as React from "react";
import {
  PageBase,
  BreadcrumbWithLink,
  Setting,
  UserSidebar,
  UserAPITokenTab,
  Topbar,
} from "@instill-ai/toolkit";
import { Logo } from "@instill-ai/design-system";

import { NextPageWithLayout } from "../_app";
import { useAccessToken } from "lib/use-access-token/client";
import { ConsoleCorePageHead } from "components";

const APITokenSetting: NextPageWithLayout = () => {
  useAccessToken();

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Settings" />
      <div className="mb-[52px] w-full px-20">
        <BreadcrumbWithLink
          items={[{ label: "Home", link: "/" }, { label: "Settings" }]}
        />
      </div>
      <Setting.Root>
        <UserSidebar />
        <UserAPITokenTab />
      </Setting.Root>
    </React.Fragment>
  );
};

APITokenSetting.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 !py-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default APITokenSetting;