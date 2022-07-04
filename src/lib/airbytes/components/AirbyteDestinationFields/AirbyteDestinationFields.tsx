import { ConnectorDefinition } from "@/lib/instill";
import { Dispatch, FC, Fragment, SetStateAction, useMemo } from "react";
import { airbyteSchemaToAirbyteFormTree } from "../../airbyteSchemaToAirbyteFormTree";
import { AirbyteFormErrors, AirbyteFormValues } from "../../types";
import useBuildForm from "../../hooks/useBuildForm";

export type AirbyteDestinationFieldsProps = {
  fieldValues: AirbyteFormValues;
  setFieldValues: Dispatch<SetStateAction<AirbyteFormValues>>;
  fieldErrors: AirbyteFormErrors;
  setFieldErrors: Dispatch<SetStateAction<AirbyteFormErrors>>;
  selectedDestinationDefinition: ConnectorDefinition;
};

const AirbyteDestinationFields: FC<AirbyteDestinationFieldsProps> = ({
  fieldValues,
  setFieldValues,
  fieldErrors,
  setFieldErrors,
  selectedDestinationDefinition,
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
    fieldErrors
  );

  return <Fragment>{fields}</Fragment>;
};

export default AirbyteDestinationFields;
