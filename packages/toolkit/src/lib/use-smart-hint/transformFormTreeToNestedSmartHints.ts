import { GeneralRecord } from "../type";
import { InstillFormTree } from "../use-instill-form";

export function transformFormTreeToNestedSmartHints(
  tree: InstillFormTree,
): GeneralRecord {
  if (tree._type === "formGroup") {
    const properties = Object.fromEntries(
      tree.properties.map((value) => {
        return [
          value.fieldKey,
          {
            ...transformFormTreeToNestedSmartHints(value),
          },
        ];
      }),
    );

    return {
      ...properties,
      key: tree.fieldKey ?? "null",
      description: tree.description,
    };
  }

  if (tree._type === "objectArray" && tree.fieldKey) {
    return {
      ...transformFormTreeToNestedSmartHints(tree.properties),
      type: "objectArray",
    };
  }

  if (tree._type === "arrayArray") {
    return {};
  }

  if (tree._type === "formCondition") {
    return {};
  }

  return {
    key: tree.fieldKey ?? "null",
    instillFormat: tree.instillFormat ?? "null",
    description: tree.description,
  };
}
