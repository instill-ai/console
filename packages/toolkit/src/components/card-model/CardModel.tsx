"use client";

import { Menu } from "./Menu";
import { Tags } from "./Tags";
import { Stats } from "./Stats";
import { Model } from "../../lib";
import React, { useMemo } from "react";
import {
  getModelHardwareToolkit,
  getModelRegionToolkit,
} from "@instill-ai/design-system";
import { ImageWithFallback } from "..";
import Link from "next/link";

export type CardModelProps = {
  model: Model;
  onDelete?: (model: Model) => Promise<void>;
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

export const CardModel = (props: CardModelProps) => {
  const { model, onDelete } = props;
  const owner = useMemo(() => {
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
        src={model.profile_image}
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
          <Link
            href={`/${owner.id}/models/${model.id}/overview`}
            className="break-all font-medium text-semantic-accent-default hover:!underline"
          >
            {owner.id}/{model.id}
          </Link>
          <Tags
            isPrivate={model.visibility === "VISIBILITY_PRIVATE"}
            region={getModelRegionToolkit(model.region) || ""}
            hardware={getModelHardwareToolkit(model.hardware) || model.hardware}
          />
          {onDelete ? (
            <Menu handleDeleteModel={() => onDelete(model)} model={model} />
          ) : null}
        </div>
        <p className="text-semantic-fg-secondary">{model.description}</p>
        <Stats
          task={model.task}
          updatedAt={model.update_time || model.create_time}
        />
      </div>
    </div>
  );
};
