"use client";

import * as React from "react";

import { InstillStore, useInstillStore, useShallow } from "../../../lib";

const selector = (store: InstillStore) => ({
  openActionCmdk: store.openActionCmdk,
  updateOpenActionCmdk: store.updateOpenActionCmdk,
  openComponentCmdo: store.openComponentCmdo,
  updateOpenComponentCmdo: store.updateOpenComponentCmdo,
  importRecipeInputTriggerRef: store.importRecipeInputTriggerRef,
});

export function useEditorCommandListener() {
  const {
    openActionCmdk,
    updateOpenActionCmdk,
    openComponentCmdo,
    updateOpenComponentCmdo,
    importRecipeInputTriggerRef,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (openActionCmdk) {
        if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          updateOpenActionCmdk(() => false);
          updateOpenComponentCmdo(() => true);
          return;
        }

        if (e.key === "r" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          updateOpenActionCmdk(() => false);
          if (importRecipeInputTriggerRef.current) {
            importRecipeInputTriggerRef.current.click();
          }
        }
        return;
      }

      if (openComponentCmdo) {
        if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          updateOpenComponentCmdo(() => false);
        }
        return;
      }

      if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        updateOpenComponentCmdo((open) => !open);
        return;
      }

      if (!openActionCmdk) {
        if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          updateOpenActionCmdk((open) => !open);
        }
        return;
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [
    openActionCmdk,
    updateOpenComponentCmdo,
    importRecipeInputTriggerRef,
    updateOpenActionCmdk,
  ]);
}
