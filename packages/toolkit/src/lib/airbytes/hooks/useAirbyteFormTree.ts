import * as React from "react";

import { Nullable } from "../../type";
import { ConnectorDefinition } from "../../vdp-sdk";
import { transformAirbyteSchemaToAirbyteFormTree } from "../helpers/transformAirbyteSchemaToAirbyteFormTree";

export const useAirbyteFormTree = (
  definition: Nullable<ConnectorDefinition>,
) => {
  const formTree = React.useMemo(() => {
    if (!definition) {
      return null;
    }

    const formTree = transformAirbyteSchemaToAirbyteFormTree(
      definition.spec.resourceSpecification,
    );

    return formTree;
  }, [definition]);

  return formTree;
};
