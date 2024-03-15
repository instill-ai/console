"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import { MDTextViewer } from "./MDTextViewer";

export type TextsFieldProps = {
  texts: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const TextsField = (props: TextsFieldProps) => {
  const { title, texts, hideField } = props;
  const normalizedTexts = texts?.map((text) => String(text));

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {normalizedTexts && !hideField ? (
        <div className="flex w-full flex-col flex-wrap gap-2">
          {normalizedTexts.map((text) => (
            <MDTextViewer key={`${title}-${text}-field`} text={text} />
          ))}
        </div>
      ) : null}
    </FieldRoot>
  );
};
