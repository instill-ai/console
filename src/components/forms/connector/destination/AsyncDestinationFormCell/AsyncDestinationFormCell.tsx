import { FC, useState, useMemo, Fragment } from "react";
import {
  BasicSingleSelect,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { useDestinationDefinitions } from "@/services/connector";

/* eslint-disable  @typescript-eslint/no-explicit-any */

export type AsyncDestinationFormCellProps = Record<string, any>;

export type AsyncDestinationFormCellState = Record<string, any> & {
  destinationDefinition: string;
};

const AsyncDestinationFormCell: FC<AsyncDestinationFormCellProps> = () => {
  const [cellState, setCellState] = useState<AsyncDestinationFormCellState>();

  const destinationDefinitions = useDestinationDefinitions();

  const destinationOptions = useMemo(() => {
    if (!destinationDefinitions.isSuccess) return [];

    const options: SingleSelectOption[] = [];

    for (const definition of destinationDefinitions.data) {
      options.push({
        label: definition.id,
        value: definition.name,
      });
    }

    return options;
  }, [destinationDefinitions.isSuccess, destinationDefinitions.data]);

  const selectedDestinationOption = useMemo(() => {
    if (!cellState?.destinationDefinition || !destinationOptions) return null;
    return (
      destinationOptions.find(
        (e) => e.value === cellState.destinationDefinition
      ) || null
    );
  }, [cellState?.destinationDefinition, destinationOptions]);

  const selectedDestinationProperties = useMemo(() => {
    if (!selectedDestinationOption || !destinationDefinitions.isSuccess) {
      return null;
    }

    const selectedDestination = destinationDefinitions.data.find(
      (e) => e.name === selectedDestinationOption.value
    );

    if (!selectedDestination) {
      return null;
    }

    const properties =
      selectedDestination.connector_definition.spec.connection_specification;

    const propertyList = [];

    for (const [key, value] of Object.entries(properties)) {
      propertyList.push({
        ...value,
        type: value.type,
        description: value.description,
        order: value.order,
        tutle: value.title,
        key: key,
      });
    }
  }, [selectedDestinationOption]);

  return (
    <Fragment>
      <BasicSingleSelect
        id="destinationDefinition"
        instanceId="destinationDefinition"
        menuPlacement="auto"
        label="Destination type"
        additionalMessageOnLabel={null}
        description={null}
        disabled={false}
        readOnly={false}
        required={false}
        error={null}
        value={selectedDestinationOption}
        options={destinationOptions}
        onChangeInput={(_, option) => {
          console.log(option);
          setCellState((prev) => {
            return {
              ...prev,
              destinationDefinition: option.value,
            };
          });
        }}
      />
    </Fragment>
  );
};

export default AsyncDestinationFormCell;
