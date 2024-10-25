"use client";

import * as React from "react";
import { AppTopbar, NamespaceSwitch, PageBase } from "@instill-ai/toolkit";
import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";
import { DashboardCostModelPageMainView } from "node_modules/@instill-ai/toolkit/src/view";
import { useRouter } from "next/navigation";

export default function CostModelRender() {
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
                    <DashboardCostModelPageMainView
                        accessToken={accessToken.isSuccess ? accessToken.data : null}
                        enableQuery={accessToken.isSuccess}
                        router={router}
                    />
                </PageBase.Content>
            </PageBase.Container>
        </PageBase>
    );
}