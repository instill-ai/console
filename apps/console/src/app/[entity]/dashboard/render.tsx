"use client";

import { Logo } from "@instill-ai/design-system";
import {
  AppTopbar,
  DashboardPipelineListPageMainView,
  PageBase,
} from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useRouter } from "next/navigation";

export function DashboardPageRender() {
  const accessToken = useAppAccessToken();

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
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
