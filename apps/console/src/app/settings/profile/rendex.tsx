"use client";

import { Logo } from "@instill-ai/design-system";
import {
  AppTopbar,
  BreadcrumbWithLink,
  PageBase,
  Setting,
  UserProfileTab,
  UserSidebar,
} from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useRouter } from "next/navigation";

export function ProfileSettingPageRender() {
  const accessToken = useAppAccessToken({
    disabledRedirectingVisitor: true,
    forceQueryWithoutAccessToken: true,
  });

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <div className="mb-[52px] w-full px-20">
            <BreadcrumbWithLink
              items={[{ label: "Home", link: "/" }, { label: "Settings" }]}
            />
          </div>
          <Setting.Root>
            <UserSidebar />
            <UserProfileTab
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
