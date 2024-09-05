"use client";

import { useRouter } from "next/navigation";

import {
  AppTopbar,
  BreadcrumbWithLink,
  NamespaceSwitch,
  PageBase,
  Setting,
  useAuthenticatedUser,
  UserIntegrationsTab,
  UserSidebar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";

export function IntegrationsSettingsPageRender() {
  const accessToken = useAppAccessToken();
  const me = useAuthenticatedUser({
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    enabled: accessToken.isSuccess,
  });

  const router = useRouter();
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
            <UserIntegrationsTab
              router={router}
              accessToken={accessToken.isSuccess ? accessToken.data : null}
              enableQuery={accessToken.isSuccess}
              namespaceId={me.isSuccess ? me.data.id : null}
            />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
