"use client";

import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import {
  AppTopbar,
  NamespaceSwitch,
  PageBase,
  ViewPipelines,
} from "@instill-ai/toolkit";

export const PipelinesViewPageRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <ViewPipelines />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
