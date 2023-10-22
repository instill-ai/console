import {
  InstillFormItem,
  InstillFormTree,
  SelectedConditionMap,
} from "../type";

export function transformInstillFormTreeToInitialSelectedCondition({
  tree,
}: {
  tree: InstillFormTree;
}): SelectedConditionMap {
  let selectedConditionMap: SelectedConditionMap = {};

  if (tree._type === "formGroup") {
    for (const property of tree.properties) {
      selectedConditionMap = {
        ...selectedConditionMap,
        ...transformInstillFormTreeToInitialSelectedCondition({
          tree: property,
        }),
      };
    }
  }

  if (tree._type === "formArray") {
    for (const item of tree.properties) {
      selectedConditionMap = {
        ...selectedConditionMap,
        ...transformInstillFormTreeToInitialSelectedCondition({
          tree: item,
        }),
      };
    }
  }

  if (tree._type === "formCondition") {
    const constField = tree.conditions[
      Object.keys(tree.conditions)[0]
    ].properties.find((e) => "const" in e) as InstillFormItem;

    if (constField && constField.path) {
      selectedConditionMap[constField.path] = constField.const as string;

      selectedConditionMap = {
        ...selectedConditionMap,
        ...transformInstillFormTreeToInitialSelectedCondition({
          tree: tree.conditions[constField.const as string],
        }),
      };
    }
  }

  return selectedConditionMap;
}
