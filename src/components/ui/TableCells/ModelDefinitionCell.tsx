import { FC, ReactElement } from "react";
import cn from "clsx";
import { CellBaseProps, CellBase } from "./CellBase";
import {
  ArtiVcIcon,
  GitHubIcon,
  HuggingFaceIcon,
  LocalUploadIcon,
} from "@instill-ai/design-system";

export type ModelDefinitionCellProps = {
  width: string;
  modelDefinition: string;
} & CellBaseProps;

export const ModelDefinitionCell: FC<ModelDefinitionCellProps> = ({
  padding,
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
        />
      );
      break;
    }
    case "model-definitions/huggingface": {
      definitionLabel = "Hugging Face";
      definitionIcon = (
        <HuggingFaceIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
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
    <CellBase padding={padding}>
      <div className={cn("flex flex-row gap-x-[5px]", width)}>
        {definitionIcon}
        <p className="my-auto flex text-instillGrey90 text-instill-body">
          {definitionLabel}
        </p>
      </div>
    </CellBase>
  );
};
