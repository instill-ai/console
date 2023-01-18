import { useState } from "react";
import { Nullable, UseCustomHookResult } from "@/types/general";
import { pickSelectedConditionMap } from "../helpers";
import { AirbyteFieldValues, AirbyteFormTree, SelectedItemMap } from "../types";

export type UseAirbyteSelectedConditionMapResult = UseCustomHookResult<
  Nullable<SelectedItemMap>
>;

export const useAirbyteSelectedConditionMap = (
  formTree: Nullable<AirbyteFormTree>,
  initialValue: Nullable<AirbyteFieldValues>
): UseAirbyteSelectedConditionMapResult => {
  let initialConditionMap: Nullable<SelectedItemMap> = {};

  if (formTree && initialValue) {
    initialConditionMap = pickSelectedConditionMap(formTree, initialValue);
  } else {
    initialConditionMap = null;
  }

  const [selectedConditionMap, setSelectedConditionMap] =
    useState<Nullable<SelectedItemMap>>(initialConditionMap);

  return [selectedConditionMap, setSelectedConditionMap];
};
