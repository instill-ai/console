"use client";

import { Logo } from "@instill-ai/design-system";
import { AppTopbar, KnowledgeBaseView, PageBase } from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";
import { useRouter } from "next/navigation";

export const KnowladgeBasePageRender = () => {
  const router = useRouter();

  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });
  // useInitAmplitude();

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <KnowledgeBaseView
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
            router={router}
          />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
