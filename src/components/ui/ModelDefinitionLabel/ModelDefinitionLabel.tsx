import { FC } from "react";
import cn from "clsx";

import { Nullable } from "@/types/general";
import { GitHubIcon, LocalUploadIcon } from "@instill-ai/design-system";

export type ModelDefinitionLabelProps = {
  modelDefinition: Nullable<string>;
  marginBottom: Nullable<string>;
};

const ModelDefinitionLabel: FC<ModelDefinitionLabelProps> = ({
  modelDefinition,
  marginBottom,
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
    <div className={cn("flex gap-x-2 px-2 py-[7px]", marginBottom)}>
      {modelDefinition ? (
        <>
          {modelDefinitionIcon}
          <p className="instill-text-small flex text-instillGrey90">
            {modelDefinition === "model-definitions/github"
              ? "GitHub"
              : "Local"}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default ModelDefinitionLabel;
