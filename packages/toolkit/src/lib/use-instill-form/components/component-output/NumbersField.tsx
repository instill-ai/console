"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";

export type NumbersFieldProps = {
  numbers: Nullable<number>[];
} & ComponentOutputFieldBaseProps;

export const NumbersField = (props: NumbersFieldProps) => {
  const { title, numbers, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {numbers && !hideField ? (
        <div className="flex w-full flex-row flex-wrap gap-2">
          {numbers.map((number) => (
            <div
              key={`${title}-${number}-field`}
              className="min-h-[20px] w-full items-center break-all rounded-sm text-semantic-fg-primary product-body-text-4-regular"
            >
              {number}
            </div>
          ))}
        </div>
      ) : null}
    </FieldRoot>
  );
};
