"use client";

import * as React from "react";

import { InstillStore, useInstillStore, useShallow } from "../../../lib";

const selector = (store: InstillStore) => ({
  openActionCmdk: store.openActionCmdk,
  updateOpenActionCmdk: store.updateOpenActionCmdk,
  openComponentCmdo: store.openComponentCmdo,
  updateOpenComponentCmdo: store.updateOpenComponentCmdo,
  importRecipeInputTriggerRef: store.importRecipeInputTriggerRef,
  runButtonRef: store.runButtonRef,
});

export function useEditorCommandListener() {
  const {
    openActionCmdk,
    updateOpenActionCmdk,
    openComponentCmdo,
    updateOpenComponentCmdo,
    importRecipeInputTriggerRef,
    runButtonRef,
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

        if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
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

      // When none of the above commands are open

      if (e.key === "i" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (importRecipeInputTriggerRef.current) {
          importRecipeInputTriggerRef.current.click();
        }
        return;
      }

      if (e.key === "o" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        updateOpenComponentCmdo((open) => !open);
        return;
      }

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        updateOpenActionCmdk((open) => !open);
        return;
      }

      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        runButtonRef.current?.click();
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
