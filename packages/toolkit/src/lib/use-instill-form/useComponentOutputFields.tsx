import * as React from "react";
import { pickComponentOutputFieldsFromInstillFormTree } from "./pick/pickComponentOutputFieldsFromInstillFormTree";
import { InstillJSONSchema } from "./type";
import {
  PipelineConnectorComponent,
  PipelineTrace,
  TriggerUserPipelineResponse,
} from "../vdp-sdk";
import { getConnectorInputOutputSchema } from "../../view";
import { Nullable } from "../type";
import { transformInstillJSONSchemaToFormTree } from "./transform";

export function useComponentOutputFields(
  schema: Nullable<InstillJSONSchema>,
  trace: Nullable<PipelineTrace>,
  nodeType: "end" | "connector"
) {
  const fields = React.useMemo(() => {
    if (!schema) {
      return null;
    }

    const outputFormTree = transformInstillJSONSchemaToFormTree(schema);

    const fields = pickComponentOutputFieldsFromInstillFormTree(
      outputFormTree,
      trace,
      nodeType
    );

    if (nodeType === "end") {
      console.log("fields", fields, outputFormTree, schema, trace);
    }

    return fields;
  }, [schema, trace, nodeType]);

  return fields;
}
