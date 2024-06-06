"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { FieldRoot } from "./FieldRoot";
import { NoOutput } from "./NoOutput";

export type AudiosFieldProps = {
  audios: Nullable<string[]>;
} & ComponentOutputFieldBaseProps;

export const AudiosField = (props: AudiosFieldProps) => {
  const { title, audios, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        <div className="flex w-full flex-col">
          {audios && audios.length > 0 ? (
            audios.map((audio) => {
              return (
                <audio
                  key={`${title}-${audio}-field`}
                  className="w-full"
                  controls={true}
                  src={audio}
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
