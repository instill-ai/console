import { FC, ReactElement } from "react";
import cn from "clsx";

import { Nullable } from "@/types/general";
import {
  ArtiVcIcon,
  GitHubIcon,
  LocalUploadIcon,
} from "@instill-ai/design-system";

export type ModelDefinitionLabelProps = {
  modelDefinition: Nullable<string>;
  marginBottom: Nullable<string>;
  position: Nullable<string>;
};

const ModelDefinitionLabel: FC<ModelDefinitionLabelProps> = ({
  modelDefinition,
  marginBottom,
  position,
}) => {
  const icon = {
    width: "w-[18px]",
    height: "h-[18px]",
    position: "my-auto",
    color: "fill-instillGrey95",
  };

  let modelDefinitionIcon: Nullable<ReactElement>;
  let modelDefinitionLabel: Nullable<string>;

  switch (modelDefinition) {
    case "model-definitions/github": {
      modelDefinitionIcon = (
        <GitHubIcon
          width={icon.width}
          height={icon.height}
          position={icon.position}
          color={icon.color}
        />
      );
      modelDefinitionLabel = "GitHub";
      break;
    }

    case "model-definitions/local": {
      modelDefinitionIcon = (
        <LocalUploadIcon
          width={icon.width}
          height={icon.height}
          position={icon.position}
          color={icon.color}
        />
      );
      modelDefinitionLabel = "Local";
      break;
    }

    case "model-definitions/artivc": {
      modelDefinitionIcon = (
        <ArtiVcIcon
          width={icon.width}
          height={icon.height}
          position={icon.position}
          color={icon.color}
        />
      );
      modelDefinitionLabel = "ArtiVC";
      break;
    }

    default: {
      modelDefinitionIcon = null;
      modelDefinitionLabel = modelDefinition?.split("/")[1] || null;
    }
  }

  return (
    <div
      className={cn(
        "flex gap-x-2 bg-white px-2 py-[7px]",
        marginBottom,
        position
      )}
    >
      {modelDefinition ? (
        <>
          {modelDefinitionIcon}
          <p className="my-auto flex text-instillGrey90 text-instill-small">
            {modelDefinitionLabel}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default ModelDefinitionLabel;
