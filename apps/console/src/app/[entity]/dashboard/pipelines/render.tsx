"use client";

import { useRouter } from "next/navigation";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import {
  AppTopbar,
  DashboardContainer,
  DashboardPipelineListPageMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

export function DashboardPageRender() {
  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <DashboardContainer>
            <DashboardPipelineListPageMainView
              accessToken={accessToken.isSuccess ? accessToken.data : null}
              enableQuery={accessToken.isSuccess}
              router={router}
            />
          </DashboardContainer>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
