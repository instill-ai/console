import * as z from "zod";
import { NodeProps, Position } from "reactflow";
import { ConnectorNodeData } from "./type";
import { OpenAPIV3 } from "openapi-types";
import { ImageWithFallback, Nullable, dot } from "@instill-ai/toolkit";
import { Form, Icons, useToast } from "@instill-ai/design-system";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { useEffect, useMemo, useState } from "react";
import { shallow } from "zustand/shallow";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomHandle } from "./CustomHandle";

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  expandAllNodes: state.expandAllNodes,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
});

export const UpdatePipelineIdSchema = z.object({
  pipelineId: z.string().min(1, { message: "Title is required" }),
});

const UpdateNodeIdSchema = z.object({
  nodeId: z.string().min(1, { message: "Title is required" }),
});

export const ConnectorNode = ({ data, id }: NodeProps<ConnectorNodeData>) => {
  const {
    expandAllNodes,
    updateSelectedConnectorNodeId,
    updateNodes,
    updateEdges,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { toast } = useToast();

  const updateNodeIdForm = useForm<z.infer<typeof UpdateNodeIdSchema>>({
    resolver: zodResolver(UpdateNodeIdSchema),
    mode: "onBlur",
    defaultValues: {
      nodeId: id,
    },
  });

  const { reset } = updateNodeIdForm;

  useEffect(() => {
    reset({
      nodeId: id,
    });
  }, [id, reset]);

  const [exapndInputs, setExpandInputs] = useState(false);
  const [exapndOutputs, setExpandOutputs] = useState(false);

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

  useEffect(() => {
    setExpandInputs(expandAllNodes);
    setExpandOutputs(expandAllNodes);
  }, [expandAllNodes]);

  const inputProperties = inputSchema ? getAllProperties(inputSchema) : [];

  const collapsedInputProperties = useMemo(() => {
    if (exapndInputs) return inputProperties;
    return inputProperties.slice(0, 3);
  }, [exapndInputs, inputProperties]);

  const outputProperties = outputSchema ? getAllProperties(outputSchema) : [];

  const collapsedOutputProperties = useMemo(() => {
    if (exapndOutputs) return outputProperties;
    return outputProperties.slice(0, 3);
  }, [outputProperties, exapndOutputs]);

  function handleRenameNode(newNodeId: string) {
    if (newNodeId === id) return;

    updateEdges((prev) => {
      return prev.map((edge) => {
        // Find the edge that has this node as target
        if (edge.target === id) {
          return {
            ...edge,
            target: newNodeId,
          };
        }

        // Find the edge that has this node as source
        if (edge.source === id) {
          return {
            ...edge,
            source: newNodeId,
          };
        }

        return edge;
      });
    });

    updateNodes((prev) => {
      return prev.map((node) => {
        if (node.id === id && node.data.nodeType === "connector") {
          return {
            ...node,
            id: newNodeId,
            data: {
              ...node.data,
              component: {
                ...node.data.component,
                id: newNodeId,
              },
            },
          };
        }
        return node;
      });
    });

    updateSelectedConnectorNodeId(() => newNodeId);

    toast({
      title: "Successfully update node's name",
      variant: "alert-success",
      size: "small",
    });
  }

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
          <Form.Root {...updateNodeIdForm}>
            <form className="my-auto flex flex-1">
              <Form.Field
                control={updateNodeIdForm.control}
                name="nodeId"
                render={({ field }) => {
                  return (
                    <input
                      className="w-full bg-transparent p-1 text-semantic-fg-secondary product-body-text-4-medium focus:outline-none focus:ring-0"
                      {...field}
                      value={field.value}
                      type="text"
                      autoComplete="off"
                      onBlur={() => {
                        updateNodeIdForm.handleSubmit((data) => {
                          if (data.nodeId) {
                            handleRenameNode(data.nodeId);
                          }
                        })();
                      }}
                      onKeyDown={(e) => {
                        // Disable enter key to prevent default form submit behavior
                        if (e.key === "Enter") {
                          e.preventDefault();
                          updateNodeIdForm.handleSubmit((data) => {
                            if (data.nodeId) {
                              handleRenameNode(data.nodeId);
                            }
                          })();
                        }
                      }}
                    />
                  );
                }}
              />
            </form>
          </Form.Root>
        </div>
        {aiTaskNotSelected ? (
          <div className="w-[232px] rounded-sm border border-semantic-warning-default bg-semantic-warning-bg p-4">
            <p className="text-semantic-fg-primary product-body-text-3-regular">
              Please select AI task for this connector
            </p>
          </div>
        ) : null}
        {inputProperties.length > 0 ? (
          <div className="mb-1 flex flex-col">
            <div className="mb-1 product-body-text-4-medium">Inputs</div>
            <div className="mb-1 flex flex-col gap-y-1">
              {collapsedInputProperties.map((property) => {
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
            {inputProperties.length > 3 ? (
              <div className="flex flex-row-reverse">
                <button
                  onClick={() => setExpandInputs((prev) => !prev)}
                  className="text-semantic-accent-hover !underline product-body-text-4-medium"
                >
                  {exapndInputs ? "Less" : "More"}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
        {outputProperties.length > 0 ? (
          <div className="mb-1 flex flex-col">
            <div className="mb-1 product-body-text-4-medium">Outputs</div>
            <div className="mb-1 flex flex-col gap-y-1">
              {collapsedOutputProperties.map((property) => {
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
            {outputProperties.length > 3 ? (
              <div className="flex flex-row-reverse">
                <button
                  onClick={() => setExpandInputs((prev) => !prev)}
                  className="text-semantic-accent-hover !underline product-body-text-4-medium"
                >
                  {exapndInputs ? "Less" : "More"}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
      <CustomHandle type="target" position={Position.Left} id={id} />
      <CustomHandle type="source" position={Position.Right} id={id} />
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
