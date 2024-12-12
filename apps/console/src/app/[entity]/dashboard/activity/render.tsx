"use client";

import * as React from "react";

import {
  DashboardActivityPageMainView,
  NamespaceSwitch,
  PageBase,
  SidebarNav,
  TopNavbar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export default function ActivityRender() {
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
          <DashboardActivityPageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
