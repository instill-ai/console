"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import AudioPlayer from "./AudioPlayer";
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
          <div className="flex h-[150px] items-center">
            <div className="w-full">
              <AudioPlayer
                key={1}
                currentSong={audio}
                songCount={1}
                songIndex={1}
              />
            </div>
          </div>
        </div>
      ) : null}
    </FieldRoot>
  );
};
