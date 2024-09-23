"use client";

import * as React from "react";
import { Position } from "reactflow";

import { Button, cn, Icons, Tooltip } from "@instill-ai/design-system";

import { ImageWithFallback, LoadingSpin } from "../../../../components";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { EditorButtonTooltipWrapper } from "../../EditorButtonTooltipWrapper";
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
  handleOpenComponentOutput,
  handleClick,
  hasTargetEdges,
  hasSourceEdges,
  nodeDescription,
  definitionId,
  definitionTitle,
  disabledOpenDocumentationButton,
  disabledOpenComponentOutputButton,
  additionalControlButton,
  children,
}: {
  id: string;
  isSelected: boolean;
  isProcessing?: boolean;
  isCompleted?: boolean;
  errorState?: ComponentErrorState;
  handleOpenDocumentation: () => void;
  disabledOpenDocumentationButton?: boolean;
  handleOpenComponentOutput: () => void;
  disabledOpenComponentOutputButton?: boolean;
  additionalControlButton?: React.ReactNode;
  handleClick: () => void;
  hasTargetEdges: boolean;
  hasSourceEdges: boolean;
  nodeDescription?: string;
  definitionId?: string;
  definitionTitle?: string;
  children?: React.ReactNode;
}) => {
  const { flowIsUnderDemoMode } = useInstillStore(useShallow(selector));

  const isDisabledOpenDocumentationButton = React.useMemo(() => {
    return disabledOpenDocumentationButton ? true : flowIsUnderDemoMode;
  }, [disabledOpenDocumentationButton, flowIsUnderDemoMode]);

  const isDisabledOpenComponentOutputButton = React.useMemo(() => {
    return disabledOpenComponentOutputButton ? true : flowIsUnderDemoMode;
  }, [disabledOpenComponentOutputButton, flowIsUnderDemoMode]);

  return (
    <div className="relative nowheel">
      <div
        className={cn(
          "top-0 w-full flex absolute h-10 -translate-y-full duration-300 transition-opacity ease-in-out",
          isSelected ? "opacity-100" : "opacity-0",
        )}
      >
        <div className="flex flex-row-reverse mx-auto w-full gap-x-2.5 px-2">
          {isDisabledOpenComponentOutputButton ? null : (
            <EditorButtonTooltipWrapper tooltipContent="View component output">
              <Button
                disabled={isDisabledOpenComponentOutputButton}
                variant="tertiaryGrey"
                onClick={handleOpenComponentOutput}
                className={cn("!px-2", isSelected ? "" : "opacity-0")}
              >
                <Icons.Logout04 className="w-4 h-4 stroke-semantic-fg-primary" />
              </Button>
            </EditorButtonTooltipWrapper>
          )}

          {isDisabledOpenDocumentationButton ? null : (
            <EditorButtonTooltipWrapper tooltipContent="Open documentation">
              <Button
                onClick={handleOpenDocumentation}
                variant="tertiaryGrey"
                className={cn("!px-2", isSelected ? "" : "opacity-0")}
              >
                <Icons.File05 className="w-4 h-4 stroke-semantic-fg-primary" />
              </Button>
            </EditorButtonTooltipWrapper>
          )}
          {additionalControlButton}
        </div>
      </div>
      <div
        onClick={handleClick}
        className={cn(
          "flex relative items-center border-2 border-[#94a0b8] justify-center w-[160px] h-[160px] flex-col rounded-md p-3 bg-semantic-bg-base-bg",
          isCompleted ? "border-4 border-semantic-success-default" : "",
          errorState?.error ? "border-4 border-semantic-error-default" : "",
        )}
      >
        {isProcessing ? (
          <div className="absolute right-2 bottom-2">
            <LoadingSpin className="w-6 h-6 text-semantic-fg-primary" />
          </div>
        ) : null}
        {errorState?.error && (
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
          <p className="product-body-text-1-semibold w-full text-center text-semantic-fg-disabled">
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
      {children}
    </div>
  );
};
