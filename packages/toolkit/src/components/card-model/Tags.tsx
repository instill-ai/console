"use client";

import { Icons, Tag } from "@instill-ai/design-system";

import { Visibility } from "../../lib";

export type TagsProps = {
  region: string;
  hardware: string;
  visibilityStatus: Visibility | null;
};

export const Tags = (props: TagsProps) => {
  const { region, hardware } = props;

  return (
    <div className="flex shrink-0 flex-row gap-x-2">
      {/* INS-5438: We tempoarily hide the private option for better visibility */}
      {/* {visibilityStatus ? (
        <Tag
          variant="lightNeutral"
          size="md"
          className="gap-x-1.5 rounded-sm !py-0.5"
        >
          {visibilityStatus === "VISIBILITY_PRIVATE" ? (
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
      ) : null} */}
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
