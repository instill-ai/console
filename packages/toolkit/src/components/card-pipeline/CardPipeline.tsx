"use client";

import * as React from "react";
import Link from "next/link";
import { Pipeline } from "instill-sdk";

import { Icons, Skeleton, Tag } from "@instill-ai/design-system";

import { ImageWithFallback } from "..";
import { Menu } from "./Menu";
import { Stats } from "./Stats";
import { Tags } from "./Tags";

const modelCoverImageCommonProps = {
  alt: "Cover",
  className: "shrink-0 rounded",
  width: 156,
  height: 156,
};

export const CardPipelineSkeleton = () => {
  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line bg-white p-4">
      <Skeleton className="h-40 w-40 rounded" />
      <div className="flex grow flex-col gap-y-2">
        <Skeleton className="h-6 w-60 rounded" />
        <div className="flex flex-row gap-x-2">
          <Skeleton className="mt-auto h-6 w-16 rounded" />
          <Skeleton className="mt-auto h-6 w-24 rounded" />
        </div>
        <Skeleton className="h-6 w-3/6 rounded" />
        <div className="mt-auto flex w-full flex-row justify-between">
          <Skeleton className="mt-auto h-6 w-20 rounded" />
          <Skeleton className="mt-auto h-6 w-32 rounded" />
        </div>
      </div>
    </div>
  );
};

export type CardPipelineProps = {
  pipeline: Pipeline;
  onDelete?: (model: Pipeline) => Promise<void>;
  hidePublicLabel?: boolean;
};

export const CardPipeline = ({
  pipeline,
  onDelete,
  hidePublicLabel,
}: CardPipelineProps) => {
  const ownerId = React.useMemo(() => {
    return pipeline.name.split("/")[1];
  }, [pipeline]);

  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line bg-white p-4">
      <ImageWithFallback
        src={pipeline.profileImage}
        fallbackImg={
          <img
            src="/images/models/model-placeholder.svg"
            {...modelCoverImageCommonProps}
          />
        }
        {...modelCoverImageCommonProps}
      />
      <div className="flex grow flex-col gap-y-2">
        <div className="flex w-full flex-row items-start gap-x-2">
          <Icons.Pipeline className="h-6 w-6 stroke-semantic-accent-default" />
          <Link
            href={`/${ownerId}/pipelines/${pipeline.id}/playground`}
            className="break-all font-medium text-semantic-accent-default hover:!underline"
          >
            {ownerId}/{pipeline.id}
          </Link>
          {!hidePublicLabel ? (
            <Tag
              variant="lightNeutral"
              size="md"
              className="gap-x-1.5 rounded-sm !py-0.5"
            >
              {!pipeline.sharing.users["*/*"]?.enabled ? (
                <React.Fragment>
                  <Icons.Lock03 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
                  Private
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Icons.BookOpen02 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
                  Public
                </React.Fragment>
              )}
            </Tag>
          ) : null}
          {pipeline.tags.length > 0 ? <Tags tags={pipeline.tags} /> : null}
          {onDelete ? (
            <Menu
              handleDeletePipeline={() => onDelete(pipeline)}
              pipeline={pipeline}
            />
          ) : null}
        </div>
        <p className="text-base text-semantic-fg-secondary">
          {pipeline.description}
        </p>
        <Stats
          updatedAt={pipeline.updateTime || pipeline.createTime}
          runCount={pipeline.stats.numberOfRuns}
        />
      </div>
    </div>
  );
};
