"use client";

import * as React from "react";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";
import { useRouter } from "next/navigation";

export const RootPageRender = () => {
  useAppAccessToken();
  const trackToken = useAppTrackToken({ enabled: true });
  const router = useRouter();

  React.useEffect(() => {
    if (trackToken.isSuccess && trackToken.data) {
      router.push("/admin/pipelines");
    } else {
      router.push("/login");
    }
  }, [trackToken.isSuccess, trackToken.data]);

  return <div />;
};
