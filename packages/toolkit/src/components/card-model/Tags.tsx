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
      <Tag
        variant="lightNeutral"
        size="md"
        className="gap-x-1.5 rounded-sm !py-0.5"
      >
        {isPrivate ? (
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
      <Tag
        variant="lightNeutral"
        size="md"
        className="gap-x-1.5 rounded-sm !py-0.5"
      >
        {region}
      </Tag>
      <Tag
        variant="lightNeutral"
        size="md"
        className="gap-x-1.5 rounded-sm !py-0.5"
      >
        <Icons.Chip01 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
        {hardware}
      </Tag>
    </div>
  );
};
