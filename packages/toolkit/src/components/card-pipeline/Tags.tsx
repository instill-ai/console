"use client";

import { Tag } from "@instill-ai/design-system";

export type TagsProps = {
  tags: string[];
};

export const Tags = (props: TagsProps) => {
  return (
    <div className="flex shrink-0 flex-row gap-x-2">
      {props.tags.map((title, index) => (
        <Tag
          key={index}
          variant="lightNeutral"
          size="sm"
          className="gap-x-1.5 !py-0.5 rounded-full product-body-text-4-medium text-semantic-fg-secondary lowercase"
        >
          {title}
        </Tag>
      ))}
    </div>
  );
};
