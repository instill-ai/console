"use client";

import { Logo } from "@instill-ai/design-system";
import {
  AppTopbar,
  BreadcrumbWithLink,
  PageBase,
  Setting,
  UserAPITokenTab,
  UserSidebar,
} from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";

export function APITokensViewPageRender() {
  useAppAccessToken({
    disabledRedirectingVisitor: true,
  });

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 py-8">
          <div className="mb-[52px] w-full px-20">
            <BreadcrumbWithLink
              items={[{ label: "Home", link: "/" }, { label: "Settings" }]}
            />
          </div>
          <Setting.Root>
            <UserSidebar />
            <UserAPITokenTab />
          </Setting.Root>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
