import { ArtiVCIcon, GitHubIcon, LocalUploadIcon } from "@instill-ai/design-system";
import { FC } from "react";

export type ModelDefinitionIconProps = {
  iconName: string;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  iconColor: string;
};

const ModelDefinitionIcon: FC<ModelDefinitionIconProps> = ({
  iconName,
  iconColor,
  iconHeight,
  iconWidth,
  iconPosition,
}) => {
  switch (iconName) {
    case "local.svg": {
      return (
        <LocalUploadIcon
          width={iconWidth}
          height={iconHeight}
          color={iconColor}
          position={iconPosition}
        />
      );
    }
    case "github.svg": {
      return (
        <GitHubIcon
          width={iconWidth}
          height={iconHeight}
          color={iconColor}
          position={iconPosition}
        />
      );
    }
    case "artivc.svg": {
      return (
        <ArtiVCIcon
          width={iconWidth}
          height={iconHeight}
          color={iconColor}
          position={iconPosition}
        />
      );
    }

    default: {
      return <div>icon not found</div>;
    }
  }
};

export default ModelDefinitionIcon;
