import { FC, ReactElement } from "react";
import cn from "clsx";
import CellBase, { CellBaseProps } from "../CellBase";
import {
  ArtiVcIcon,
  GitHubIcon,
  LocalUploadIcon,
} from "@instill-ai/design-system";

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
  let definitionLabel: string;

  switch (modelDefinition) {
    case "model-definitions/local": {
      definitionLabel = "Local";
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
      definitionLabel = "GitHub";
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
    case "model-definitions/artivc": {
      definitionLabel = "ArtiVC";
      definitionIcon = (
        <ArtiVcIcon
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
      definitionLabel = modelDefinition.split("/")[1];
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
        <p className="my-auto flex text-instillGrey90 text-instill-body">
          {definitionLabel}
        </p>
      </div>
    </CellBase>
  );
};

export default ModelDefintionCell;
