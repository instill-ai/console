"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { DownloadButton } from "./DownloadButton";
import { FieldRoot } from "./FieldRoot";
import { ShareButton } from "./ShareButton";

export type ImageFieldProps = {
  image: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const ImageField = (props: ImageFieldProps) => {
  const { title, image, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField && image ? (
        <div className="nodrag nowheel flex flex-col rounded-sm border border-semantic-bg-line">
          <div className="flex flex-row rounded-t-[4px] border-b border-semantic-bg-line bg-[#F0F0F0] px-2 py-0.5">
            <div className="ml-auto flex flex-row gap-x-1">
              <DownloadButton className="my-auto" text={""} />
            </div>
          </div>
          <div>
            <div className="flex w-full flex-wrap gap-2">
              <img src={image} alt={`${title}`} className="object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </FieldRoot>
  );
};
