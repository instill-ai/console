import { dot } from "../../dot";
import { GeneralRecord } from "../../type";
import {
  InstillFormItem,
  InstillFormTree,
  SelectedConditionMap,
} from "../type";

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

  if (tree._type === "formArray") {
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

  if (tree._type === "formCondition") {
    let map: SelectedConditionMap = {};

    const constField = tree.conditions[
      Object.keys(tree.conditions)[0]
    ].properties.find((e) => "const" in e) as InstillFormItem | undefined;

    if (constField && constField.path) {
      const initialConditionValue = dot.getter(initialValue, constField.path);

      if (initialConditionValue) {
        map[constField.path] = initialConditionValue;
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
