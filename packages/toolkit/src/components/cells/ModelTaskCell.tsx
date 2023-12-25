import cn from "clsx";
import { getModelInstanceTaskToolkit } from "@instill-ai/design-system";
import { Nullable } from "../../lib";

export type ModelTaskCellProps = {
  width: Nullable<string>;
  modelTask: string;
  padding: string;
};

export const ModelTaskCell = ({
  modelTask,
  width,
  padding,
}: ModelTaskCellProps) => {
  const iconStyle = {
    width: "w-5",
    height: "h-5",
    position: "my-auto",
    color: "fill-instillGrey90",
  };

  const { label, getIcon } = getModelInstanceTaskToolkit(modelTask);

  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        {getIcon(iconStyle)}
        <p className="text-instillGrey90 text-instill-body my-auto flex">
          {label}
        </p>
      </div>
    </td>
  );
};
