"use client";

import { useAppAccessToken } from "lib/use-app-access-token";

import {
  AppTopbar,
  BreadcrumbWithLink,
  NamespaceSwitch,
  PageBase,
  Setting,
  UserSecretTab,
  UserSidebar,
} from "@instill-ai/toolkit";

export function SecretSettingdPageRender() {
  useAppAccessToken();
  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <div className="mb-[52px] w-full px-20">
            <BreadcrumbWithLink
              items={[{ label: "Home", link: "/" }, { label: "Settings" }]}
            />
          </div>
          <Setting.Root>
            <UserSidebar />
            <UserSecretTab />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
