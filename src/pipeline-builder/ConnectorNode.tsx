import { Handle, NodeProps, Position } from "reactflow";
import { ConnectorNodeData } from "./type";
import { OpenAPIV3 } from "openapi-types";
import { ImageWithFallback, Nullable, dot } from "@instill-ai/toolkit";
import { Icons } from "@instill-ai/design-system";
import { usePipelineBuilderStore } from "./usePipelineBuilderStore";

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const updateSelectedConnectorNodeId = usePipelineBuilderStore(
    (state) => state.updateSelectedConnectorNodeId
  );

  let inputSchema: Nullable<OpenAPIV3.SchemaObject> = null;
  let outputSchema: Nullable<OpenAPIV3.SchemaObject> = null;
  let aiTaskNotSelected = false;

  switch (data.component.type) {
    case "COMPONENT_TYPE_CONNECTOR_BLOCKCHAIN":
      // Because right now blockchain connector doesn't have complicate category, so backend use
      // "default" as its spec key
      inputSchema = (
        (
          (
            data.component?.definition_detail?.spec.openapi_specifications
              .default.paths["/execute"]?.post
              ?.requestBody as OpenAPIV3.RequestBodyObject
          ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
        ).properties?.inputs as OpenAPIV3.ArraySchemaObject
      ).items as OpenAPIV3.SchemaObject;
      outputSchema = (
        (
          (
            (
              data.component?.definition_detail?.spec.openapi_specifications
                .default.paths["/execute"]?.post?.responses[
                "200"
              ] as OpenAPIV3.ResponseObject
            ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
          )["application/json"]?.schema as OpenAPIV3.SchemaObject
        ).properties?.outputs as OpenAPIV3.ArraySchemaObject
      ).items as OpenAPIV3.SchemaObject;
      break;
    case "COMPONENT_TYPE_CONNECTOR_AI":
      if (data.component.configuration.task) {
        inputSchema = (
          (
            (
              data.component?.definition_detail?.spec.openapi_specifications[
                data.component.configuration.task
              ].paths["/execute"]?.post
                ?.requestBody as OpenAPIV3.RequestBodyObject
            ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
          ).properties?.inputs as OpenAPIV3.ArraySchemaObject
        ).items as OpenAPIV3.SchemaObject;
        outputSchema = (
          (
            (
              (
                data.component?.definition_detail?.spec.openapi_specifications[
                  data.component.configuration.task
                ].paths["/execute"]?.post?.responses[
                  "200"
                ] as OpenAPIV3.ResponseObject
              ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
            )["application/json"]?.schema as OpenAPIV3.SchemaObject
          ).properties?.outputs as OpenAPIV3.ArraySchemaObject
        ).items as OpenAPIV3.SchemaObject;
      } else {
        aiTaskNotSelected = true;
      }
      break;
  }

  console.log(data.component);

  const allInputProperties = inputSchema ? getAllProperties(inputSchema) : [];
  const allOutputProperties = outputSchema
    ? getAllProperties(outputSchema)
    : [];

  return (
    <>
      <div
        onClick={() => {
          updateSelectedConnectorNodeId(() => id);
        }}
        className="flex flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-line px-3 py-2.5"
      >
        <div className="mb-1 flex flex-row gap-x-1">
          <ImageWithFallback
            src={`/icons/${data.component?.definition_detail?.vendor}/${data.component?.definition_detail?.icon}`}
            width={16}
            height={15}
            alt={`${data.component?.definition_detail?.title}-icon`}
            fallbackImg={
              <Icons.Box className="h-8 w-8 stroke-semantic-fg-primary" />
            }
          />
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            {data.component.resource_name.split("/")[1]}
          </p>
        </div>
        {aiTaskNotSelected ? (
          <div className="w-[232px] rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
            <p className="text-semantic-fg-primary product-body-text-3-regular">
              Please select AI task for this connector
            </p>
          </div>
        ) : null}
        {allInputProperties.length > 0 ? (
          <div className="mb-1 flex flex-col">
            <div className="mb-1 product-body-text-4-medium">Inputs</div>
            <div className="flex flex-col gap-y-1">
              {allInputProperties.map((property) => {
                const PropertyValue = property.path
                  ? dot.getter(data.component?.configuration, property.path)
                  : null;

                return (
                  <div
                    key={property.title ? property.title : property.path}
                    className="w-[232px] rounded-[6px] bg-semantic-bg-primary p-2"
                  >
                    <div className="flex flex-row gap-x-2">
                      <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
                        {property.title
                          ? property.title
                          : property.path?.split(".").pop()}
                      </p>
                      <p className="product-body-text-4-regular">
                        {PropertyValue}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
        {allOutputProperties.length > 0 ? (
          <div className="mb-1 flex flex-col">
            <div className="mb-1 product-body-text-4-medium">Outputs</div>
            <div className="flex flex-col gap-y-1">
              {allOutputProperties.map((property) => {
                return (
                  <div
                    key={property.title ? property.title : property.path}
                    className="w-[232px] rounded-[6px] bg-semantic-bg-primary p-2"
                  >
                    <div className="flex flex-row gap-x-2">
                      <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
                        {property.title
                          ? property.title
                          : property.path?.split(".").pop()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}
      </div>
      <Handle type="target" position={Position.Left} id={id} />
      <Handle type="source" position={Position.Right} id={id} />
    </>
  );
};

type ConnectorNodeProperty = OpenAPIV3.NonArraySchemaObject & { path?: string };

const getAllProperties = (
  schema: OpenAPIV3.SchemaObject,
  parentKey?: string,
  title?: string
) => {
  let allProperties: ConnectorNodeProperty[] = [];

  if (schema.type === "object") {
    if (schema.properties) {
      Object.entries(schema.properties as OpenAPIV3.SchemaObject).map(
        ([key, value]) => {
          const parentKeyList = parentKey ? parentKey.split(".") : [];

          allProperties = [
            ...allProperties,
            ...getAllProperties(value, [...parentKeyList, key].join(".")),
          ];
        }
      );
    }
  } else if (schema.type === "array") {
    allProperties = [
      ...allProperties,
      ...getAllProperties(
        schema.items as OpenAPIV3.SchemaObject,
        parentKey,
        schema.title
      ),
    ];
  } else {
    allProperties.push({
      path: parentKey,
      ...schema,
      title: title ? title : schema.title,
    });
  }

  return allProperties;
};
