"use client";

import {
  PageBase,
  Setting,
  SETTING_PAGE_CONTENT_PADDING,
  TopNavbar,
  UserAPITokenTab,
  UserSidebar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";

export function ApiTokenSettingsPageRender() {
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
            <UserAPITokenTab />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
