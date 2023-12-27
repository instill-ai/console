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
  const { label, getIcon } = getModelInstanceTaskToolkit(modelTask);

  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        {getIcon("!w-5 !h-5 my-auto !fill-semantic-fg-primary")}
        <p className="my-auto flex text-semantic-fg-primary product-body-text-4-regular">
          {label}
        </p>
      </div>
    </td>
  );
};
