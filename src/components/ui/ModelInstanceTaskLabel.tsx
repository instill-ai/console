import { ReactElement } from "react";
import cn from "clsx";

import { Nullable } from "@/types/general";
import {
  ImageClassificationIcon,
  InstanceSegmentationIcon,
  KeypointDetectionIcon,
  ObjectDetectionIcon,
  OpticalCharacterRecognitionIcon,
} from "@instill-ai/design-system";

export type ModelInstanceTaskLabelProps = {
  task: Nullable<string>;
  marginBottom: Nullable<string>;
  position: Nullable<string>;
};

const ModelInstanceTaskLabel = ({
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

  let modelInstanceTaskIcon: ReactElement;
  const taskNameList = task?.split("_");
  const taskName = taskNameList?.slice(1, taskNameList.length);

  switch (task) {
    case "TASK_CLASSIFICATION":
      modelInstanceTaskIcon = <ImageClassificationIcon {...iconStyle} />;
      break;

    case "TASK_DETECTION":
      modelInstanceTaskIcon = <ObjectDetectionIcon {...iconStyle} />;
      break;

    case "TASK_KEYPOINT":
      modelInstanceTaskIcon = <KeypointDetectionIcon {...iconStyle} />;
      break;

    case "TASK_OCR":
      modelInstanceTaskIcon = (
        <OpticalCharacterRecognitionIcon {...iconStyle} />
      );
      break;

    case "TASK_INSTANCE_SEGMENTATION":
      modelInstanceTaskIcon = <InstanceSegmentationIcon {...iconStyle} />;
      break;

    default:
      modelInstanceTaskIcon = (
        <div className={cn(iconStyle.width, iconStyle.height)} />
      );
      break;
  }

  return (
    <div
      className={cn(
        "flex gap-x-2 bg-white px-2 py-[7px]",
        marginBottom,
        position
      )}
      data-testid="model-task-label"
    >
      {modelInstanceTaskIcon}
      <p className="my-auto flex capitalize text-instillGrey90 text-instill-small">
        {taskName?.join(" ") || "Task not found"}
      </p>
    </div>
  );
};

export default ModelInstanceTaskLabel;
