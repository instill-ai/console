"use client";

import { Icons, Tag } from "@instill-ai/design-system";

import { Visibility } from "../../lib";

export type TagsProps = {
  region: string;
  hardware: string;
  visibilityStatus: Visibility | null;
};

export const Tags = (props: TagsProps) => {
  const { region, hardware, visibilityStatus } = props;

  return (
    <div className="flex shrink-0 flex-row gap-x-2 mb-2">
      {visibilityStatus ? (
        <Tag
          variant="lightNeutral"
          size="sm"
          className="gap-x-1.5 rounded-full !py-0.5"
        >
          {visibilityStatus === "VISIBILITY_PRIVATE" ? (
            <div className="flex items-center gap-1">
              <Icons.Lock03 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
              <span className="product-body-text-4-medium text-semantic-fg-secondary">
                Private
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <Icons.BookOpen02 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
              <span className="product-body-text-4-medium text-semantic-fg-secondary">
                Public
              </span>
            </div>
          )}
        </Tag>
      ) : null}
      <Tag
        variant="lightNeutral"
        size="sm"
        className="gap-x-1.5 rounded-full !py-0.5 product-body-text-3-medium text-semantic-fg-primary border border-semantic-bg-line"
      >
        {region}
      </Tag>
      <Tag
        variant="lightNeutral"
        size="sm"
        className="gap-x-1.5 rounded-full !py-0.5 product-body-text-3-medium text-semantic-fg-primary border border-semantic-bg-line"
      >
        <Icons.Chip01 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
        {hardware}
      </Tag>
    </div>
  );
};
