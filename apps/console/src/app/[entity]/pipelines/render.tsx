"use client";

import { Logo } from "@instill-ai/design-system";
import { AppTopbar, PageBase, ViewPipelines } from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

export const PipelinesViewPageRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <ViewPipelines organizations={undefined} />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
