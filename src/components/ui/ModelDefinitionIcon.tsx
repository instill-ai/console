import {
  ArtiVcIcon,
  GitHubIcon,
  HuggingFaceIcon,
  LocalUploadIcon,
} from "@instill-ai/design-system";
import cn from "clsx";

export type ModelDefinitionIconProps = {
  iconName: string;
  iconWidth: string;
  iconHeight: string;
  iconPosition: string;
  iconColor: string;
};

export const ModelDefinitionIcon = ({
  iconName,
  iconColor,
  iconHeight,
  iconWidth,
  iconPosition,
}: ModelDefinitionIconProps) => {
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
        <ArtiVcIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
    }
    case "huggingface.svg": {
      return (
        <HuggingFaceIcon
          width={iconWidth}
          height={iconHeight}
          position={iconPosition}
        />
      );
    }

    default: {
      return <div className={cn(iconWidth, iconHeight)} />;
    }
  }
};
