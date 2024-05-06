"use client";

import * as React from "react";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";
import { useRouter } from "next/navigation";

export const RootPageRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });
  const router = useRouter();

  React.useEffect(() => {
    router.push("/admin/pipelines");
  }, [router]);

  return <div />;
};
