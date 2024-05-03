"use client";

import { Icons, Tag } from "@instill-ai/design-system";

export type TagsProps = {
  isPrivate: boolean;
  region: string;
  hardware: string;
}

export const Tags = (props: TagsProps) => {
  const { isPrivate, region, hardware } = props;

  return (
    <div className="flex flex-row shrink-0 gap-x-2">
      {
        isPrivate ?
          <Tag variant="lightNeutral" size="sm" className="rounded-sm gap-x-1">
            <Icons.Lock03 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
            Private
          </Tag> :
          null
      }
      <Tag variant="lightNeutral" size="sm" className="rounded-sm gap-x-1">
        {region}
      </Tag>
      <Tag variant="lightNeutral" size="sm" className="rounded-sm gap-x-1">
        <Icons.Chip01 className="h-2.5 w-2.5 stroke-semantic-fg-secondary" />
        {hardware}
      </Tag>
    </div>
  );
}