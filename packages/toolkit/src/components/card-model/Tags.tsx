"use client";

import { Icons, Tag } from "@instill-ai/design-system";
import React from "react";

export type TagsProps = {
  isPrivate: boolean;
  region: string;
  hardware: string;
};

export const Tags = (props: TagsProps) => {
  const { isPrivate, region, hardware } = props;

  return (
    <div className="flex shrink-0 flex-row gap-x-2">
      <Tag variant="lightNeutral" size="sm" className="gap-x-1 rounded-sm">
        {isPrivate ? (
          <React.Fragment>
            <Icons.Lock03 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
            Private
          </React.Fragment>
        ) : (
          "Public"
        )}
      </Tag>
      <Tag variant="lightNeutral" size="sm" className="gap-x-1 rounded-sm">
        {region}
      </Tag>
      <Tag variant="lightNeutral" size="sm" className="gap-x-1 rounded-sm">
        <Icons.Chip01 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
        {hardware}
      </Tag>
    </div>
  );
};
