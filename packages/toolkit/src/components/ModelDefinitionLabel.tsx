"use client";

import cn from "clsx";
import { getModelDefinitionToolkit } from "@instill-ai/design-system";
import { Nullable } from "../lib";

export const ModelDefinitionLabel = ({
  modelDefinition,
  marginBottom,
  position,
}: {
  modelDefinition: Nullable<string>;
  position?: string;
  marginBottom?: string;
}) => {
  const iconStyle = {
    width: "w-[18px]",
    height: "h-[18px]",
    position: "my-auto",
    color: "fill-instillGrey95",
  };

  if (!modelDefinition) {
    return (
      <div
        className={cn("flex gap-x-2 bg-white p-2", marginBottom, position)}
        data-testid="model-definition-label"
      >
        <div className={cn(iconStyle.width, iconStyle.height)} />
        <p className="text-instillGrey90 text-instill-small my-auto flex">
          Unspecified
        </p>
      </div>
    );
  }

  const toolkit = getModelDefinitionToolkit(modelDefinition);

  return (
    <div
      className={cn("flex gap-x-2 bg-white p-2", marginBottom, position)}
      data-testid="model-definition-label"
    >
      {toolkit.getIcon(iconStyle)}
      <p className="text-instillGrey90 text-instill-small my-auto flex">
        {toolkit.label}
      </p>
    </div>
  );
};
