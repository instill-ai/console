import { Nullable } from "../../type";
import * as React from "react";
import { AnySchema } from "yup";
import { transformAirbyteSchemaToYup } from "../helpers";
import { AirbyteJsonSchema, SelectedItemMap } from "../types";

export const useBuildAirbyteYup = (
  jsonSchema: Nullable<AirbyteJsonSchema>,
  selectedItemMap: Nullable<SelectedItemMap>,
  additionalSchema: Nullable<AnySchema>
): Nullable<AnySchema> => {
  const yup = React.useMemo(() => {
    if (!jsonSchema) return null;
    const airbyteSchema = transformAirbyteSchemaToYup(
      jsonSchema,
      selectedItemMap
    );
    return additionalSchema
      ? airbyteSchema.concat(additionalSchema)
      : airbyteSchema;
  }, [jsonSchema, selectedItemMap, additionalSchema]);

  return yup;
};
