import cn from "clsx";
import { ModelInstanceIcon } from "@instill-ai/design-system";
import { Nullable } from "../../lib";

export type ModelCountsCellProps = {
  width: Nullable<string>;
  modelCount: number;
  padding: string;
};

export const ModelCountsCell = ({
  width,
  modelCount,
  padding,
}: ModelCountsCellProps) => {
  return (
    <td>
      <div className={cn("flex flex-col", width, padding)}>
        <div className="flex flex-row gap-x-2">
          <ModelInstanceIcon width="w-5" height="h-5" position="my-auto" />
          <p className="text-instillGrey90 text-instill-body my-auto">
            {modelCount}
          </p>
        </div>
      </div>
    </td>
  );
};
