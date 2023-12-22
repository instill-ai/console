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
  componentID,
}: {
  smartHints: SmartHint[];
  instillAcceptFormats: string[];
  currentCursorPos: Nullable<number>;
  smartHintEnabledPos: Nullable<number>;
  fieldValue: string;
  componentID?: string;
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

    if (smartHintEnabledPos !== null && currentCursorPos !== null) {
      searchCode = fieldValue.substring(smartHintEnabledPos, currentCursorPos);

      if (searchCode) {
        return allHints.filter((hint) => {
          // Hint should not hint the field on the same node
          if (componentID) {
            const hintPath = hint.path.split(".");
            if (componentID === hintPath[0]) {
              return false;
            }
          }

          return hint.path.startsWith(searchCode as string);
        });
      }
    }

    if (componentID) {
      return allHints.filter((hint) => {
        const hintPath = hint.path.split(".");
        if (componentID === hintPath[0]) {
          return false;
        }

        return true;
      });
    }

    return allHints;
  }, [
    smartHints,
    instillAcceptFormats,
    currentCursorPos,
    smartHintEnabledPos,
    fieldValue,
    componentID,
  ]);

  return filteredHints;
}
