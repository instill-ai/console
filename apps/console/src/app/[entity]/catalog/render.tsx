"use client";


import {
  AppTopbar,
  CatalogMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const CatalogPageRender = () => {

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
