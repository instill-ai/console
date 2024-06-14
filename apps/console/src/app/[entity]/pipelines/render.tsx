"use client";

import { AppTopbar, PageBase, ViewPipelines } from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

export const PipelinesViewPageRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <ViewPipelines />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
