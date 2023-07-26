import cn from "clsx";
import { getModelInstanceTaskToolkit } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";

export type GeneralTaskCellProps = {
  className: Nullable<string>;
  modelTask: string;
};

export const GeneralTaskCell = ({ modelTask, className }: GeneralTaskCellProps) => {
  const iconStyle = {
    width: "w-5",
    height: "h-5",
    position: "my-auto",
    color: "fill-instillGrey90",
  };

  const { label, getIcon } = getModelInstanceTaskToolkit(modelTask);

  return (
    <div
      className={cn(
        "flex flex-row justify-center gap-x-2 py-2 pr-6",
        className
      )}
    >
      {getIcon(iconStyle)}
      <p className="my-auto flex text-instillGrey90 text-instill-body">
        {label}
      </p>
    </div>
  );
};
