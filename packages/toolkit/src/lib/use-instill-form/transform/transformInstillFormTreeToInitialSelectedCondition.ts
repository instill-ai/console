import { dot } from "../../dot";
import { GeneralRecord } from "../../type";
import {
  InstillFormItem,
  InstillFormTree,
  SelectedConditionMap,
} from "../types";

export type TransformInstillFormTreeToInitialSelectedConditionOptions = {
  initialData?: GeneralRecord;
};

export function transformInstillFormTreeToInitialSelectedCondition(
  tree: InstillFormTree,
  options?: TransformInstillFormTreeToInitialSelectedConditionOptions,
) {
  let selectedConditionMap: SelectedConditionMap = {};

  if (tree._type === "formGroup") {
    for (const property of tree.properties) {
      selectedConditionMap = {
        ...selectedConditionMap,
        ...transformInstillFormTreeToInitialSelectedCondition(
          property,
          options,
        ),
      };
    }
  }

  if (tree._type === "objectArray") {
    selectedConditionMap = {
      ...selectedConditionMap,
      ...transformInstillFormTreeToInitialSelectedCondition(
        tree.properties,
        options,
      ),
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
      if (options?.initialData) {
        const selectedConditionKey = dot.getter(
          options.initialData,
          constField.path,
        );

        if (selectedConditionKey) {
          selectedConditionMap[constField.path] =
            selectedConditionKey as string;

          const selectedCondition =
            tree.conditions[selectedConditionKey as string];

          if (selectedCondition) {
            selectedConditionMap = {
              ...selectedConditionMap,
              ...transformInstillFormTreeToInitialSelectedCondition(
                selectedCondition,
                options,
              ),
            };
          }

          return selectedConditionMap;
        }
      }

      selectedConditionMap[constField.path] = constField.const as string;

      const selectedCondition = tree.conditions[constField.const as string];

      if (selectedCondition) {
        selectedConditionMap = {
          ...selectedConditionMap,
          ...transformInstillFormTreeToInitialSelectedCondition(
            selectedCondition,
            options,
          ),
        };
      }
    }
  }

  return selectedConditionMap;
}
