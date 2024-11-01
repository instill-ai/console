"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import {
  AppTopbar,
  DashboardActivityPageMainView,
  NamespaceSwitch,
  PageBase,
} from "@instill-ai/toolkit";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export default function ActivityRender() {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  const accessToken = useAppAccessToken();
  useAppTrackToken({ enabled: true });

  const router = useRouter();

  return (
    <PageBase>
      <AppTopbar namespaceSwitch={<NamespaceSwitch />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="p-8">
          <DashboardActivityPageMainView
            accessToken={accessToken.isSuccess ? accessToken.data : null}
            enableQuery={accessToken.isSuccess}
            router={router}
          />
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
