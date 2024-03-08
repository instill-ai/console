import * as React from "react";
import { useShallow } from "zustand/react/shallow";

import { InstillStore, useInstillStore } from "../use-instill-store";
import { pickSmartHintsFromNodes } from "./pickSmartHintsFromNodes";

const selector = (store: InstillStore) => ({
  updateSmartHints: store.updateSmartHints,
  nodes: store.nodes,
  tempSavedNodesForEditingIteratorFlow:
    store.tempSavedNodesForEditingIteratorFlow,
  isEditingIterator: store.isEditingIterator,
  editingIteratorID: store.editingIteratorID,
});

export const useSmartHint = () => {
  const {
    updateSmartHints,
    nodes,
    tempSavedNodesForEditingIteratorFlow,
    isEditingIterator,
    editingIteratorID,
  } = useInstillStore(useShallow(selector));

  React.useEffect(() => {
    const smartHints = pickSmartHintsFromNodes({
      nodes,
      tempSavedNodesForEditingIteratorFlow,
      isEditingIterator,
      editingIteratorID: editingIteratorID ?? undefined,
      includeEditorElement: isEditingIterator,
    });

    updateSmartHints(() => smartHints);
  }, [
    nodes,
    updateSmartHints,
    tempSavedNodesForEditingIteratorFlow,
    isEditingIterator,
    editingIteratorID,
  ]);
};
