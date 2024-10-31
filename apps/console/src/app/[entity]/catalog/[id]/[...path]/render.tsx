"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { AppTopbar, CatalogMainView, NamespaceSwitch, PageBase } from "@instill-ai/toolkit";
import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const CatalogTabPageRender = () => {
  const params = useParams();
  const router = useRouter();
  const { tab } = params as { id: string; tab?: string[] };
  const activeTab = tab?.[0] || "upload";

  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <CatalogMainView
          accessToken={accessToken.isSuccess ? accessToken.data : null}
          enableQuery={accessToken.isSuccess}
          router={router}
          activeTab={activeTab}
        />
      </PageBase.Container>
    </PageBase>
  );
};