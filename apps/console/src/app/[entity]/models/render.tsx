"use client";

import { useRouter } from "next/navigation";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import {
  AppTopbar,
  ModelHubListPageMainView,
  PageBase,
} from "@instill-ai/toolkit";

export function ModelsPageRender() {
  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <ModelHubListPageMainView
            router={router}
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
          />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
