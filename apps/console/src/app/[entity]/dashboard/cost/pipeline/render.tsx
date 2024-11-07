"use client";

import * as React from "react";

import {
  AppTopbar,
  DashboardCostPipelinePageMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export default function CostPipelineRender() {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <DashboardCostPipelinePageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
