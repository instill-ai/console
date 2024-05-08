"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { CopyButton } from "./CopyButton";
import { DownloadButton } from "./DownloadButton";
import { FieldRoot } from "./FieldRoot";
import { ShareButton } from "./ShareButton";

export type ImagesFieldProps = {
  images: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const ImagesField = (props: ImagesFieldProps) => {
  const { title, images, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {images && !hideField ? (
        <div className="nodrag nowheel flex flex-col rounded-sm border border-semantic-bg-line">
          <div className="flex flex-row rounded-t-[4px] border-b border-semantic-bg-line bg-[#F0F0F0] px-2 py-0.5">
            <div className="ml-auto flex flex-row gap-x-1">
              <DownloadButton className="my-auto" text={""} />
              <ShareButton className="my-auto" text={""} />
            </div>
          </div>
          <div>
            <div className="flex w-full flex-wrap gap-2">
              {images?.map((image) => {
                if (!image) return null;

                return (
                  <img
                    key={`${title}-${image}-field`}
                    alt={`${title}-images-{idx}`}
                    src={image}
                    className="object-contain"
                  />
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </FieldRoot>
  );
};
