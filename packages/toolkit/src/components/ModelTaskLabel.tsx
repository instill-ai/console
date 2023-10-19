import cn from "clsx";
import { getModelInstanceTaskToolkit } from "@instill-ai/design-system";
import { Nullable } from "../lib";

export type ModelTaskLabelProps = {
  task: Nullable<string>;
  /**
   * - Default is undefined
   */
  marginBottom?: string;
  /**
   * - Default is undefined
   */
  position?: string;
};

export const ModelTaskLabel = (props: ModelTaskLabelProps) => {
  const { task, marginBottom, position } = props;
  const iconStyle = {
    width: "w-[18px]",
    height: "h-[18px]",
    position: "my-auto",
    color: "fill-instillGrey95",
  };

  if (!task) {
    return (
      <div
        className={cn("flex gap-x-2 bg-white p-2", marginBottom, position)}
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
      className={cn("flex gap-x-2 bg-white p-2", marginBottom, position)}
      data-testid="model-task-label"
    >
      {toolkit.getIcon(iconStyle)}
      <p className="my-auto flex capitalize text-instillGrey90 text-instill-small">
        {toolkit.label}
      </p>
    </div>
  );
};
