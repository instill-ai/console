"use client";

import { Position } from "reactflow";

import { Button, cn, Icons, Tooltip } from "@instill-ai/design-system";

import { ImageWithFallback, LoadingSpin } from "../../../../components";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { CustomHandle } from "./CustomHandle";

export type ComponentErrorState =
  | {
      error: true;
      message: string;
    }
  | {
      error: false;
    };

const selector = (store: InstillStore) => ({
  flowIsUnderDemoMode: store.flowIsUnderDemoMode,
});

export const NodeBase = ({
  id,
  isSelected,
  isProcessing,
  isCompleted,
  errorState,
  handleOpenDocumentation,
  handleClick,
  hasTargetEdges,
  hasSourceEdges,
  nodeDescription,
  definitionId,
  definitionTitle,
}: {
  id: string;
  isSelected: boolean;
  isProcessing: boolean;
  isCompleted: boolean;
  errorState: ComponentErrorState;
  handleOpenDocumentation: () => void;
  handleClick: () => void;
  hasTargetEdges: boolean;
  hasSourceEdges: boolean;
  nodeDescription?: string;
  definitionId?: string;
  definitionTitle?: string;
}) => {
  const { flowIsUnderDemoMode } = useInstillStore(useShallow(selector));
  return (
    <div className="relative nowheel">
      <div
        className={cn(
          "top-0 w-full flex absolute h-10 -translate-y-full duration-300 transition-opacity ease-in-out",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex flex-row mx-auto gap-x-2.5">
          <Button
            disabled={true}
            variant="tertiaryGrey"
            className="!px-2 opacity-0 pointer-events-none"
          >
            <Icons.Play className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
          <Button
            disabled={true}
            variant="tertiaryGrey"
            className="!px-2 opacity-0"
          >
            <Icons.Trash01 className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
          <Button
            disabled={!isSelected || flowIsUnderDemoMode}
            onClick={handleOpenDocumentation}
            variant="tertiaryGrey"
            className={cn("!px-2", flowIsUnderDemoMode ? "opacity-0" : "")}
          >
            <Icons.Logout04 className="w-4 h-4 stroke-semantic-fg-primary" />
          </Button>
        </div>
      </div>
      <div
        onClick={handleClick}
        className={cn(
          "flex relative items-center border-2 border-[#94a0b8] justify-center w-[160px] h-[160px] flex-col rounded p-3 bg-semantic-bg-base-bg",
          isCompleted ? "border-4 border-semantic-success-default" : "",
          errorState.error ? "border-4 border-semantic-error-default" : "",
        )}
      >
        {isProcessing ? (
          <div className="absolute right-2 bottom-2">
            <LoadingSpin className="w-6 h-6 text-semantic-fg-primary" />
          </div>
        ) : null}
        {errorState.error && (
          <Tooltip.Provider delayDuration={300}>
            <Tooltip.Root>
              <Tooltip.Trigger asChild>
                <Icons.AlertTriangle className="w-6 h-6 right-2 bottom-2 absolute stroke-semantic-error-default" />
              </Tooltip.Trigger>
              <Tooltip.Portal>
                <Tooltip.Content
                  className="w-[200px]"
                  sideOffset={5}
                  side="bottom"
                >
                  <div className="rounded-sm bg-semantic-bg-secondary-base-bg p-3">
                    <p className="product-body-text-4-medium text-semantic-bg-primary">
                      {errorState.message}
                    </p>
                  </div>
                  <Tooltip.Arrow
                    className="fill-semantic-bg-secondary-base-bg"
                    offset={5}
                    width={9}
                    height={6}
                  />
                </Tooltip.Content>
              </Tooltip.Portal>
            </Tooltip.Root>
          </Tooltip.Provider>
        )}
        <div className="flex flex-row items-center justify-center">
          <ImageWithFallback
            src={`/icons/${definitionId}.svg`}
            width={80}
            height={80}
            alt={`${definitionTitle}-icon`}
            fallbackImg={
              <Icons.Box className="my-auto h-20 w-20 stroke-semantic-fg-primary" />
            }
          />
        </div>
        <CustomHandle
          className={hasTargetEdges ? "" : "!opacity-0"}
          type="target"
          position={Position.Left}
          id={id}
        />
        <CustomHandle
          className={hasSourceEdges ? "" : "!opacity-0"}
          type="source"
          position={Position.Right}
          id={id}
        />
      </div>
      <div
        className={cn(
          "bottom-0 w-full flex flex-col absolute translate-y-full gap-y-2",
        )}
      >
        <div className="flex flex-col">
          <p className="product-body-text-4-medium w-full text-center text-semantic-fg-disabled">
            {id}
          </p>
        </div>

        {nodeDescription ? (
          <div
            className={cn(
              "bg-semantic-warning-bg shadow-xxs p-2 duration-300 transition-opacity ease-in-out",
              isSelected ? "opacity-100" : "opacity-0",
            )}
          >
            <p className="product-body-text-4-medium text-semantic-fg-disabled">
              {nodeDescription}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
};
