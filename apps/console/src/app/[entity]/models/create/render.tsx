"use client";

import {
  AppTopbar,
  ModelHubCreatePageMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export function CreateModelPageRender() {
  useAppAccessToken();
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
