"use client";

import {
  AppTopbar,
  NamespaceSwitch,
  PageBase,
  Setting,
  SETTING_PAGE_CONTENT_PADDING,
  UserSecretTab,
  UserSidebar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";

export function SecretSettingdPageRender() {
  useAppAccessToken();
  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
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
