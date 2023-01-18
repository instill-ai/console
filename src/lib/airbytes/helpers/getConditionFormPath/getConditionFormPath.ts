import { Nullable } from "@/types/general";
import { AirbyteFormConditionItem, AirbyteFormItem } from "../../types";

export const getConditionFormPath = (
  item: AirbyteFormConditionItem
): Nullable<string> => {
  // Try to find a workaround of Typescript limitation
  // https://github.com/microsoft/TypeScript/issues/9998
  const path: string[] = [];

  Object.entries(item.conditions).every(([, v]) => {
    const targetConstField = v.properties.find((e) => "const" in e) as
      | AirbyteFormItem
      | undefined;

    if (targetConstField && targetConstField.path) {
      path.push(targetConstField.path);
      return false;
    } else {
      return true;
    }
  });

  if (path.length > 0) {
    return path[0];
  } else {
    return null;
  }
};
