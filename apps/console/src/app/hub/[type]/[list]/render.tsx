"use client";

import { Logo } from "@instill-ai/design-system";
import { AppTopbar, HubView, PageBase } from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";

export const HubPageRender = () => {
  useAppAccessToken({
    disabledRedirectingVisitor: true,
    forceQueryWithoutAccessToken: true,
  });

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <HubView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
