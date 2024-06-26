"use client";

import { useAppAccessToken } from "lib/use-app-access-token";
import { useAppTrackToken } from "lib/useAppTrackToken";

import { PipelineBuilderMainView } from "@instill-ai/toolkit";

export const PipelineBuilderRender = () => {
  useAppAccessToken();
  useAppTrackToken({ enabled: true });

  return <PipelineBuilderMainView />;
};
