"use client";

import {
  NamespaceSwitch,
  PageBase,
  SidebarNav,
  TopNavbar,
  ViewPipelines,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const PipelinesViewPageRender = () => {
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
          <ViewPipelines />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
