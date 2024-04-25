import { dot } from "../../dot";
import { GeneralRecord } from "../../type";
import { InstillFormTree, SelectedConditionMap } from "../types";
import { pickDefaultCondition } from "./pickDefaultCondition";

export function pickSelectedConditionMap({
  tree,
  initialValue,
  parentMap = {},
}: {
  tree: InstillFormTree;
  initialValue: GeneralRecord;
  parentMap?: SelectedConditionMap;
}): SelectedConditionMap {
  if (tree._type === "formGroup") {
    let map: SelectedConditionMap = {};

    tree.properties.map((property) => {
      const childMap = pickSelectedConditionMap({
        tree: property,
        initialValue,
        parentMap,
      });
      map = {
        ...map,
        ...parentMap,
        ...childMap,
      };
    });

    return map;
  }

  if (tree._type === "objectArray") {
    let map: SelectedConditionMap = {};

    const childMap = pickSelectedConditionMap({
      tree: tree.properties,
      initialValue,
      parentMap,
    });
    map = {
      ...map,
      ...parentMap,
      ...childMap,
    };

    return map;
  }

  if (tree._type === "formCondition") {
    let map: SelectedConditionMap = {};
    const defaultCondition = pickDefaultCondition(tree);

    if (defaultCondition?.path) {
      const initialConditionValue = dot.getter(
        initialValue,
        defaultCondition.path
      );

      if (initialConditionValue) {
        map[defaultCondition.path] = initialConditionValue;
      }
    }

    Object.entries(tree.conditions).map(([, condition]) => {
      const childMap = pickSelectedConditionMap({
        tree: condition,
        initialValue,
        parentMap: map,
      });

      map = {
        ...map,
        ...parentMap,
        ...childMap,
      };
    });

    return map;
  }

  return parentMap;
}
