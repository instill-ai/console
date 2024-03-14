"use client";

import { ViewPipeline } from "@instill-ai/toolkit";
import { useAccessToken } from "lib/use-app-access-token";

export function PipelineViewPageRender() {
  useAccessToken({
    disabledRedirectingVisitor: true,
  });
  return <ViewPipeline />;
}
