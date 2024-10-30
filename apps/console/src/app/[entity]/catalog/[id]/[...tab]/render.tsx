"use client";

import { useRouter } from "next/navigation";

import {
  AppTopbar,
  CatalogMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const CatalogPageRender = () => {
  const router = useRouter();

  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });
  // useInitAmplitude();

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <CatalogMainView
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
            router={router}
          />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
