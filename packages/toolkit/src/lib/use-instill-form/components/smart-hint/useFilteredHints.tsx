import { Nullable } from "../../../type";
import {
  SmartHint,
  pickSmartHintsFromAcceptFormats,
} from "../../../use-smart-hint";

import * as React from "react";

export function useFilteredHints({
  smartHints,
  instillAcceptFormats,
  currentCursorPos,
  smartHintEnabledPos,
  fieldValue,
}: {
  smartHints: SmartHint[];
  instillAcceptFormats: string[];
  currentCursorPos: Nullable<number>;
  smartHintEnabledPos: Nullable<number>;
  fieldValue: string;
}) {
  const filteredHints: SmartHint[] = React.useMemo(() => {
    if (!smartHints || smartHints.length === 0) {
      return [];
    }

    let searchCode: Nullable<string> = null;

    const allHints = pickSmartHintsFromAcceptFormats(
      smartHints,
      instillAcceptFormats
    );

    if (smartHintEnabledPos && currentCursorPos) {
      searchCode = fieldValue.substring(smartHintEnabledPos, currentCursorPos);

      if (searchCode) {
        return allHints.filter((hint) =>
          hint.path.startsWith(searchCode as string)
        );
      }
    }

    return allHints;
  }, [
    smartHints,
    instillAcceptFormats,
    currentCursorPos,
    smartHintEnabledPos,
    fieldValue,
  ]);

  return filteredHints;
}
