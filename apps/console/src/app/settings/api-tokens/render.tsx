"use client";

import {
  AppTopbar,
  NamespaceSwitch,
  PageBase,
  Setting,
  SETTING_PAGE_CONTENT_PADDING,
  UserAPITokenTab,
  UserSidebar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";

export function ApiTokenSettingsPageRender() {
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
            <UserAPITokenTab />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
