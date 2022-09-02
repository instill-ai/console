import { Nullable, UseCustomHookResult } from "@/types/general";
import { useState } from "react";
import {
  AirbyteFieldValues,
  AirbyteFormItem,
  AirbyteFormTree,
  SelectedItemMap,
} from "../types";

export type UseAirbyteSelectedConditionMapResult = UseCustomHookResult<
  Nullable<SelectedItemMap>
>;

const useAirbyteSelectedConditionMap = (
  formTree: Nullable<AirbyteFormTree>,
  initialValue: Nullable<AirbyteFieldValues>
): UseAirbyteSelectedConditionMapResult => {
  let initialConditionMap: Nullable<SelectedItemMap> = {};

  if (formTree && initialValue) {
    initialConditionMap = pickInitialSelectedMap(formTree, initialValue);
  } else {
    initialConditionMap = null;
  }

  const [selectedConditionMap, setSelectedConditionMap] =
    useState<Nullable<SelectedItemMap>>(initialConditionMap);

  return [selectedConditionMap, setSelectedConditionMap];
};

const pickInitialSelectedMap = (
  formTree: AirbyteFormTree,
  initialValue: AirbyteFieldValues,
  parentMap: SelectedItemMap = {}
): SelectedItemMap => {
  if (formTree._type === "formGroup") {
    let map = {} as SelectedItemMap;
    formTree.properties.map((e) => {
      const childMap = pickInitialSelectedMap(e, initialValue, parentMap);
      map = {
        ...parentMap,
        ...childMap,
      };
    });

    return map;
  }

  if (formTree._type === "formCondition") {
    // Airbyte store condition field's path in the properties's const field
    /*
      {
        conditions: {
          "No Tunnel": {
            properties: [
              {
                const: "NO_TUNNEL",
                fieldKey: "tunnel_method",
                path: "tunnel_method.tunnel_method"
              }
            ]
          }
        }
      }
    */

    let conditionFieldPath: Nullable<string> = null;

    const conditionArray = Object.entries(formTree.conditions);

    for (const [, v] of conditionArray) {
      const targetConstField = v.properties.find((e) => "const" in e) as
        | AirbyteFormItem
        | undefined;

      if (targetConstField) {
        conditionFieldPath = targetConstField.path;
        break;
      }
    }

    let map = {} as SelectedItemMap;

    if (conditionFieldPath && initialValue[conditionFieldPath]) {
      map = {
        ...parentMap,
        [formTree.path]: {
          selectedItem: initialValue[conditionFieldPath] as string,
        },
      };
    }
    Object.entries(formTree.conditions).map(([, v]) => {
      const childMap = pickInitialSelectedMap(v, initialValue, parentMap);
      map = {
        ...map,
        ...childMap,
      };
    });
    return map;
  }

  if (formTree._type === "objectArray") {
    let map = {} as SelectedItemMap;
    const childMap = pickInitialSelectedMap(
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

export default useAirbyteSelectedConditionMap;
