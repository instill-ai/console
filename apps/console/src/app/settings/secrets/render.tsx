"use client";

import {
  PageBase,
  Setting,
  SETTING_PAGE_CONTENT_PADDING,
  TopNavbar,
  UserSecretTab,
  UserSidebar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";

export function SecretSettingdPageRender() {
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
            <UserSecretTab />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
