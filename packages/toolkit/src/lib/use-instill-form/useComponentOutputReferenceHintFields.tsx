import * as React from "react";

import { InstillJSONSchema } from "./type";
import { Nullable } from "../type";
import { transformInstillJSONSchemaToFormTree } from "./transform";
import {
  PickComponentsFromReferenceHintsOptions,
  pickComponentsFromReferenceHints,
} from "./pick/pickComponentsFromReferenceHints";
import { transformInstillFormTreeToReferenceHints } from "./transform/transformInstillFormTreeToReferenceHints";

export type UseComponentOutputReferenceHintFieldsOptions = {
  componentID: string;
} & Pick<PickComponentsFromReferenceHintsOptions, "mode">;

export function useComponentOutputReferenceHintFields(
  schema: Nullable<InstillJSONSchema>,
  options?: UseComponentOutputReferenceHintFieldsOptions
) {
  const componentID = options?.componentID ?? undefined;
  const mode = options?.mode ?? "list";

  const fields = React.useMemo(() => {
    if (!schema) {
      return [];
    }

    const outputFormTree = transformInstillJSONSchemaToFormTree(schema);
    const hints = transformInstillFormTreeToReferenceHints(outputFormTree);
    const fields = pickComponentsFromReferenceHints(hints, {
      componentID,
      mode,
    });

    return fields;
  }, [schema, componentID, mode]);

  return fields;
}
