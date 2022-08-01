import { ConnectorDefinition } from "@/lib/instill";
import { Nullable } from "@/types/general";
import { useMemo } from "react";
import { airbyteSchemaToAirbyteFormTree } from "../airbyteSchemaToAirbyteFormTree";

const useAirbyteFormTree = (definition: Nullable<ConnectorDefinition>) => {
  const formTree = useMemo(() => {
    if (!definition) {
      return null;
    }

    const formTree = airbyteSchemaToAirbyteFormTree(
      definition.connector_definition.spec.connection_specification
    );

    return formTree;
  }, [definition]);

  return formTree;
};

export default useAirbyteFormTree;
