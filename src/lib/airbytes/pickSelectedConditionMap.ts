import getConditionFormPath from "./getConditionFormPath";
import {
  AirbyteFieldValues,
  AirbyteFormItem,
  AirbyteFormTree,
  SelectedItemMap,
} from "./types";

const pickSelectedConditionMap = (
  formTree: AirbyteFormTree,
  initialValue: AirbyteFieldValues,
  parentMap: SelectedItemMap = {}
): SelectedItemMap => {
  if (formTree._type === "formGroup") {
    let map = {} as SelectedItemMap;
    formTree.properties.map((e) => {
      const childMap = pickSelectedConditionMap(e, initialValue, parentMap);
      map = {
        ...map,
        ...parentMap,
        ...childMap,
      };
    });

    return map;
  }

  if (formTree._type === "formCondition") {
    const conditionFormPath = getConditionFormPath(formTree);

    let map = {} as SelectedItemMap;

    if (conditionFormPath && initialValue[conditionFormPath]) {
      const conditionValue = initialValue[conditionFormPath];
      const conditionTitle: string[] = [];

      // Internally we all use condition.title as selectedItem value

      Object.entries(formTree.conditions).forEach(([k, v]) => {
        const constField = v.properties.find((e) => "const" in e) as
          | AirbyteFormItem
          | undefined;
        if (constField && conditionValue === constField.const) {
          conditionTitle.push(k);
        }
      });
      if (conditionTitle.length > 0) {
        map[formTree.path] = {
          selectedItem: conditionTitle[0] as string,
        };
      }
    }

    Object.entries(formTree.conditions).map(([, v]) => {
      const childMap = pickSelectedConditionMap(v, initialValue, parentMap);
      map = {
        ...map,
        ...childMap,
      };
    });
    return map;
  }

  if (formTree._type === "objectArray") {
    let map = {} as SelectedItemMap;
    const childMap = pickSelectedConditionMap(
      formTree.properties,
      initialValue,
      parentMap
    );

    map = {
      ...parentMap,
      ...childMap,
    };

    return map;
  }

  return parentMap;
};

export default pickSelectedConditionMap;
