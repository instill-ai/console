"use client";

import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { VideoPreview } from "../common";
import { FieldRoot } from "./FieldRoot";
import { NoOutput } from "./NoOutput";

export type VideoFieldProps = {
  video: Nullable<string>;
} & ComponentOutputFieldBaseProps;

export const VideoField = (props: VideoFieldProps) => {
  const { title, video, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {!hideField ? (
        video ? (
          <VideoPreview src={video} className="w-full" />
        ) : (
          <NoOutput />
        )
      ) : null}
    </FieldRoot>
  );
};
