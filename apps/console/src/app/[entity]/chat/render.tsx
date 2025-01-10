"use client";

import { ChatView, PageBase, TopNavbar } from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export function ChatPageRender() {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <TopNavbar />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <ChatView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
