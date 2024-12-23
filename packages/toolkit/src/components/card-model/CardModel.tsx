"use client";

import type { Model } from "instill-sdk";
import * as React from "react";
import Link from "next/link";

import { getModelRegionToolkit } from "@instill-ai/design-system";

import { ImageWithFallback } from "..";
import {
  InstillStore,
  useInstillStore,
  useModelAvailableRegions,
  useShallow,
} from "../../lib";
import { Menu } from "./Menu";
import { Stats } from "./Stats";
import { Tags } from "./Tags";

export type CardModelProps = {
  model: Model;
  onDelete?: (model: Model) => Promise<void>;
  hidePublicLabel?: boolean;
};

const modelCoverImageCommonProps = {
  alt: "Cover",
  className: "shrink-0 rounded",
  width: 156,
  height: 156,
};

const OWNER = {
  id: null,
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const CardModel = (props: CardModelProps) => {
  const { model, onDelete } = props;

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const modelRegions = useModelAvailableRegions({ accessToken, enabledQuery });

  const targetHardware = React.useMemo(() => {
    if (!modelRegions.isSuccess || !model) {
      return null;
    }

    const targetRegion = modelRegions.data.find(
      (region) => region.regionName === model.region,
    );

    const targetHardware = targetRegion?.hardware.find(
      (hardware) => hardware.value === model.hardware,
    );

    return targetHardware ?? null;
  }, [modelRegions.data, modelRegions.isSuccess, model]);

  const owner = React.useMemo(() => {
    if (!model) {
      return OWNER;
    }

    const owner = model.owner?.user || model.owner?.organization;

    if (!owner || !owner.profile) {
      return OWNER;
    }

    return {
      id: owner.id || "",
    };
  }, [model]);

  return (
    <div className="flex flex-row gap-x-6 rounded-md border border-semantic-bg-line bg-white p-4">
      <ImageWithFallback
        src={model.profileImage}
        fallbackImg={
          <img
            src="/images/models/model-placeholder.svg"
            {...modelCoverImageCommonProps}
            alt="Model Cover Fallback"
          />
        }
        {...modelCoverImageCommonProps}
      />
      <div className="flex grow flex-col">
        <div className="flex w-full flex-row items-start">
          <Link
            href={`/${owner.id}/models/${model.id}/playground`}
            className="break-all product-body-text-1-semibold text-semantic-accent-default hover:!underline"
          >
            {owner.id}/{model.id}
          </Link>
          {onDelete ? (
            <Menu handleDeleteModel={() => onDelete(model)} model={model} />
          ) : null}
        </div>
        <Tags
          visibilityStatus={
            props.hidePublicLabel && model.visibility === "VISIBILITY_PUBLIC"
              ? null
              : model.visibility
          }
          region={getModelRegionToolkit(model.region) || ""}
          hardware={targetHardware?.title ?? model.hardware}
        />
        <p className="product-body-text-2-regular text-semantic-fg-secondary">
          {model.description}
        </p>
        <Stats
          task={model.task}
          updatedAt={model.updateTime || model.createTime}
          runCount={model.stats.numberOfRuns}
        />
      </div>
    </div>
  );
};
