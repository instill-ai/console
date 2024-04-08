"use client";

import { Logo } from "@instill-ai/design-system";
import {
  AppTopbar,
  ModelHubCreatePageMainView,
  PageBase,
} from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useRouter } from "next/navigation";

export function CreateModelPageRender() {
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
          <ModelHubCreatePageMainView
            router={router}
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
            disabledCreateModel={false}
          />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
