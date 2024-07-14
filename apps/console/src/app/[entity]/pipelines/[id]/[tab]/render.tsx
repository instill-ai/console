"use client";

import {
  AppTopbar,
  NamespaceSwitch,
  PageBase,
  ViewPipeline,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export function PipelineOverviewPageRender() {
  useAppAccessToken({
    disabledRedirectingVisitor: true,
    forceQueryWithoutAccessToken: true,
  });
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <ViewPipeline />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
