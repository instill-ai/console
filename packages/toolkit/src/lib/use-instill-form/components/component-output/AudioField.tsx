"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { DownloadButton } from "./DownloadButton";
import { FieldRoot } from "./FieldRoot";

export type AudioFieldProps = {
  audio: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const AudioField = (props: AudioFieldProps) => {
  const { title, audio, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {audio && !hideField ? (
        <div className="rounded border">
          <div className="flex w-full flex-row rounded-t-[4px] border-b border-semantic-bg-line bg-[#F0F0F0] px-2 py-0.5">
            <div className="ml-auto flex flex-row gap-x-1">
              <DownloadButton className="my-auto" text={audio ?? ""} />
            </div>
          </div>
          <div className="flex h-[150px] w-full items-center">
            <audio className="w-full" controls={true} src={audio} />
          </div>
        </div>
      ) : null}
    </FieldRoot>
  );
};
