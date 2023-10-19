import { ConnectorDefinition } from "../../vdp-sdk";
import { Nullable } from "../../type";
import * as React from "react";
import { transformAirbyteSchemaToAirbyteFormTree } from "../helpers/transformAirbyteSchemaToAirbyteFormTree";

export const useAirbyteFormTree = (
  definition: Nullable<ConnectorDefinition>
) => {
  const formTree = React.useMemo(() => {
    if (!definition) {
      return null;
    }

    const formTree = transformAirbyteSchemaToAirbyteFormTree(
      definition.spec.resource_specification
    );

    return formTree;
  }, [definition]);

  return formTree;
};
