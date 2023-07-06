import {
  ConnectorWithWatchState,
  IncompleteConnectorWithWatchState,
} from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { Icons, getModelInstanceTaskToolkit } from "@instill-ai/design-system";
import { ImageWithFallback, Nullable } from "@instill-ai/toolkit";
import { ReactElement } from "react";

const Item = (props: {
  resource: ConnectorWithWatchState | IncompleteConnectorWithWatchState;
}) => {
  const { resource } = props;

  let fallbackImg: Nullable<ReactElement> = null;

  switch (resource.connector_type) {
    case "CONNECTOR_TYPE_AI":
      fallbackImg = (
        <Icons.Model className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;
    case "CONNECTOR_TYPE_BLOCKCHAIN":
      fallbackImg = (
        <Icons.CubeOutline className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;
    case "CONNECTOR_TYPE_DESTINATION":
      fallbackImg = (
        <Icons.Box className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;
    case "CONNECTOR_TYPE_SOURCE":
      fallbackImg = (
        <Icons.Database01 className="h-4 w-4 stroke-semantic-fg-primary" />
      );
      break;

    default:
      break;
  }

  if (resource.connector_type === "CONNECTOR_TYPE_AI") {
    let taskLabel: Nullable<string> = null;

    if ("task" in resource) {
      const { label } = getModelInstanceTaskToolkit(resource.task);
      taskLabel = label === "" ? null : label;
    }

    return (
      <div className="flex w-full cursor-grab flex-col space-y-4 rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg">
        <div className="flex h-8 w-full flex-row">
          <div className="flex flex-row">
            <div className="flex h-8 w-8 items-center justify-center">
              <ImageWithFallback
                src={`/icons/${resource.connector_definition.vendor}/${resource.connector_definition.icon}`}
                width={24}
                height={24}
                alt={`${resource.connector_definition.title}-icon`}
                fallbackImg={
                  <Icons.Model className="h-4 w-4 stroke-semantic-fg-primary" />
                }
              />
            </div>
            <h5 className="my-auto w-[160px] truncate text-semantic-fg-primary product-headings-heading-5">
              {resource.id}
            </h5>
          </div>
        </div>
        <div className="flex">
          <p className="rounded-full bg-semantic-accent-bg px-2 py-0.5 pl-2 text-semantic-accent-on-bg product-label-label-1">
            {taskLabel ? taskLabel : "unspecified"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full cursor-grab rounded border border-semantic-bg-line p-2 hover:bg-semantic-accent-bg">
      <div className="flex h-8 w-full flex-row">
        <div className="flex flex-row">
          <div className="flex h-8 w-8 items-center justify-center">
            <ImageWithFallback
              src={`/icons/${resource.connector_definition.vendor}/${resource.connector_definition.icon}`}
              width={24}
              height={24}
              alt={`${resource.connector_definition.title}-icon`}
              fallbackImg={
                fallbackImg ?? (
                  <Icons.Cube01 className="h-4 w-4 stroke-semantic-fg-primary" />
                )
              }
            />
          </div>
          <h5 className="my-auto w-[160px] truncate text-semantic-fg-primary product-headings-heading-5">
            {resource.name.split("/")[1]}
          </h5>
        </div>
      </div>
    </div>
  );
};

const Root = (props: {
  id: string;
  children: ReactElement;
  isPreset: boolean;
}) => {
  const { id, children, isPreset } = props;
  const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
    id,
    data: {
      isPreset,
    },
  });

  return (
    <div
      className={isDragging ? "opacity-40" : ""}
      ref={setNodeRef}
      {...attributes}
      {...listeners}
    >
      {children}
    </div>
  );
};

export const Draggable = {
  Root,
  Item,
};
