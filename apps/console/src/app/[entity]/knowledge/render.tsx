"use client";

import { AppTopbar, KnowledgeBaseView, NamespaceSwitch, PageBase } from "@instill-ai/toolkit";
import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";
import { useRouter } from "next/navigation";

export const KnowladgeBasePageRender = () => {
  const router = useRouter();

  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });
  // useInitAmplitude();

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <KnowledgeBaseView />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
