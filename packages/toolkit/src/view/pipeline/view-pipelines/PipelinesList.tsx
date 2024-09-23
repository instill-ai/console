"use client";

import { Pipeline } from "instill-sdk";

import { cn } from "@instill-ai/design-system";

import { CardPipeline, CardPipelineSkeleton } from "../../../components";

export type PipelinesListProps = {
  pipelines?: Pipeline[];
  onPipelineDelete: () => void;
  isLoading: boolean;
  isSearchActive: boolean;
};


export const PipelinesList = (props: PipelinesListProps) => {
  const { pipelines, isLoading, isSearchActive } = props;

  const isEmpty = !isLoading && !pipelines?.length;

  /* -------------------------------------------------------------------------
   * Handle pipeline pipeline
   * -----------------------------------------------------------------------*/


  return (
    <div
      className={cn(
        "mb-4 flex flex-col gap-y-4",
        isEmpty ? "items-center justify-center" : null,
      )}
    >
      {isLoading ? (
        Array.from(new Array(5)).map((_item, index) => (
          <CardPipelineSkeleton key={index} />
        ))
      ) : !isEmpty ? (
        pipelines?.map((pipeline, index) => {
          return (
            <CardPipeline
              pipeline={pipeline}
              key={index}
            />
          );
        })
      ) : (
        <div className="relative">
          <img
            width={513}
            height={481}
            src="/images/models/no-models-placeholder.svg"
            alt="A box and a looking glass"
          />
          <p className="absolute left-1/2 top-3/4 flex -translate-x-1/2 flex-col items-center gap-y-2 text-center text-xl font-semibold text-semantic-fg-primary">
            <span className="whitespace-nowrap">No pipelines found</span>
            <span className="text-base font-normal text-semantic-fg-secondary">
              {isSearchActive
                ? "Your search did not match any pipelines"
                : "Once you create a pipeline, it will appear here"}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
