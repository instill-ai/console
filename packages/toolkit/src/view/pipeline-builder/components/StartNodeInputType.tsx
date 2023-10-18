import cn from "clsx";
import * as React from "react";
import { ComplicateIcons, Icons } from "@instill-ai/design-system";
import { Nullable, StartOperatorInputSingularType } from "../../../lib";

export type StartNodeInputTypeProps = {
  type: StartOperatorInputSingularType;
  selectedType: Nullable<StartOperatorInputSingularType>;
  onSelect: () => void;
};

export const StartNodeInputType = ({
  type,
  selectedType,
  onSelect,
}: StartNodeInputTypeProps) => {
  let icon: Nullable<React.ReactElement> = null;
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
        // We can't use checkbox because of this issue
        // https://github.com/radix-ui/primitives/issues/2291
        onSelect();
      }}
      className="group cursor-pointer flex w-[151px] flex-row gap-x-2 rounded-sm border border-semantic-bg-line bg-semantic-bg-primary px-4 py-3 hover:border-semantic-accent-default"
    >
      <div
        className={cn(
          "my-auto flex h-4 w-4 items-center justify-center rounded-full border text-current",
          type === selectedType
            ? "border-semantic-accent-default bg-semantic-accent-default"
            : "border-semantic-fg-primary group-hover:border-semantic-accent-hover group-hover:bg-semantic-accent-bg"
        )}
      >
        {type === selectedType ? (
          <div className="m-auto h-2 w-2 shrink-0 rounded-full bg-semantic-bg-primary" />
        ) : null}
      </div>
      <div className="my-auto flex h-6 w-6 shrink-0">{icon}</div>
      <span className="my-auto inline-block flex-1 align-middle product-body-text-4-semibold">
        {label}
      </span>
    </div>
  );
};
