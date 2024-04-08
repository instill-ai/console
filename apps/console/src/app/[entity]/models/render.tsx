"use client";

import { Logo } from "@instill-ai/design-system";
import {
  AppTopbar,
  ModelHubListPageMainView,
  PageBase,
} from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useRouter } from "next/navigation";

export function ModelsPageRender() {
  const accessToken = useAppAccessToken({
    disabledRedirectingVisitor: true,
    forceQueryWithoutAccessToken: true,
  });

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
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
