import cn from "clsx";
import { IconStyle, IconStyleWithoutColor } from "../types/general";
import {
  ArtiVcIcon,
  GitHubIcon,
  HuggingFaceIcon,
  LocalUploadIcon,
} from "../ui";

export const getModelDefinitionToolkit = (modelDefinition: string) => {
  switch (modelDefinition) {
    case "model-definitions/github": {
      return {
        getIcon: (iconStyle: IconStyle) => <GitHubIcon {...iconStyle} />,
        label: "GitHub",
      };
    }

    case "model-definitions/local": {
      return {
        getIcon: (iconStyle: IconStyle) => <LocalUploadIcon {...iconStyle} />,
        label: "Local",
      };
    }

    case "model-definitions/artivc": {
      return {
        getIcon: (iconStyle: IconStyleWithoutColor) => (
          <ArtiVcIcon {...iconStyle} />
        ),
        label: "ArtiVC",
      };
    }

    case "model-definitions/huggingface": {
      return {
        getIcon: (iconStyle: IconStyleWithoutColor) => (
          <HuggingFaceIcon {...iconStyle} />
        ),
        label: "Hugging Face",
      };
    }

    default: {
      return {
        getIcon: (iconStyle: IconStyle) => {
          return <div className={cn(iconStyle.width, iconStyle.height)} />;
        },
        label: "",
      };
    }
  }
};
