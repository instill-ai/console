"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import { NoOutput } from "./NoOutput";

export type ImagesFieldProps = {
  images: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const ImagesField = (props: ImagesFieldProps) => {
  const { title, images, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        <div className="flex w-full flex-wrap gap-2">
          {images && images.length > 0 ? (
            images?.map((image) => {
              if (!image) return null;

              return (
                <img
                  key={`${title}-${image}-field`}
                  alt={`${title}-images-{idx}`}
                  src={image}
                  className="object-contain"
                />
              );
            })
          ) : (
            <NoOutput />
          )}
        </div>
      ) : null}
    </FieldRoot>
  );
};
