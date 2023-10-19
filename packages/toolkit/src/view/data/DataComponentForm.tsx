import * as z from "zod";
import * as React from "react";
import { GeneralRecord } from "../../lib";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Input, Select, Switch } from "@instill-ai/design-system";
import {
  PipelineBuilderStore,
  PipelineComponentReference,
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
  recursiveReplaceNullAndEmptyStringWithUndefined,
  recursiveTransformToString,
  usePipelineBuilderStore,
  validateIntillUpstreamTypes,
} from "../pipeline-builder";
import { shallow } from "zustand/shallow";

export const DataResourceSchema = z
  .object({
    connector_definition_name: z.string(),
    task: z.string(),

    input: z.object({
      // Google cloud storage
      object_name: z.string().nullable().optional(),
      data: z.string().nullable().optional(),

      // Pinecone - general
      id: z.string().nullable().optional(),

      // Pinecone - TASK_QUERY
      namespace: z.string().nullable().optional(),
      top_k: z.string().nullable().optional(),
      include_values: z.boolean().nullable().optional(),
      include_metadata: z.boolean().nullable().optional(),
      vector: z.string().nullable().optional(),

      // Pinecone - TASK_UPSERT
      values: z.string().nullable().optional(),
    }),
  })
  .superRefine((state, ctx) => {
    if (
      state.connector_definition_name === "connector-definitions/data-pinecone"
    ) {
      if (state.task === "TASK_QUERY") {
        if (!state.input.top_k) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "top_k is required",
            path: ["input.top_k"],
          });
        } else {
          const result = validateIntillUpstreamTypes({
            type: "reference_and_number",
            value: state.input.top_k,
          });

          if (!result.isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: result.error,
              path: ["input.top_k"],
            });
          }
        }

        if (state.input.namespace) {
          const result = validateIntillUpstreamTypes({
            type: "reference_and_string",
            value: state.input.namespace,
          });

          if (!result.isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: result.error,
              path: ["input.namespace"],
            });
          }
        }

        if (state.input.vector) {
          const result = validateIntillUpstreamTypes({
            type: "reference",
            value: state.input.vector,
          });

          if (!result.isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: result.error,
              path: ["input.vector"],
            });
          }
        }

        if (state.input.id) {
          const result = validateIntillUpstreamTypes({
            type: "reference",
            value: state.input.id,
          });

          if (!result.isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: result.error,
              path: ["input.id"],
            });
          }
        }
      }

      if (state.task === "TASK_UPSERT") {
        if (!state.input.values) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "values is required",
            path: ["input.values"],
          });
        } else {
          const result = validateIntillUpstreamTypes({
            type: "reference",
            value: state.input.values,
          });

          if (!result.isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: result.error,
              path: ["input.values"],
            });
          }
        }

        if (state.input.id) {
          const result = validateIntillUpstreamTypes({
            type: "reference",
            value: state.input.id,
          });

          if (!result.isValid) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: result.error,
              path: ["id"],
            });
          }
        }
      }
    }

    if (state.connector_definition_name === "connector-definitions/data-gcs") {
      if (!state.input.object_name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "object_name is required",
          path: ["input.object_name"],
        });
      } else {
        const result = validateIntillUpstreamTypes({
          type: "reference_and_string",
          value: state.input.object_name,
        });

        if (!result.isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: result.error,
            path: ["input.object_name"],
          });
        }
      }

      if (!state.input.data) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "data is required",
          path: ["input.data"],
        });
      } else {
        const result = validateIntillUpstreamTypes({
          type: "reference_and_string",
          value: state.input.data,
        });

        if (!result.isValid) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: result.error,
            path: ["input.data"],
          });
        }
      }
    }
  });

export type DataComponentFormProps = {
  disabledAll?: boolean;
  connectorDefinitionName: string;
  configuration: GeneralRecord;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
});

export const DataComponentForm = ({
  disabledAll,
  connectorDefinitionName,
  configuration,
}: DataComponentFormProps) => {
  const {
    nodes,
    updateNodes,
    updateEdges,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    updatePipelineRecipeIsDirty,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const form = useForm<z.infer<typeof DataResourceSchema>>({
    resolver: zodResolver(DataResourceSchema),
    defaultValues: {
      ...configuration,
      connector_definition_name: connectorDefinitionName,
      input: configuration.input ? configuration.input : {},
      task: configuration.task
        ? configuration.task
        : connectorDefinitionName === "connector-definitions/data-gcs"
        ? "TASK_UPLOAD"
        : "",
    },
  });

  const { reset, watch } = form;

  React.useEffect(() => {
    reset({
      ...configuration,
      connector_definition_name: connectorDefinitionName,
      input: configuration.input ? configuration.input : {},
    });
  }, [configuration, connectorDefinitionName, reset]);

  function onSubmit(data: z.infer<typeof DataResourceSchema>) {
    if (!selectedConnectorNodeId) return;
    const modifiedData = recursiveReplaceNullAndEmptyStringWithUndefined(
      recursiveTransformToString(data)
    );

    const newNodes = nodes.map((node) => {
      if (
        node.id === selectedConnectorNodeId &&
        node.data.nodeType === "connector"
      ) {
        return {
          ...node,
          data: {
            ...node.data,
            component: {
              ...node.data.component,
              configuration: {
                ...modifiedData,
                connector_definition_name: undefined,
              },
            },
          },
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: PipelineComponentReference[] = [];

    newNodes.forEach((node) => {
      if (node.data.component?.configuration) {
        allReferences.push(
          ...extractReferencesFromConfiguration(
            node.data.component?.configuration,
            node.id
          )
        );
      }
    });

    const newEdges = composeEdgesFromReferences(allReferences, newNodes);

    updateEdges(() => newEdges);
    updateSelectedConnectorNodeId(() => null);
    updatePipelineRecipeIsDirty(() => true);
  }

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex w-full flex-col space-y-5">
          <Form.Field
            control={form.control}
            name="input.object_name"
            render={({ field }) => {
              const display =
                connectorDefinitionName === "connector-definitions/data-gcs";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>object_name *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    The name of the object to be created.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.data"
            render={({ field }) => {
              const display =
                connectorDefinitionName === "connector-definitions/data-gcs";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>data *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    The data to be saved in the object.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="task"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                "connector-definitions/data-pinecone";

              const tasks = [
                {
                  label: "Query",
                  value: "TASK_QUERY",
                },
                {
                  label: "Upsert",
                  value: "TASK_UPSERT",
                },
              ];

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>Task *</Form.Label>
                  <Select.Root
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={disabledAll}
                  >
                    <Form.Control>
                      <Select.Trigger className="w-full">
                        <Select.Value />
                      </Select.Trigger>
                    </Form.Control>
                    <Select.Content>
                      {tasks.map((task) => (
                        <Select.Item
                          className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                          key={task.label}
                          value={task.value}
                        >
                          <div className="flex flex-row gap-x-2">
                            <p className="my-auto">{task.label}</p>
                          </div>
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Form.Description>AI task type.</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="input.id"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                "connector-definitions/data-pinecone";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>id</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    {watch("task") === "TASK_QUERY"
                      ? "The unique ID of the vector to be used as a query vector"
                      : "The id of the matched vector"}
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.namespace"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                  "connector-definitions/data-pinecone" &&
                watch("task") === "TASK_QUERY";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>namespace</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>The namespace to query.</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.top_k"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                  "connector-definitions/data-pinecone" &&
                watch("task") === "TASK_QUERY";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>top_k *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>The namespace to query.</Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.include_values"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                  "connector-definitions/data-pinecone" &&
                watch("task") === "TASK_QUERY";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>include_values</Form.Label>
                  <Form.Control>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                  <Form.Description>
                    Indicates whether vector values are included in the
                    response.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.include_metadata"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                  "connector-definitions/data-pinecone" &&
                watch("task") === "TASK_QUERY";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>include_metadata</Form.Label>
                  <Form.Control>
                    <Switch
                      checked={field.value ?? false}
                      onCheckedChange={field.onChange}
                    />
                  </Form.Control>
                  <Form.Description>
                    Indicates whether metadata is included in the response as
                    well as the ids.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.vector"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                  "connector-definitions/data-pinecone" &&
                watch("task") === "TASK_QUERY";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>vector</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    An array of dimensions for the query vector.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.values"
            render={({ field }) => {
              const display =
                connectorDefinitionName ===
                  "connector-definitions/data-pinecone" &&
                watch("task") === "TASK_UPSERT";

              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>values</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    An array of dimensions for the vector to be saved.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
        <div className="flex w-full flex-row-reverse gap-x-4">
          <Button
            type="submit"
            variant="secondaryColour"
            size="lg"
            className="gap-x-2"
          >
            Save
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
