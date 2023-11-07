import { dot } from "../../dot";
import { GeneralRecord } from "../../type";
import {
  InstillFormItem,
  InstillFormTree,
  SelectedConditionMap,
} from "../type";

export type TransformInstillFormTreeToInitialSelectedConditionOptions = {
  initialData?: GeneralRecord;
};

export function transformInstillFormTreeToInitialSelectedCondition(
  tree: InstillFormTree,
  options?: TransformInstillFormTreeToInitialSelectedConditionOptions
) {
  let selectedConditionMap: SelectedConditionMap = {};

  if (tree._type === "formGroup") {
    for (const property of tree.properties) {
      selectedConditionMap = {
        ...selectedConditionMap,
        ...transformInstillFormTreeToInitialSelectedCondition(
          property,
          options
        ),
      };
    }
  }

  if (tree._type === "objectArray") {
    selectedConditionMap = {
      ...selectedConditionMap,
      ...transformInstillFormTreeToInitialSelectedCondition(
        tree.properties,
        options
      ),
    };
  }

  if (tree._type === "formCondition") {
    const constField = tree.conditions[
      Object.keys(tree.conditions)[0]
    ].properties.find((e) => "const" in e) as InstillFormItem;

    if (constField && constField.path) {
      if (options?.initialData) {
        const selectedCondition = dot.getter(
          options.initialData,
          constField.path
        );

        if (selectedCondition) {
          selectedConditionMap[constField.path] = selectedCondition as string;

          selectedConditionMap = {
            ...selectedConditionMap,
            ...transformInstillFormTreeToInitialSelectedCondition(
              tree.conditions[selectedCondition as string],
              options
            ),
          };

          return selectedConditionMap;
        }
      }

      selectedConditionMap[constField.path] = constField.const as string;

      selectedConditionMap = {
        ...selectedConditionMap,
        ...transformInstillFormTreeToInitialSelectedCondition(
          tree.conditions[constField.const as string],
          options
        ),
      };
    }
  }

  return selectedConditionMap;
}
