import cn from "clsx";
import { ModelInstanceIcon } from "@instill-ai/design-system";
import type { Nullable, Model, PipelineComponent } from "../../lib";

export type ModelsCellProps = {
  models: PipelineComponent[] | Model[];
  width: Nullable<string>;
  padding: string;
};

export const ModelsCell = ({ width, models, padding }: ModelsCellProps) => {
  return (
    <td>
      <div className={cn("flex flex-col gap-y-4", width, padding)}>
        {models.map((model) => {
          let modelName: Nullable<string> = null;
          if ("resource_name" in model) {
            modelName = model.resource_name;
          } else {
            modelName = model.name;
          }

          return (
            <div key={model.id} className="flex flex-row gap-x-1">
              <ModelInstanceIcon
                width="w-[30px]"
                height="h-[30px]"
                color="fill-black"
                position="my-auto"
              />
              <p className="my-auto text-black text-instill-small">
                {modelName}
              </p>
            </div>
          );
        })}
      </div>
    </td>
  );
};
