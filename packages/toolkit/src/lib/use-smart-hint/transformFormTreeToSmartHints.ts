import { InstillFormTree } from "../use-instill-form";
import { SmartHint } from "./types";

export function transformFormTreeToSmartHints(
  tree: InstillFormTree,
  componentNodeID: string
): SmartHint[] {
  let hints: SmartHint[] = [];
  if (tree._type === "formGroup") {
    tree.properties.map((property) => {
      const childHints = transformFormTreeToSmartHints(
        property,
        componentNodeID
      );
      hints = [...hints, ...childHints];
    });

    return hints;
  }

  if (tree._type === "objectArray") {
    const objectHints = transformFormTreeToSmartHints(
      tree.properties,
      componentNodeID
    );

    if (tree.path) {
      const pathArray = tree.path.split(".");
      pathArray.unshift("output");
      pathArray.unshift(componentNodeID);

      return [
        ...hints,
        {
          path: pathArray.join("."),
          key: tree.fieldKey ?? "null",
          instillFormat: tree.instillFormat ?? "null",
          type: "array",
          properties: objectHints,
        },
      ];
    }

    return [];
  }

  // There is no need to extract hints from formCondition
  if (tree._type === "formCondition") {
    return [];
  }

  if (tree.path) {
    const pathArray = tree.path.split(".");
    pathArray.unshift("output");
    pathArray.unshift(componentNodeID);

    hints.push({
      path: pathArray.join("."),
      key: tree.fieldKey ?? "null",
      instillFormat: tree.instillFormat ?? "null",
      type: tree.type ?? "null",
      description: tree.description,
    });
  }

  return hints;
}
