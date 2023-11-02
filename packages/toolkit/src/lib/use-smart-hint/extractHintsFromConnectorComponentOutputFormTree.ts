import { InstillFormTree } from "../use-instill-form";
import { SmartHint } from "./types";

export function extractHintsFromConnectorComponentOutputFormTree(
  tree: InstillFormTree,
  componentNodeID: string
): SmartHint[] {
  let hints: SmartHint[] = [];
  if (tree._type === "formGroup") {
    tree.properties.map((property) => {
      const childHints = extractHintsFromConnectorComponentOutputFormTree(
        property,
        componentNodeID
      );
      hints = [...hints, ...childHints];
    });

    return hints;
  }

  if (tree._type === "formArray") {
    tree.properties.map((property) => {
      const childHints = extractHintsFromConnectorComponentOutputFormTree(
        property,
        componentNodeID
      );
      hints = [...hints, ...childHints];
    });

    return hints;
  }

  // There is no need to extract hints from formCondition
  if (tree._type === "formCondition") {
    return [];
  }

  if (tree.path) {
    const pathArray = tree.path.split(".");
    pathArray.unshift(componentNodeID);

    hints.push({
      path: pathArray.join("."),
      instillFormat: tree.instillFormat ?? "null",
    });
  }

  return hints;
}
