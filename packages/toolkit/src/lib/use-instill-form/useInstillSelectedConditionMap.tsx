import * as React from "react";

import { InstillFormTree, SelectedConditionMap } from "./types";
import { pickSelectedConditionMap } from "./pick";
import { GeneralRecord, Nullable, UseCustomHookResult } from "../type";

export type UseInstillSelectedConditionMapResult = UseCustomHookResult<
  Nullable<SelectedConditionMap>
>;

export function useInstillSelectedConditionMap(
  tree: Nullable<InstillFormTree>,
  initialValue: Nullable<GeneralRecord>
): UseInstillSelectedConditionMapResult {
  let initialConditionMap: Nullable<SelectedConditionMap> = {};

  if (tree && initialValue) {
    initialConditionMap = pickSelectedConditionMap({
      tree,
      initialValue,
    });
  } else {
    initialConditionMap = null;
  }

  const [selectedConditionMap, setSelectedConditionMap] =
    React.useState<Nullable<SelectedConditionMap>>(initialConditionMap);

  return [selectedConditionMap, setSelectedConditionMap];
}
