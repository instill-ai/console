import { dot } from "../../dot";
import { GeneralRecord, Nullable } from "../../type";
import { pickDefaultCondition } from "../pick";
import { InstillFormTree, SelectedConditionMap } from "../types";

export type TransformInstillFormTreeToDefaultValueOptions = {
  initialData?: GeneralRecord;

  // This is only for FieldArray
  isRoot?: boolean;
  selectedConditionMap?: SelectedConditionMap;
  skipPath?: string[];
};

export function transformInstillFormTreeToDefaultValue(
  tree: InstillFormTree,
  options?: TransformInstillFormTreeToDefaultValueOptions,
): GeneralRecord {
  const initialData = options?.initialData ?? {};
  const isRoot = options?.isRoot ?? false;
  const selectedConditionMap = options?.selectedConditionMap ?? {};
  const skipPath = options?.skipPath ?? [];
  // We don't need to set the field key for formCondition because in the
  // conditions are formGroup, we will set the fieldKey there

  if (tree._type === "formCondition") {
    const defaultCondition = pickDefaultCondition(tree);
    const constPath = defaultCondition?.path;

    if (defaultCondition && constPath) {
      if (selectedConditionMap && selectedConditionMap[constPath]) {
        const selectedConditionKey = selectedConditionMap[constPath];
        const selectedCondition = selectedConditionKey
          ? tree.conditions[selectedConditionKey]
          : null;
        if (selectedCondition) {
          transformInstillFormTreeToDefaultValue(selectedCondition, {
            initialData,
            selectedConditionMap,
            isRoot,
            skipPath,
          });

          dot.setter(
            initialData,
            constPath,
            selectedConditionMap[constPath] as string,
          );
        }
      } else {
        const headConditionKey = Object.keys(tree.conditions)[0];
        const headCondition = headConditionKey
          ? tree.conditions[headConditionKey]
          : null;

        if (headCondition) {
          transformInstillFormTreeToDefaultValue(headCondition, {
            initialData,
            selectedConditionMap,
            isRoot,
            skipPath,
          });

          dot.setter(initialData, constPath, defaultCondition.const as string);
        }
      }
    }

    return initialData;
  }

  if (tree._type === "formGroup") {
    for (const property of tree.properties) {
      transformInstillFormTreeToDefaultValue(property, {
        initialData: initialData,
        selectedConditionMap,
        isRoot,
        skipPath,
      });
    }

    return initialData;
  }

  if (tree._type === "objectArray") {
    const objectArrayValue: GeneralRecord = {};

    transformInstillFormTreeToDefaultValue(tree.properties, {
      initialData: objectArrayValue,
      isRoot: true,
      selectedConditionMap,
      skipPath,
    });

    if (tree.path) {
      dot.setter(initialData, tree.path, [objectArrayValue]);
    }
    return initialData;
  }

  if (tree._type === "arrayArray") {
    if (tree.path) {
      dot.setter(initialData, tree.path, []);
    }
    return initialData;
  }

  let defaultValue: Nullable<string | number> = null;

  const key = isRoot ? tree.fieldKey : tree.path;

  if (!key) {
    return initialData;
  }

  if (tree.path && skipPath.includes(tree.path)) {
    return initialData;
  }

  if (tree.type === "boolean") {
    dot.setter(initialData, key, false);
    return initialData;
  }

  if (
    "default" in tree &&
    ((tree.type === "integer" && (tree.default ?? null) !== null) ||
      tree.default)
  ) {
    defaultValue = tree.default as string | number;
    dot.setter(initialData, key, defaultValue);
    return initialData;
  }

  if ("examples" in tree && tree.examples) {
    switch (typeof tree.examples) {
      case "object":
        if (Array.isArray(tree.examples)) {
          defaultValue = tree.examples[0] as string | number;
        }
        break;
      case "number":
        defaultValue = tree.examples;
        break;
      case "string":
        defaultValue = tree.examples;
        break;
      default:
        defaultValue = null;
    }

    dot.setter(initialData, key, defaultValue);
    return initialData;
  }

  if ("example" in tree && tree.example) {
    switch (typeof tree.example) {
      case "number":
        defaultValue = tree.example;
        break;
      case "string":
        defaultValue = String(tree.example);
        break;
      default:
        defaultValue = null;
    }

    dot.setter(initialData, key, defaultValue);
    return initialData;
  }

  dot.setter(initialData, key, defaultValue);
  return initialData;
}
