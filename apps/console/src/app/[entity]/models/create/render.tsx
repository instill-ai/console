"use client";

import {
  ModelHubCreatePageMainView,
  NamespaceSwitch,
  PageBase,
  SidebarNav,
  TopNavbar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export function CreateModelPageRender() {
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
          <ModelHubCreatePageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
