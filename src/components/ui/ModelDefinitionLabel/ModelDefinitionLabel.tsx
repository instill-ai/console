import { FC } from "react";
import cn from "clsx";

import { Nullable } from "@/types/general";
import { GitHubIcon, LocalUploadIcon } from "@instill-ai/design-system";

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
