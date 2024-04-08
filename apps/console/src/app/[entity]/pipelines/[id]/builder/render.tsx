"use client";

import { PipelineBuilderMainView } from "@instill-ai/toolkit";
import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

export const PipelineBuilderRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return <PipelineBuilderMainView />;
};
