import { GitHubIcon, LocalUploadIcon } from "@instill-ai/design-system";
import { FC } from "react";

export type ModelDefinitionLabelProps = { modelDefinition: string };

const ModelDefinitionLabel: FC<ModelDefinitionLabelProps> = ({
  modelDefinition,
}) => {
  const icon = {
    width: "w-[18px]",
    height: "h-[18px]",
    position: "my-auto",
    color: "fill-instillGrey95",
  };

  const modelDefinitionIcon =
    modelDefinition === "model-definitions/github" ? (
      <GitHubIcon
        width={icon.width}
        height={icon.height}
        position={icon.position}
        color={icon.color}
      />
    ) : (
      <LocalUploadIcon
        width={icon.width}
        height={icon.height}
        position={icon.position}
        color={icon.color}
      />
    );

  return (
    <div className="flex gap-x-2 px-2 py-[7px]">
      {modelDefinitionIcon}
      <p className="instill-text-small flex text-instillGrey90">
        {modelDefinition === "model-definitions/github" ? "GitHub" : "Local"}
      </p>
    </div>
  );
};

export default ModelDefinitionLabel;
