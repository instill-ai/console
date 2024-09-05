import { dot } from "../../dot";
import { GeneralRecord, Nullable } from "../../type";
import { pickDefaultCondition } from "../pick";
import { InstillFormTree, SelectedConditionMap } from "../types";

export type TransformInstillFormTreeToDefaultValueOptions = {
  initialData?: GeneralRecord;
  selectedConditionMap?: SelectedConditionMap;
  skipPath?: string[];
  stringify?: boolean;
  parentIsObjectArray?: boolean;
  parentIsFormCondition?: boolean;
  parentPath?: string;
};

export function transformInstillFormTreeToDefaultValue(
  tree: InstillFormTree,
  options?: TransformInstillFormTreeToDefaultValueOptions,
): GeneralRecord {
  const initialData = options?.initialData ?? {};
  const selectedConditionMap = options?.selectedConditionMap ?? {};
  const skipPath = options?.skipPath ?? [];
  const stringify = options?.stringify ?? false;
  const parentIsObjectArray = options?.parentIsObjectArray ?? false;
  const parentIsFormCondition = options?.parentIsFormCondition ?? false;
  const parentPath = options?.parentPath ?? undefined;

  // We don't need to set the field key for formCondition because in the
  // conditions are formGroup, we will set the fieldKey there

  let modifiedPath = tree.path;

  const parentPathArray = parentPath ? parentPath.split(".") : [];

  // The reason we need to have parentPath and do this kind of adding up again even though
  // we already did it when transform InstillJSONSchema to formTree, is due to we need to
  // react to the index value of objectArray and the possibility that formCondition and formGroup
  // will have the same path
  if (parentIsObjectArray) {
    if (parentPath && tree.fieldKey) {
      const modifiedPathArray = [...parentPathArray, "0"];
      modifiedPath = modifiedPathArray.join(".");
    }
  } else {
    if (parentPath && tree.fieldKey) {
      if (parentIsFormCondition) {
        const modifiedPathArray = [...parentPathArray];
        modifiedPath = modifiedPathArray.join(".");
      } else {
        const modifiedPathArray = [...parentPathArray, tree.fieldKey];
        modifiedPath = modifiedPathArray.join(".");
      }
    }
  }

  if (modifiedPath === null || modifiedPath === undefined) {
    modifiedPath = tree.fieldKey;
  }

  console.log("modifiedPath", modifiedPath);

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
            skipPath,
            stringify,
            parentPath: modifiedPath ?? undefined,
            parentIsFormCondition: true,
          });

          dot.setter(
            initialData,
            modifiedPath
              ? modifiedPath + "." + defaultCondition.fieldKey
              : (defaultCondition.fieldKey ?? ""),
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
            skipPath,
            stringify,
            parentPath: modifiedPath ?? undefined,
            parentIsFormCondition: true,
          });

          dot.setter(
            initialData,
            modifiedPath
              ? modifiedPath + "." + defaultCondition.fieldKey
              : (defaultCondition.fieldKey ?? ""),
            defaultCondition.const as string,
          );
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
        skipPath,
        stringify,
        parentPath: modifiedPath ?? undefined,
      });
    }

    return initialData;
  }

  if (tree._type === "objectArray") {
    if (modifiedPath) {
      transformInstillFormTreeToDefaultValue(tree.properties, {
        initialData,
        selectedConditionMap,
        skipPath,
        stringify,
        parentIsObjectArray: true,
        parentPath: modifiedPath ?? undefined,
      });
    }

    return initialData;
  }

  if (tree._type === "arrayArray") {
    if (modifiedPath) {
      dot.setter(initialData, modifiedPath, []);
    }
    return initialData;
  }

  let defaultValue: Nullable<string | number> = null;

  if (!modifiedPath) {
    return initialData;
  }

  // We deal with const in the previous formCondition step
  if ("const" in tree) {
    return initialData;
  }

  if (tree.anyOf) {
    const instillUpstreamValue = tree.anyOf.find(
      (e) => e.instillUpstreamType === "value",
    );

    console.log("anyOf", instillUpstreamValue);

    if (instillUpstreamValue) {
      if (instillUpstreamValue.default) {
        defaultValue = stringify
          ? String(instillUpstreamValue.default)
          : (instillUpstreamValue.default as string | number);
        dot.setter(initialData, modifiedPath, defaultValue);
        return initialData;
      }

      if (instillUpstreamValue.examples) {
        switch (typeof instillUpstreamValue.examples) {
          case "object":
            if (Array.isArray(instillUpstreamValue.examples)) {
              defaultValue = stringify
                ? String(instillUpstreamValue.examples[0])
                : (instillUpstreamValue.examples[0] as string | number);
            }
            break;
          case "number":
            defaultValue = stringify
              ? String(instillUpstreamValue.examples)
              : instillUpstreamValue.examples;
            break;
          case "string":
            defaultValue = stringify
              ? String(instillUpstreamValue.examples)
              : instillUpstreamValue.examples;
            break;
        }

        dot.setter(initialData, modifiedPath, defaultValue);
        return initialData;
      }

      if (instillUpstreamValue.example) {
        switch (typeof instillUpstreamValue.example) {
          case "number":
            defaultValue = stringify
              ? String(instillUpstreamValue.example)
              : instillUpstreamValue.example;
            break;
          case "string":
            defaultValue = stringify
              ? String(instillUpstreamValue.example)
              : instillUpstreamValue.example;
            break;
          default:
            defaultValue = null;
        }

        dot.setter(initialData, modifiedPath, defaultValue);
        return initialData;
      }
    }
  }

  if (tree.path && skipPath.includes(tree.path)) {
    return initialData;
  }

  if (tree.type === "boolean") {
    dot.setter(initialData, modifiedPath, false);
    return initialData;
  }

  if (
    "default" in tree &&
    ((tree.type === "integer" && (tree.default ?? null) !== null) ||
      tree.default)
  ) {
    defaultValue = stringify
      ? String(tree.default)
      : (tree.default as string | number);
    dot.setter(initialData, modifiedPath, defaultValue);
    return initialData;
  }

  if ("examples" in tree && tree.examples) {
    switch (typeof tree.examples) {
      case "object":
        if (Array.isArray(tree.examples)) {
          defaultValue = stringify
            ? String(tree.examples[0])
            : (tree.examples[0] as string | number);
        }
        break;
      case "number":
        defaultValue = stringify ? String(tree.examples) : tree.examples;
        break;
      case "string":
        defaultValue = stringify ? String(tree.examples) : tree.examples;
        break;
      default:
        defaultValue = null;
    }

    dot.setter(initialData, modifiedPath, defaultValue);
    return initialData;
  }

  if ("example" in tree && tree.example) {
    switch (typeof tree.example) {
      case "number":
        defaultValue = stringify ? String(tree.example) : tree.example;
        break;
      case "string":
        defaultValue = stringify ? String(tree.example) : tree.example;
        break;
      default:
        defaultValue = null;
    }

    dot.setter(initialData, modifiedPath, defaultValue);
    return initialData;
  }

  dot.setter(initialData, modifiedPath, defaultValue);
  return initialData;
}
