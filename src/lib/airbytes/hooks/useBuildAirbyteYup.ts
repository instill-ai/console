import { Nullable } from "@/types/general";
import { useMemo } from "react";
import { AnySchema } from "yup";
import airbyteSchemaToYup from "../airbyteSchemaToYup";
import { AirbyteJsonSchema, SelectedItemMap } from "../types";

const useBuildAirbyteYup = (
  jsonSchema: Nullable<AirbyteJsonSchema>,
  selectedItemMap: Nullable<SelectedItemMap>,
  additionalSchema: Nullable<AnySchema>
): Nullable<AnySchema> => {
  const yup = useMemo(() => {
    if (!jsonSchema) return null;
    const airbyteSchema = airbyteSchemaToYup(jsonSchema, selectedItemMap);
    return additionalSchema
      ? airbyteSchema.concat(additionalSchema)
      : airbyteSchema;
  }, [jsonSchema, selectedItemMap]);

  return yup;
};

export default useBuildAirbyteYup;
