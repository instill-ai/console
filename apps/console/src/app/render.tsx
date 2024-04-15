"use client";

import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

export const RootPageRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return <div />;
};
