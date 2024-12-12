"use client";

import {
  ModelHubListPageMainView,
  NamespaceSwitch,
  PageBase,
  SidebarNav,
  TopNavbar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export function ModelsPageRender() {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <TopNavbar />
      <PageBase.Container>
        <PageBase.Sidebar>
          <SidebarNav namespaceSwitch={<NamespaceSwitch />} />
        </PageBase.Sidebar>
        <PageBase.Content contentPadding="p-8">
          <ModelHubListPageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
