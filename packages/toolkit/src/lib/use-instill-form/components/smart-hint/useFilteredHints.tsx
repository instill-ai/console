import { Nullable } from "../../../type";
import {
  SmartHint,
  pickSmartHintsFromAcceptFormats,
} from "../../../use-smart-hint";

import * as React from "react";
import { Secret } from "../../../vdp-sdk";

export function useFilteredHints({
  smartHints,
  instillAcceptFormats,
  currentCursorPos,
  smartHintEnabledPos,
  fieldValue,
  componentID,
  secrets,
  instillSecret,
}: {
  smartHints: SmartHint[];
  instillAcceptFormats: string[];
  currentCursorPos: Nullable<number>;
  smartHintEnabledPos: Nullable<number>;
  fieldValue: string;
  componentID?: string;
  instillSecret?: boolean;
  secrets?: Secret[];
}) {
  const filteredHints: SmartHint[] = React.useMemo(() => {
    if (!smartHints || smartHints.length === 0) {
      return [];
    }

    let searchCode: Nullable<string> = null;

    let allHints = pickSmartHintsFromAcceptFormats(
      smartHints,
      instillAcceptFormats
    );

    if (instillSecret && secrets) {
      allHints = secrets.map((secret) => ({
        key: secret.id,
        path: `secrets.${secret.id}`,
        instillFormat: "string",
        type: "string",
        properties: [],
      }));
    }

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
    secrets,
    instillSecret,
  ]);

  return filteredHints;
}
