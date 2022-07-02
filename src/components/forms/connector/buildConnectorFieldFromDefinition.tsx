import { ConnectorDefinition } from "@/lib/instill";
import { ProtectedBasicTextField } from "@instill-ai/design-system";
import { Dispatch, SetStateAction } from "react";

/* eslint-disable  @typescript-eslint/no-explicit-any */

export const buildConnectorFieldFromDefinition = (
  definition: ConnectorDefinition,
  state: Record<string, any>
  //stateCallback: SetStateAction<Dispatch<Record<string, any>>>
) => {
  const properties: Record<string, any> =
    definition.connector_definition.spec.connection_specification.properties;

  if (!properties) {
    throw new Error(
      `Definitition - ${definition.name} spec's properties is missing`
    );
  }

  let propertyList: Record<string, any>[] = [];

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

  propertyList = propertyList.sort((a, b) => {
    if (a.order && b.order) {
      return a.order - b.order;
    }

    if (a.order) {
      return a.order;
    }

    if (b.order) {
      return b.order;
    }

    return 0;
  });

  return (
    <>
      {propertyList.map((item) => {
        // protected text field
        if (item.type === "string" && item.airbyte_secret) {
          return (
            <ProtectedBasicTextField
              id={item.key}
              label={item.title}
              additionalMessageOnLabel={null}
              description={item.description}
              value={state[item.key]}
              error={null}
              disabled={true}
              readOnly={false}
              required={true}
              placeholder=""
              onChangeInput={() => {
                console.log("hi");
              }}
            />
          );
        }
      })}
    </>
  );
};
