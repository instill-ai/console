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
          size="md"
          className="gap-x-1.5 rounded-sm !py-0.5"
        >
          {title}
        </Tag>
      ))}
    </div>
  );
};
