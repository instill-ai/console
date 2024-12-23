"use client";

import {
  PageBase,
  Setting,
  SETTING_PAGE_CONTENT_PADDING,
  TopNavbar,
  UserIntegrationsTab,
  UserSidebar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";

export function IntegrationsSettingsPageRender() {
  useAppAccessToken();

  return (
    <PageBase>
      <TopNavbar />
      <PageBase.Container>
        <PageBase.Content contentPadding={SETTING_PAGE_CONTENT_PADDING}>
          <Setting.Root
            breadcrumbItems={[
              { label: "Home", link: "/" },
              { label: "Settings" },
            ]}
          >
            <UserSidebar />
            <UserIntegrationsTab />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
