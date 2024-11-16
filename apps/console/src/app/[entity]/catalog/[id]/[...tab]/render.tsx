"use client";

import * as React from "react";
import { useParams } from "next/navigation";

import {
  AppTopbar,
  CatalogMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const CatalogTabPageRender = () => {
  const params = useParams();
  const { id, tab } = params as { id: string; tab: string[] };
  const activeTab = tab?.[0] || "upload";

  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <CatalogMainView activeTab={activeTab} catalogId={id} />
      </PageBase.Container>
    </PageBase>
  );
};
