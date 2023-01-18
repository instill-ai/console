import { ConnectorDefinition } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useMemo } from "react";
import { transformAirbyteSchemaToAirbyteFormTree } from "../helpers/transformAirbyteSchemaToAirbyteFormTree";

export const useAirbyteFormTree = (
  definition: Nullable<ConnectorDefinition>
) => {
  const formTree = useMemo(() => {
    if (!definition) {
      return null;
    }

    const formTree = transformAirbyteSchemaToAirbyteFormTree(
      definition.connector_definition.spec.connection_specification
    );

    return formTree;
  }, [definition]);

  return formTree;
};
