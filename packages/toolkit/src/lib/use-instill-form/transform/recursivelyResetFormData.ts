import { dot } from "../../dot";
import { GeneralRecord } from "../../type";
import { InstillFormTree, SelectedConditionMap } from "../type";

export function recursivelyResetFormData(
  resetTree: InstillFormTree,
  resetSelectedConditionMap: SelectedConditionMap,
  formData: GeneralRecord
) {
  switch (resetTree._type) {
    case "formGroup": {
      for (const property of resetTree.properties) {
        recursivelyResetFormData(property, resetSelectedConditionMap, formData);
      }
      break;
    }
    case "objectArray": {
      recursivelyResetFormData(
        resetTree.properties,
        resetSelectedConditionMap,
        formData
      );
      break;
    }
    case "formCondition": {
      const constField = resetTree.conditions[
        Object.keys(resetTree.conditions)[0]
      ].properties.find((e) => "const" in e);

      if (constField && constField.path) {
        const selectedCondition = resetSelectedConditionMap[constField.path];
        if (selectedCondition) {
          recursivelyResetFormData(
            resetTree.conditions[selectedCondition],
            resetSelectedConditionMap,
            formData
          );
        }
      }

      break;
    }
    default: {
      if ("const" in resetTree) {
        break;
      }

      if (resetTree.path) {
        dot.setter(formData, resetTree.path, null);
      }
    }
  }
}
