"use client";

import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import {
  AppTopbar,
  DashboardPipelineDetailsPageMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

export function PipelineDashboardPageRender() {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <DashboardPipelineDetailsPageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
