"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import { Command, Icons } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import { EditorButtonTooltipWrapper } from "../EditorButtonTooltipWrapper";
import { CommandShortcutBadge } from "./CommandShortcutBadge";

const selector = (store: InstillStore) => ({
  openActionCmdk: store.openActionCmdk,
  updateOpenActionCmdk: store.updateOpenActionCmdk,
  updateOpenComponentCmdo: store.updateOpenComponentCmdo,
  importRecipeInputTriggerRef: store.importRecipeInputTriggerRef,
});

export const ActionCmdk = () => {
  const commandRef = React.useRef<Nullable<HTMLDivElement>>(null);
  const {
    openActionCmdk,
    updateOpenActionCmdk,
    updateOpenComponentCmdo,
    importRecipeInputTriggerRef,
  } = useInstillStore(useShallow(selector));

  return (
    <React.Fragment>
      <EditorButtonTooltipWrapper tooltipContent="Search ⌘ K">
        <button
          onClick={() => {
            updateOpenActionCmdk(() => true);
          }}
          className="p-[9px] my-auto hover:bg-semantic-bg-base-bg"
        >
          <Icons.SearchSm className="w-[14px] h-[14px] stroke-semantic-fg-primary" />
        </button>
      </EditorButtonTooltipWrapper>
      <Command.Dialog
        ref={commandRef}
        dialogContentClassName="w-[480px] h-[325px]"
        open={openActionCmdk}
        onOpenChange={(open) => updateOpenActionCmdk(() => open)}
      >
        <Command.Input
          startIcon={
            <Icons.SearchMd className="w-4 h-4 stroke-semantic-fg-disabled" />
          }
          wrapperClassName="!px-4"
          inputClassName="!px-0"
          placeholder="Search, add component or import the receipt"
        />
        <Command.List className="max-h-none">
          <div className="flex flex-col">
            <Command.Group heading="Component">
              <Command.Item
                onSelect={() => {
                  updateOpenActionCmdk(() => false);
                  updateOpenComponentCmdo(() => true);
                }}
              >
                <div className="flex flex-row gap-x-2 mr-auto">
                  <Icons.Plus className="w-4 h-4 stroke-semantic-fg-disabled" />
                  <p className="product-body-text-3-medium text-semantic-fg-primary">
                    Add Component
                  </p>
                </div>
                <CommandShortcutBadge shortcut="⌘O" />
              </Command.Item>
            </Command.Group>
            <Command.Group heading="Recipe">
              <Command.Item
                onSelect={() => {
                  updateOpenActionCmdk(() => false);
                  if (importRecipeInputTriggerRef.current) {
                    importRecipeInputTriggerRef.current.click();
                  }
                }}
              >
                <div className="flex flex-row gap-x-2 mr-auto">
                  <Icons.Plus className="w-4 h-4 stroke-semantic-fg-disabled" />
                  <p className="product-body-text-3-medium text-semantic-fg-primary">
                    Import Recipe
                  </p>
                </div>
                <CommandShortcutBadge shortcut="⌘I" />
              </Command.Item>
            </Command.Group>
          </div>
        </Command.List>
      </Command.Dialog>
    </React.Fragment>
  );
};
