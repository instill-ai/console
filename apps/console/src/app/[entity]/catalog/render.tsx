"use client";


import {
  AppTopbar,
  CatalogMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";
import { useAppAccessToken } from "~/lib/use-app-access-token";

import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const CatalogPageRender = () => {

  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!p-0">
          <CatalogMainView
            activeTab="catalogs"
          />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
