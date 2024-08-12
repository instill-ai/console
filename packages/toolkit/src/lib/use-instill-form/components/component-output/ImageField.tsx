"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import { NoOutput } from "./NoOutput";

export type ImageFieldProps = {
  image: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const ImageField = (props: ImageFieldProps) => {
  const { title, image, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        image ? (
          <div className="flex w-full justify-center">
            <img
              src={image}
              alt={`${title}`}
              className="object-contain max-h-[360px]"
            />
          </div>
        ) : (
          <NoOutput />
        )
      ) : null}
    </FieldRoot>
  );
};
