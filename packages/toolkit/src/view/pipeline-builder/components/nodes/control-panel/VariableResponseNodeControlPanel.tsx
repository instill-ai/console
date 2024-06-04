"use client";

import * as React from "react";
import cn from "clsx";
import { Icons, Tooltip } from "@instill-ai/design-system";
import { ControlPanel } from "./ControlPanel";
import { useInstillStore } from "../../../../../lib";
import { NodeDropdownMenu } from "../common";

export function VariableResponseNodeControlPanel({
  type,
  nodeIsCollapsed,
  setNodeIsCollapsed,
  handleToggleNote,
  noteIsOpen,
  disabledReferenceHint,
  setDisabledReferenceHint,
}: {
  type: "variable" | "response";
  nodeIsCollapsed: boolean;
  setNodeIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  handleToggleNote: () => void;
  noteIsOpen: boolean;
  disabledReferenceHint?: boolean;
  setDisabledReferenceHint?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [moreOptionsIsOpen, setMoreOptionsIsOpen] = React.useState(false);
  const pipelineIsReadOnly = useInstillStore(
    (store) => store.pipelineIsReadOnly
  );

  return (
    <ControlPanel.Root>
      <ControlPanel.Toggle
        isCollapsed={nodeIsCollapsed}
        onClick={() => {
          setNodeIsCollapsed(!nodeIsCollapsed);
        }}
      />

      {type === "variable" ? (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              {/* 
              eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
            */}
              <span className="flex" tabIndex={0}>
                <button
                  onClick={() => {
                    if (setDisabledReferenceHint) {
                      setDisabledReferenceHint((prev) => !prev);
                    }
                  }}
                >
                  <Icons.ReferenceIconCheck
                    className={cn(
                      "h-3 w-6 transition-colors duration-500",
                      disabledReferenceHint
                        ? "stroke-semantic-fg-secondary"
                        : "stroke-semantic-accent-default"
                    )}
                  />
                </button>
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content className="rounded-sm bg-semantic-bg-primary !px-3 !py-2 !product-body-text-4-semibold">
                {`${disabledReferenceHint ? "Enable" : "Disable"} reference hint`}
                <Tooltip.Arrow
                  className="fill-semantic-bg-primary"
                  offset={10}
                  width={9}
                  height={6}
                />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ) : null}
      <NodeDropdownMenu.Root
        isOpen={moreOptionsIsOpen}
        setIsOpen={setMoreOptionsIsOpen}
        nodeTypeName={type}
      >
        <NodeDropdownMenu.Item
          onClick={(e) => {
            if (pipelineIsReadOnly) return;

            e.stopPropagation();
            handleToggleNote();
            setMoreOptionsIsOpen(false);
          }}
          disabled={pipelineIsReadOnly}
        >
          {noteIsOpen ? (
            <Icons.FileMinus01 className="h-4 w-4 stroke-semantic-fg-secondary" />
          ) : (
            <Icons.FilePlus01 className="h-4 w-4 stroke-semantic-fg-secondary" />
          )}
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Toggle note
          </p>
        </NodeDropdownMenu.Item>
      </NodeDropdownMenu.Root>
    </ControlPanel.Root>
  );
}
