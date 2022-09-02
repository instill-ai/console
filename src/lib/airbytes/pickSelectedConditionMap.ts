import getConditionFormPath from "./getConditionFormPath";
import { AirbyteFieldValues, AirbyteFormTree, SelectedItemMap } from "./types";

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
      map[formTree.path] = {
        selectedItem: initialValue[conditionFormPath] as string,
      };
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
