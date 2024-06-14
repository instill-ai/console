"use client";

import {
  AppTopbar,
  BreadcrumbWithLink,
  PageBase,
  Setting,
  UserAccountTab,
  UserSidebar,
} from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useRouter } from "next/navigation";

export function AccountSettingPageRender() {
  const accessToken = useAppAccessToken();

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <div className="mb-[52px] w-full px-20">
            <BreadcrumbWithLink
              items={[{ label: "Home", link: "/" }, { label: "Settings" }]}
            />
          </div>
          <Setting.Root>
            <UserSidebar />
            <UserAccountTab
              router={router}
              accessToken={accessToken.isSuccess ? accessToken.data : null}
              enableQuery={accessToken.isSuccess}
            />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
