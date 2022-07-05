import { Nullable } from "@/types/general";
import { useMemo } from "react";
import airbyteSchemaToYup from "../airbyteSchemaToYup";
import { AirbyteJsonSchema, SelectedItemMap } from "../types";

const useBuildYup = (
  jsonSchema: Nullable<AirbyteJsonSchema>,
  selectedItemMap: Nullable<SelectedItemMap>
) => {
  const yup = useMemo(() => {
    if (!jsonSchema) return null;
    return airbyteSchemaToYup(jsonSchema, selectedItemMap);
  }, [jsonSchema, selectedItemMap]);

  return yup;
};

export default useBuildYup;
