"use client";

import { useRouter } from "next/navigation";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import {
  AppTopbar,
  DashboardPipelineListPageMainView,
  PageBase,
} from "@instill-ai/toolkit";

export function DashboardPageRender() {
  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <DashboardPipelineListPageMainView
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
            router={router}
          />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
