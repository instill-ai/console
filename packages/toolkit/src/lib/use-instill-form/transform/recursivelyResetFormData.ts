import { GeneralRecord } from "../../type";
import { pickDefaultCondition } from "../pick";
import { InstillFormTree, SelectedConditionMap } from "../types";
import { transformInstillFormTreeToDefaultValue } from "./transformInstillFormTreeToDefaultValue";

export function recursivelyResetFormData(
  tree: InstillFormTree,
  selectedConditionMap: SelectedConditionMap,
  formData: GeneralRecord
) {
  switch (tree._type) {
    case "formGroup": {
      for (const property of tree.properties) {
        recursivelyResetFormData(property, selectedConditionMap, formData);
      }
      break;
    }
    case "objectArray": {
      recursivelyResetFormData(tree.properties, selectedConditionMap, formData);
      break;
    }
    case "formCondition": {
      const defaultCondition = pickDefaultCondition(tree);

      if (defaultCondition && defaultCondition.path) {
        const selectedCondition = selectedConditionMap[defaultCondition.path];

        if (selectedCondition && tree.conditions[selectedCondition]) {
          recursivelyResetFormData(
            tree.conditions[selectedCondition],
            selectedConditionMap,
            formData
          );
        }
      }

      break;
    }
    default: {
      if ("const" in tree) {
        break;
      }

      transformInstillFormTreeToDefaultValue(tree, {
        initialData: formData,
      });
    }
  }
}
