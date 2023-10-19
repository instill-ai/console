import cn from "clsx";
import { ModelInstanceIcon } from "@instill-ai/design-system";
import { Nullable } from "../../lib";

export type PipelinesCellProps = {
  width: Nullable<string>;
  pipelineCount: number;
  padding: string;
};

export const PipelinesCell = ({
  width,
  pipelineCount,
  padding,
}: PipelinesCellProps) => {
  return (
    <td>
      <div className={cn("flex flex-col", width, padding)}>
        <div className="flex flex-row gap-x-2">
          <ModelInstanceIcon width="w-5" height="h-5" position="my-auto" />
          <p className="my-auto text-instillGrey90 text-instill-body">
            {pipelineCount}
          </p>
        </div>
      </div>
    </td>
  );
};
