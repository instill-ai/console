import * as React from "react";

import { InstillJSONSchema } from "./type";
import { Nullable } from "../type";
import { transformInstillJSONSchemaToFormTree } from "./transform";
import { pickComponentsFromReferenceHints } from "./pick/pickComponentsFromReferenceHints";
import { transformInstillFormTreeToReferenceHints } from "./transform/transformInstillFormTreeToReferenceHints";

export type UseComponentOutputReferenceHintFieldsOptions = {
  componentID: string;
};

export function useComponentOutputReferenceHintFields(
  schema: Nullable<InstillJSONSchema>,
  options?: UseComponentOutputReferenceHintFieldsOptions
) {
  const componentID = options?.componentID ?? undefined;

  const fields = React.useMemo(() => {
    if (!schema) {
      return [];
    }

    const outputFormTree = transformInstillJSONSchemaToFormTree(schema);
    const hints = transformInstillFormTreeToReferenceHints(outputFormTree);
    const fields = pickComponentsFromReferenceHints(hints, { componentID });

    return fields;
  }, [schema, componentID]);

  return fields;
}
