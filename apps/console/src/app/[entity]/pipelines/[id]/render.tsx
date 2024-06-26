"use client";

import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import { AppTopbar, PageBase, ViewPipeline } from "@instill-ai/toolkit";

export function PipelineOverviewPageRender() {
  useAppAccessToken({
    disabledRedirectingVisitor: true,
    forceQueryWithoutAccessToken: true,
  });
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-0">
          <ViewPipeline />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
