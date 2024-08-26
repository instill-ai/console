"use client";

import type { Pipeline } from "instill-sdk";
import { useParams } from "next/navigation";

import {
  PipelineRunView as PipelineRun,
  PipelineRunList,
} from "./PipelineRunViews";

export type PipelineRunsProps = {
  pipeline?: Pipeline;
};

export const PipelineRuns = ({ pipeline }: PipelineRunsProps) => {
  const { path } = useParams();

  if (path?.length === 1) {
    return <PipelineRunList pipeline={pipeline} />;
  } else {
    return <PipelineRun pipeline={pipeline} id={path?.[1]} />;
  }
};
