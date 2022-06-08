import { FC, ReactElement } from "react";
import cn from "clsx";
import CellBase, { CellBaseProps } from "../CellBase";
import { GitHubIcon, LocalUploadIcon } from "@instill-ai/design-system";

export type ModelDefintionCellProps = {
  width: string;
  modelDefinition: string;
} & CellBaseProps;

const ModelDefintionCell: FC<ModelDefintionCellProps> = ({
  paddingBottom,
  paddingLeft,
  paddingRight,
  paddingTop,
  modelDefinition,
  width,
}) => {
  const iconWidth = "w-5";
  const iconHeight = "h-5";
  const iconPosition = "my-auto";
  const iconColor = "fill-instillGrey90";

  let definitionIcon: ReactElement;

  switch (modelDefinition) {
    case "model-definitions/local": {
      definitionIcon = (
        <LocalUploadIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
          color={iconColor}
        />
      );
      break;
    }
    case "model-definitions/github": {
      definitionIcon = (
        <GitHubIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
          color={iconColor}
        />
      );
      break;
    }
    default: {
      definitionIcon = <div className={cn(iconWidth, iconHeight)} />;
      break;
    }
  }

  return (
    <CellBase
      paddingTop={paddingTop}
      paddingLeft={paddingLeft}
      paddingRight={paddingRight}
      paddingBottom={paddingBottom}
    >
      <div className={cn("flex flex-row gap-x-2", width)}>
        {definitionIcon}
        <p className="instill-text-body my-auto flex text-instillGrey90">
          {modelDefinition === "model-definitions/local" ? "Local" : "GitHub"}
        </p>
      </div>
    </CellBase>
  );
};

export default ModelDefintionCell;
