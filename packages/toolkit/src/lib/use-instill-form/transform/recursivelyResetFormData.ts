import { GeneralRecord } from "../../type";
import { InstillFormTree, SelectedConditionMap } from "../type";
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
      const constField = tree.conditions[
        Object.keys(tree.conditions)[0]
      ].properties.find((e) => "const" in e);

      if (constField && constField.path) {
        const selectedCondition = selectedConditionMap[constField.path];

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
