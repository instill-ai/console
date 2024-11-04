"use client";

import * as React from "react";

import {
  AppTopbar,
  DashboardActivityPageMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export default function ActivityRender() {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <DashboardActivityPageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
