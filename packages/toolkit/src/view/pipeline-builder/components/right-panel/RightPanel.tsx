"use client";

import cn from "clsx";
import * as React from "react";
import { Button, DialogPrimitive } from "@instill-ai/design-system";
import { InstillStore, useInstillStore, useShallow } from "../../../../lib";
import { OutputView } from "./OutputView";
import { ConfigurationView } from "./ConfigurationView";

const selector = (store: InstillStore) => ({
  rightPanelIsOpen: store.rightPanelIsOpen,
  updateRightPanelIsOpen: store.updateRightPanelIsOpen,
  displayResultOnRightPanel: store.displayResultOnRightPanel,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
});

export const RightPanel = () => {
  const [isCenterView, setIsCenterView] = React.useState(false);

  const {
    rightPanelIsOpen,
    updateRightPanelIsOpen,
    displayResultOnRightPanel,
    selectedConnectorNodeId,
  } = useInstillStore(useShallow(selector));

  return (
    <DialogPrimitive.Root
      open={rightPanelIsOpen}
      onOpenChange={(e) => {
        updateRightPanelIsOpen(() => e);
      }}
    >
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            "fixed inset-0 z-50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          )}
        />
        <DialogPrimitive.Content
          className={
            isCenterView
              ? cn(
                  "fixed left-[50%] top-[50%] z-50 grid h-[600px] w-[1200px] translate-x-[-50%] translate-y-[-50%] gap-4 rounded border bg-semantic-bg-primary p-6 shadow-lg duration-200",
                  "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
                )
              : cn(
                  "right-0 w-[480px] border-l bg-semantic-bg-primary data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
                  "fixed z-50 gap-4 p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
                  "h-[calc(100vh-var(--topbar-height)-var(--pipeline-builder-bottom-bar-height))]",
                  "top-[var(--topbar-height)]",
                )
          }
        >
          <Button
            variant="tertiaryGrey"
            size="md"
            onClick={() => {
              setIsCenterView(!isCenterView);
            }}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.5 2H2.5C2.22386 2 2 2.22386 2 2.5V12.5C2 12.7761 2.22386 13 2.5 13H12.5C12.7761 13 13 12.7761 13 12.5V2.5C13 2.22386 12.7761 2 12.5 2ZM2.5 1C1.67157 1 1 1.67157 1 2.5V12.5C1 13.3284 1.67157 14 2.5 14H12.5C13.3284 14 14 13.3284 14 12.5V2.5C14 1.67157 13.3284 1 12.5 1H2.5Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </Button>
          {displayResultOnRightPanel ? (
            <OutputView />
          ) : selectedConnectorNodeId ? (
            <ConfigurationView />
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};
