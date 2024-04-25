import { InstillFormConditionItem, InstillFormItem } from "../types";

export function pickDefaultCondition(tree: InstillFormConditionItem) {
  const defaultConditions: InstillFormItem[] = [];

  Object.entries(tree.conditions).forEach(([, v]) => {
    // It's possible that both key and value are undefined
    if (v) {
      const targetConstField = v.properties.find((e) => "const" in e) as
        | InstillFormItem
        | undefined;

      if (targetConstField && targetConstField.path) {
        defaultConditions.push(targetConstField);
      }
    }
  });

  if (defaultConditions.length > 0) {
    return defaultConditions[0];
  } else {
    return null;
  }
}
