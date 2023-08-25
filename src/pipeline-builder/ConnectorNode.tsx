import { Handle, NodeProps, Position } from "reactflow";
import { ConnectorNodeData, NodeData } from "./type";
import { OpenAPIV3 } from "openapi-types";
import { dot } from "@instill-ai/toolkit";
import { Tag } from "@instill-ai/design-system";
import { usePipelineBuilderStore } from "./usePipelineBuilderStore";

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const inputSchema = (
    (
      (
        data.component?.definition_detail?.spec.openapi_specifications.default
          .paths["/execute"]?.post?.requestBody as OpenAPIV3.RequestBodyObject
      ).content["application/json"]?.schema as OpenAPIV3.SchemaObject
    ).properties?.inputs as OpenAPIV3.ArraySchemaObject
  ).items as OpenAPIV3.SchemaObject;

  const outputSchema = (
    (
      (
        (
          data.component?.definition_detail?.spec.openapi_specifications.default
            .paths["/execute"]?.post?.responses[
            "200"
          ] as OpenAPIV3.ResponseObject
        ).content as { [key: string]: OpenAPIV3.MediaTypeObject }
      )["application/json"]?.schema as OpenAPIV3.SchemaObject
    ).properties?.outputs as OpenAPIV3.ArraySchemaObject
  ).items as OpenAPIV3.SchemaObject;

  const allInputProperties = getAllProperties(inputSchema);

  const allOutputProperties = getAllProperties(outputSchema);

  const updateSelectedConnectorNodeId = usePipelineBuilderStore(
    (state) => state.updateSelectedConnectorNodeId
  );

  return (
    <>
      <div
        onClick={() => {
          updateSelectedConnectorNodeId(() => id);
        }}
        className="flex flex-col rounded-sm bg-semantic-bg-line px-3 py-2.5"
      >
        <div className="mb-1 flex flex-col">
          <div className="mb-1 product-body-text-4-medium">Inputs</div>
          <div className="flex flex-col gap-y-1">
            {allInputProperties.map((property) => {
              const PropertyValue = property.path
                ? dot.getter(data.component?.configuration, property.path)
                : null;

              return (
                <div
                  key={property.title}
                  className="w-[232px] rounded-[6px] bg-semantic-bg-primary p-2"
                >
                  <div className="flex flex-row gap-x-2">
                    <p className="text-semantic-fg-secondary product-body-text-4-semibold">
                      {property.title}
                    </p>
                    <p>{PropertyValue}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mb-1 flex flex-col">
          <div className="mb-1 product-body-text-4-medium">Outputs</div>
          <div className="flex flex-col gap-y-1">
            {allOutputProperties.map((property) => {
              return (
                <div
                  key={property.title}
                  className="w-[232px] rounded-[6px] bg-semantic-bg-primary p-2"
                >
                  <div className="flex flex-row gap-x-2">
                    <p className="text-semantic-fg-secondary product-body-text-4-semibold">
                      {property.title}
                    </p>
                    <Tag variant="lightBlue" size="md">
                      {property.path}
                    </Tag>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
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
