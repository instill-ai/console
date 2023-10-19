import cn from "clsx";
import { Nullable } from "../../lib";
import { getModelInstanceTaskToolkit } from "@instill-ai/design-system";

export type GeneralTaskCellProps = {
  className: Nullable<string>;
  modelTask: string;
};

export const GeneralTaskCell = ({
  modelTask,
  className,
}: GeneralTaskCellProps) => {
  const iconStyle = {
    width: "w-5",
    height: "h-5",
    position: "my-auto",
    color: "fill-semantic-bg-secondary-base-bg",
  };

  const { label, getIcon } = getModelInstanceTaskToolkit(modelTask);

  return (
    <div
      className={cn("flex flex-row justify-left gap-x-2 py-2 pr-6", className)}
    >
      {getIcon(iconStyle)}
      <p className="text-product-body-text-3-regular my-auto flex text-semantic-bg-secondary-base-bg">
        {label}
      </p>
    </div>
  );
};
