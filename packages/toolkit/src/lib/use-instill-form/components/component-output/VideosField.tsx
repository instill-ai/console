import { Nullable } from "../../../type";
import { ComponentOutputFieldBaseProps } from "../../types";
import { VideoPreview } from "../common";
import { FieldRoot } from "./FieldRoot";

export type VideosFieldProps = {
  videos: Nullable<string>[];
} & ComponentOutputFieldBaseProps;

export const VideosField = (props: VideosFieldProps) => {
  const { title, videos, hideField } = props;

  return (
    <FieldRoot title={title} fieldKey={`${title}-field`}>
      {videos && !hideField ? (
        <div className="flex w-full flex-wrap gap-2">
          {videos.map((video) => {
            if (!video) return null;

            return (
              <VideoPreview
                key={`${title}-${video}-field`}
                src={video}
                className="object-contain"
              />
            );
          })}
        </div>
      ) : null}
    </FieldRoot>
  );
};
