"use client";

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
  const { label, getIcon } = getModelInstanceTaskToolkit(modelTask);

  return (
    <div
      className={cn("justify-left flex flex-row gap-x-2 py-2 pr-6", className)}
    >
      {getIcon("!w-5 !h-5")}
      <p className="text-product-body-text-3-regular my-auto flex text-semantic-bg-secondary-base-bg">
        {label}
      </p>
    </div>
  );
};
