"use client";

import { cn, useToast } from "@instill-ai/design-system";

import { CardPipeline, CardPipelineSkeleton } from "../../../components";
import {
  InstillStore,
  Pipeline,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useDeleteUserPipeline,
  useInstillStore,
  useShallow,
} from "../../../lib";

export type PipelinesListProps = {
  pipelines?: Pipeline[];
  onPipelineDelete: () => void;
  isLoading: boolean;
  isSearchActive: boolean;
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
});

export const PipelinesList = (props: PipelinesListProps) => {
  const { pipelines, onPipelineDelete, isLoading, isSearchActive } = props;
  const { accessToken } = useInstillStore(useShallow(selector));
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { toast } = useToast();

  const isEmpty = !isLoading && !pipelines?.length;

  /* -------------------------------------------------------------------------
   * Handle pipeline pipeline
   * -----------------------------------------------------------------------*/

  const deletePipeline = useDeleteUserPipeline();
  const handleDeletePipeline = async (pipeline: Pipeline) => {
    if (!pipeline) return;

    try {
      await deletePipeline.mutateAsync({
        pipelineName: pipeline.name,
        accessToken: accessToken ? accessToken : null,
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("delete_pipeline");
      }

      if (onPipelineDelete) {
        onPipelineDelete();
      }
    } catch (error) {
      toastInstillError({
        title: "Something went wrong while deleting the pipeline",
        error,
        toast,
      });
    }
  };

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
              onDelete={handleDeletePipeline}
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
