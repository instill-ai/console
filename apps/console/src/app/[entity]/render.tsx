"use client";

import { Logo } from "@instill-ai/design-system";
import { AppTopbar, PageBase, UserProfileView } from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";

export function ProfilePageRender() {
  useAppAccessToken({
    disabledRedirectingVisitor: true,
    forceQueryWithoutAccessToken: true,
  });

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 !py-8">
          <UserProfileView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
