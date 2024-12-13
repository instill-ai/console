"use client";

import { useRouter } from "next/navigation";

import {
  DashboardContainer,
  DashboardPipelineListPageMainView,
  NamespaceSwitch,
  PageBase,
  SidebarNav,
  TopNavbar,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export function DashboardPageRender() {
  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });

  const router = useRouter();

  return (
    <PageBase>
      <TopNavbar />
      <PageBase.Container>
        <PageBase.Sidebar>
          <SidebarNav namespaceSwitch={<NamespaceSwitch />} />
        </PageBase.Sidebar>
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
