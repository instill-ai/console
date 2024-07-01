"use client";

import { useAppTrackToken } from "lib/useAppTrackToken";

import {
  AppTopbar,
  ModelHubCreatePageMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

export function CreateModelPageRender() {
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <ModelHubCreatePageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
