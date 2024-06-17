"use client";

import {
  AppTopbar,
  ModelHubCreatePageMainView,
  PageBase,
} from "@instill-ai/toolkit";
import { useAppTrackToken } from "lib/useAppTrackToken";

export function CreateModelPageRender() {
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <ModelHubCreatePageMainView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
