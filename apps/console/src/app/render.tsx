"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAppAccessToken } from "~/lib/use-app-access-token";
import { useAppTrackToken } from "~/lib/useAppTrackToken";

export const RootPageRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });
  const router = useRouter();

  React.useEffect(() => {
    router.push("/admin/pipelines");
  }, [router]);

  return <div />;
};
