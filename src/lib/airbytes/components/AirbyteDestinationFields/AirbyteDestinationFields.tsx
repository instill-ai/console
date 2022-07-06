import { ConnectorDefinition } from "@/lib/instill";
import { Dispatch, FC, Fragment, SetStateAction, useMemo } from "react";
import { airbyteSchemaToAirbyteFormTree } from "../../airbyteSchemaToAirbyteFormTree";
import {
  AirbyteFormErrors,
  AirbyteFormValues,
  SelectedItemMap,
} from "../../types";
import useBuildForm from "../../hooks/useBuildForm";
import { Nullable } from "@/types/general";

export type AirbyteDestinationFieldsProps = {
  fieldValues: AirbyteFormValues;
  setFieldValues: Dispatch<SetStateAction<AirbyteFormValues>>;
  fieldErrors: AirbyteFormErrors;
  selectedDestinationDefinition: Nullable<ConnectorDefinition>;
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>;
};

const AirbyteDestinationFields: FC<AirbyteDestinationFieldsProps> = ({
  fieldValues,
  setFieldValues,
  fieldErrors,
  selectedDestinationDefinition,
  setSelectedConditionMap,
}) => {
  const selectedDestinationFormTree = useMemo(() => {
    if (!selectedDestinationDefinition) {
      return null;
    }

    const formTree = airbyteSchemaToAirbyteFormTree(
      selectedDestinationDefinition.connector_definition.spec
        .connection_specification
    );

    return formTree;
  }, [selectedDestinationDefinition]);

  const fields = useBuildForm(
    selectedDestinationFormTree,
    false,
    fieldValues,
    setFieldValues,
    fieldErrors,
    setSelectedConditionMap
  );

  return <Fragment>{fields}</Fragment>;
};

export default AirbyteDestinationFields;
