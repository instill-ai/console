"use client";

import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import { AppTopbar, PageBase, UserProfileView } from "@instill-ai/toolkit";

export function ProfilePageRender() {
  useAppAccessToken({
    disabledRedirectingVisitor: true,
    forceQueryWithoutAccessToken: true,
  });
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 py-8">
          <UserProfileView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
