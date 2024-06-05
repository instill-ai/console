"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import { NoOutput } from "./NoOutput";

export type AudioFieldProps = {
  audio: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const AudioField = (props: AudioFieldProps) => {
  const { title, audio, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        audio ? (
          <div className="flex w-full">
            <audio className="w-full" controls={true} src={audio} />
          </div>
        ) : (
          <NoOutput />
        )
      ) : null}
    </FieldRoot>
  );
};
