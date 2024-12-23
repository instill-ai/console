"use client";

import {
  PageBase,
  Setting,
  SETTING_PAGE_CONTENT_PADDING,
  TopNavbar,
  UserProfileTab,
  UserSidebar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";

export function ProfileSettingPageRender() {
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
            <UserProfileTab />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
