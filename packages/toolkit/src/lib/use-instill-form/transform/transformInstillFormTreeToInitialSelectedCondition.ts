import { dot } from "../../dot";
import { GeneralRecord } from "../../type";
import {
  InstillFormItem,
  InstillFormTree,
  SelectedConditionMap,
} from "../types";

export type TransformInstillFormTreeToInitialSelectedConditionOptions = {
  initialData?: GeneralRecord;
  parentPath?: string;
  parentIsObjectArray?: boolean;
  parentIsFormCondition?: boolean;
  objectArrayIndex?: number;
};

export function transformInstillFormTreeToInitialSelectedCondition(
  tree: InstillFormTree,
  options?: TransformInstillFormTreeToInitialSelectedConditionOptions,
) {
  let selectedConditionMap: SelectedConditionMap = {};
  const parentPath = options?.parentPath ?? undefined;
  const parentIsObjectArray = options?.parentIsObjectArray ?? false;
  const parentIsFormCondition = options?.parentIsFormCondition ?? false;
  const objectArrayIndex = options?.objectArrayIndex ?? undefined;

  let modifiedPath = tree.path;

  const parentPathArray = parentPath ? parentPath.split(".") : [];

  // The reason we need to have parentPath and do this kind of adding up again even though
  // we already did it when transform InstillJSONSchema to formTree, is due to we need to
  // react to the index value of objectArray and the possibility that formCondition and formGroup
  // will have the same path
  if (parentIsObjectArray) {
    if (parentPathArray && tree.fieldKey) {
      const modifiedPathArray = objectArrayIndex
        ? [...parentPathArray, objectArrayIndex]
        : [...parentPathArray, "0"];
      objectArrayIndex;
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

  if (tree._type === "formGroup") {
    for (const property of tree.properties) {
      selectedConditionMap = {
        ...selectedConditionMap,
        ...transformInstillFormTreeToInitialSelectedCondition(property, {
          ...options,
          parentPath: modifiedPath ?? undefined,
          parentIsFormCondition: false,
          parentIsObjectArray: false,
          objectArrayIndex: undefined,
        }),
      };
    }
  }

  if (tree._type === "objectArray") {
    selectedConditionMap = {
      ...selectedConditionMap,
      ...transformInstillFormTreeToInitialSelectedCondition(tree.properties, {
        ...options,
        parentIsObjectArray: true,
        parentIsFormCondition: false,
        parentPath: modifiedPath ?? undefined,
        objectArrayIndex: undefined,
      }),
    };
  }

  if (tree._type === "formCondition") {
    const constKey = Object.keys(tree.conditions)[0];

    const constField = constKey
      ? (tree.conditions[constKey]?.properties.find(
          (e) => "const" in e,
        ) as InstillFormItem)
      : null;

    if (constField && constField.path) {
      const finalConstPath = modifiedPath
        ? modifiedPath + "." + constField.fieldKey
        : constField.fieldKey;

      if (!finalConstPath) {
        return selectedConditionMap;
      }

      if (options?.initialData) {
        const selectedConditionKey = dot.getter(
          options.initialData,
          finalConstPath,
        );

        if (selectedConditionKey) {
          selectedConditionMap[finalConstPath] = selectedConditionKey as string;

          const selectedCondition =
            tree.conditions[selectedConditionKey as string];

          if (selectedCondition) {
            selectedConditionMap = {
              ...selectedConditionMap,
              ...transformInstillFormTreeToInitialSelectedCondition(
                selectedCondition,
                {
                  ...options,
                  parentIsFormCondition: true,
                  parentIsObjectArray: false,
                  parentPath: modifiedPath ?? undefined,
                },
              ),
            };
          }

          return selectedConditionMap;
        }
      }

      selectedConditionMap[finalConstPath] = constField.const as string;

      const selectedCondition = tree.conditions[constField.const as string];

      if (selectedCondition) {
        selectedConditionMap = {
          ...selectedConditionMap,
          ...transformInstillFormTreeToInitialSelectedCondition(
            selectedCondition,
            {
              ...options,
              parentPath: modifiedPath ?? undefined,
              parentIsFormCondition: true,
              parentIsObjectArray: false,
              objectArrayIndex: undefined,
            },
          ),
        };
      }
    }
  }

  return selectedConditionMap;
}
