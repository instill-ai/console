import { FC, ReactElement } from "react";
import cn from "clsx";

import { Nullable } from "@/types/general";
import {
  ImageClassificationIcon,
  ObjectDetectionIcon,
} from "@instill-ai/design-system";

export type ModelInstanceTaskLabelProps = {
  task: Nullable<string>;
  marginBottom: Nullable<string>;
  position: Nullable<string>;
};

const ModelInstanceTaskLabel: FC<ModelInstanceTaskLabelProps> = ({
  task,
  marginBottom,
  position,
}) => {
  const icon = {
    width: "w-[18px]",
    height: "h-[18px]",
    position: "my-auto",
    color: "fill-instillGrey95",
  };

  let modelInstanceTaskIcon: ReactElement;
  let modelInstanceTaskLabel: string;

  switch (task) {
    case "TASK_CLASSIFICATION":
      modelInstanceTaskIcon = <ImageClassificationIcon {...icon} />;
      modelInstanceTaskLabel = "Classification";
      break;

    case "TASK_DETECTION":
      modelInstanceTaskIcon = <ObjectDetectionIcon {...icon} />;
      modelInstanceTaskLabel = "Detection";
      break;

    default:
      modelInstanceTaskIcon = <div className={cn(icon.width, icon.height)} />;
      modelInstanceTaskLabel = "Task not found";
      break;
  }

  return (
    <div
      className={cn(
        "flex gap-x-2 bg-white px-2 py-[7px]",
        marginBottom,
        position
      )}
    >
      {modelInstanceTaskIcon}
      <p className="my-auto flex text-instillGrey90 text-instill-small">
        {modelInstanceTaskLabel}
      </p>
    </div>
  );
};

export default ModelInstanceTaskLabel;
