import { ReactElement } from "react";
import cn from "clsx";

import { Nullable } from "@/types/general";
import {
  ImageClassificationIcon,
  InstanceSegmentationIcon,
  KeypointDetectionIcon,
  ObjectDetectionIcon,
  OpticalCharacterRecognitionIcon,
  SemanticSegmentationIcon,
  getModelInstanceTaskToolkit,
} from "@instill-ai/design-system";

export type ModelInstanceTaskLabelProps = {
  task: Nullable<string>;
  marginBottom: Nullable<string>;
  position: Nullable<string>;
};

export const ModelInstanceTaskLabel = ({
  task,
  marginBottom,
  position,
}: ModelInstanceTaskLabelProps) => {
  const iconStyle = {
    width: "w-[18px]",
    height: "h-[18px]",
    position: "my-auto",
    color: "fill-instillGrey95",
  };

  if (!task) {
    return (
      <div
        className={cn(
          "flex gap-x-2 bg-white px-2 py-[7px]",
          marginBottom,
          position
        )}
        data-testid="model-task-label"
      >
        <div className={cn(iconStyle.width, iconStyle.height)} />
        <p className="my-auto flex capitalize text-instillGrey90 text-instill-small">
          Unspecified
        </p>
      </div>
    );
  }

  const toolkit = getModelInstanceTaskToolkit(task);

  return (
    <div
      className={cn(
        "flex gap-x-2 bg-white px-2 py-[7px]",
        marginBottom,
        position
      )}
      data-testid="model-task-label"
    >
      {toolkit.getIcon(iconStyle)}
      <p className="my-auto flex capitalize text-instillGrey90 text-instill-small">
        {toolkit.label}
      </p>
    </div>
  );
};
