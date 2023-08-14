import cn from "clsx";
import React, { Dispatch, ReactElement, SetStateAction } from "react";
import { Checkbox, ComplicateIcons, Icons } from "@instill-ai/design-system";
import { Nullable } from "@instill-ai/toolkit";

export type StartOperatorInputTypes =
  | "text"
  | "image"
  | "number"
  | "audio"
  | "boolean";

export type StartNodeInputTypeProps = {
  type: StartOperatorInputTypes;
  selectedType: Nullable<StartOperatorInputTypes>;
  setSelectedType: Dispatch<SetStateAction<Nullable<StartOperatorInputTypes>>>;
};

export const StartNodeInputType = ({
  type,
  selectedType,
  setSelectedType,
}: StartNodeInputTypeProps) => {
  let icon: Nullable<ReactElement> = null;
  let label: Nullable<string> = null;

  switch (type) {
    case "text": {
      icon = (
        <Icons.Type02 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
      );
      label = "Text";
      break;
    }
    case "audio": {
      icon = (
        <Icons.Recording02 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
      );
      label = "Audio";
      break;
    }
    case "boolean": {
      icon = (
        <ComplicateIcons.ToggleLeft
          fillAreaColor="fill-semantic-fg-primary"
          className="m-auto h-4 w-4"
        />
      );
      label = "Boolean";
      break;
    }
    case "image": {
      icon = (
        <Icons.Image01 className="m-auto h-4 w-4 stroke-semantic-fg-primary" />
      );
      label = "Image";
      break;
    }
    case "number": {
      icon = (
        <ComplicateIcons.Number
          fillAreaColor="fill-semantic-fg-primary"
          className="m-auto h-4 w-4"
        />
      );
      label = "Number";
      break;
    }
    default:
      break;
  }

  return (
    <div
      onClick={() => {
        if (type === selectedType) {
          setSelectedType(null);
        } else {
          setSelectedType(type);
        }
      }}
      className="group flex w-[151px] flex-row gap-x-2 rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 hover:border-semantic-accent-default"
    >
      <Checkbox
        checked={type === selectedType}
        onClick={() => {
          if (type === selectedType) {
            setSelectedType(null);
          } else {
            setSelectedType(type);
          }
        }}
        className={cn("my-auto flex h-4 w-4 rounded-full", {
          "border-semantic-accent-hover group-hover:bg-semantic-accent-bg":
            type !== selectedType,
        })}
        checkedElement={
          <div className="m-auto h-2 w-2 shrink-0 rounded-full bg-semantic-bg-primary data-[disabled]:bg-semantic-fg-disabled" />
        }
      />
      <div className="my-auto flex h-6 w-6 shrink-0">{icon}</div>
      <span className="my-auto inline-block flex-1 align-middle product-body-text-4-semibold">
        {label}
      </span>
    </div>
  );
};
