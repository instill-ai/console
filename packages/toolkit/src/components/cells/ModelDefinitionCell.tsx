import cn from "clsx";
import { getModelDefinitionToolkit } from "@instill-ai/design-system";
import { Nullable } from "../../lib";

export type ModelDefinitionCellProps = {
  width: Nullable<string>;
  modelDefinition: string;
  padding: string;
};

export const ModelDefinitionCell = ({
  modelDefinition,
  width,
  padding,
}: ModelDefinitionCellProps) => {
  const iconStyle = {
    width: "w-5",
    height: "h-5",
    position: "my-auto",
    color: "fill-instillGrey90",
  };

  const { label, getIcon } = getModelDefinitionToolkit(modelDefinition);

  return (
    <td>
      <div className={cn("flex flex-row gap-x-2", width, padding)}>
        {getIcon(iconStyle)}
        <p className="my-auto flex text-instillGrey90 text-instill-body">
          {label}
        </p>
      </div>
    </td>
  );
};
