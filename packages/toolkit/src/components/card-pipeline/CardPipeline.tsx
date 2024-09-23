"use client";

import * as React from "react";
import Link from "next/link";
import { Pipeline } from "instill-sdk";

import { Icons, Skeleton, Tag } from "@instill-ai/design-system";

import { Menu } from "./Menu";
import { Stats } from "./Stats";
import { Tags } from "./Tags";

export const CardPipelineSkeleton = () => {
  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line bg-white p-4">
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
      <div className="flex grow flex-col gap-y-2">
        <div className="flex w-full flex-row items-center gap-x-2">
          <Icons.Pipeline className="h-6 w-6 stroke-semantic-accent-default" />
          <Link
            href={`/${ownerId}/pipelines/${pipeline.id}/playground`}
            className="break-all product-body-text-1-semibold text-semantic-accent-default hover:!underline"
          >
            {ownerId}/{pipeline.id}
          </Link>
          {onDelete ? (
            <Menu
              handleDeletePipeline={() => onDelete(pipeline)}
              pipeline={pipeline}
            />
          ) : null}
        </div>
        <div className="flex space-x-2">
          {!hidePublicLabel ? (
            <Tag
              variant="lightNeutral"
              size="sm"
              className="gap-x-1.5 rounded-full !py-0.5"
            >
              {!pipeline.sharing.users["*/*"]?.enabled ? (
                <div className="flex items-center gap-1">
                  <Icons.Lock03 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
                  <span className="product-body-text-4-medium text-semantic-fg-secondary">
                    private
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <Icons.BookOpen02 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
                  <span className="product-body-text-4-medium text-semantic-fg-secondary">
                    public
                  </span>
                </div>
              )}
            </Tag>
          ) : null}
          {pipeline.tags.length > 0 ? <Tags tags={pipeline.tags} /> : null}
        </div>
        <p className="text-semantic-fg-secondary product-body-text-2-regular mb-2">
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
