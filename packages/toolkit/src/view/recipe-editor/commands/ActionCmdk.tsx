"use client";

import * as React from "react";
import { Nullable } from "instill-sdk";

import { Command, Icons } from "@instill-ai/design-system";

import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import { CommandShortcutBadge } from "./CommandShortcutBadge";

const selector = (store: InstillStore) => ({
  openActionCmdk: store.openActionCmdk,
  openComponentCmdo: store.openComponentCmdo,
  updateOpenActionCmdk: store.updateOpenActionCmdk,
  updateOpenComponentCmdo: store.updateOpenComponentCmdo,
});

export const ActionCmdk = () => {
  const commandRef = React.useRef<Nullable<HTMLDivElement>>(null);
  const {
    openActionCmdk,
    openComponentCmdo,
    updateOpenActionCmdk,
    updateOpenComponentCmdo,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (openComponentCmdo) {
        return;
      }

      // Trigger the action command
      if (!openActionCmdk) {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          updateOpenActionCmdk((open) => !open);
        }
        return;
      }

      // Trigger the shortcut inside the action command
      if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        updateOpenActionCmdk(() => false);
        updateOpenComponentCmdo(() => true);
      }
    };

    document.addEventListener("keydown", down);
    return () => {
      document.removeEventListener("keydown", down);
    };
  }, [openComponentCmdo, openActionCmdk]);

  return (
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
            <Command.Item onSelect={() => {}}>
              <div className="flex flex-row gap-x-2 mr-auto">
                <Icons.Plus className="w-4 h-4 stroke-semantic-fg-disabled" />
                <p className="product-body-text-3-medium text-semantic-fg-primary">
                  Import Recipe
                </p>
              </div>
              <CommandShortcutBadge shortcut="⌘R" />
            </Command.Item>
          </Command.Group>
        </div>
      </Command.List>
    </Command.Dialog>
  );
};
