import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { NodeProps, Position } from "reactflow";
import { Button, Form, Icons, Tag } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";

import { EndNodeData, PipelineComponentReference } from "../type";
import {
  extractReferencesFromConfiguration,
  extractPipelineComponentReferenceFromString,
  composeEdgesFromReferences,
} from "../lib";
import { CustomHandle } from "./CustomHandle";
import {
  InstillJSONSchema,
  InstillStore,
  Nullable,
  useComponentOutputFields,
  useInstillForm,
  useInstillStore,
} from "../../../lib";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  edges: store.edges,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  testModeEnabled: store.testModeEnabled,
  testModeTriggerResponse: store.testModeTriggerResponse,
  pipelineOpenAPIOutputSchema: store.pipelineOpenAPIOutputSchema,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

const CreateEndOperatorInputSchema: InstillJSONSchema = {
  title: "End node operator intput schema",
  type: "object",
  required: ["title", "key", "value"],
  properties: {
    title: {
      instillAcceptFormats: ["string"],
      anyOf: [
        {
          type: "string",
          instillUpstreamType: "value",
        },
      ],
      instillUpstreamTypes: ["value"],
      title: "Title",
    },
    key: {
      instillAcceptFormats: ["string"],
      anyOf: [
        {
          type: "string",
          instillUpstreamType: "value",
          pattern: "^[a-z]([a-z0-9-]{0,61}[a-z0-9])?$",
          instillPatternErrorMessage:
            "The key should be lowercase without any space or special character besides the hyphen, and should be less than 63 characters.",
        },
      ],
      instillUpstreamTypes: ["value"],
      title: "Key",
    },
    value: {
      instillAcceptFormats: ["*/*"],
      anyOf: [
        {
          instillUpstreamType: "value",
          type: "string",
          maximum: 2048,
        },
        {
          instillUpstreamType: "reference",
          pattern: "^\\{.*\\}$",
          type: "string",
        },
        {
          instillUpstreamType: "template",
          type: "string",
        },
      ],
      instillUiMultiline: true,
      instillUpstreamTypes: ["value", "reference", "template"],
      title: "Value",
    },
  },
};

export const EndNode = ({ data, id }: NodeProps<EndNodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);

  const {
    nodes,
    edges,
    updateNodes,
    updateEdges,
    testModeEnabled,
    testModeTriggerResponse,
    pipelineOpenAPIOutputSchema,
    updatePipelineRecipeIsDirty,
    isOwner,
    currentVersion,
  } = useInstillStore(useShallow(selector));

  const { form, fields, ValidatorSchema } = useInstillForm(
    CreateEndOperatorInputSchema,
    null,
    {
      enableSmartHint: true,
      chooseTitleFrom: "title",
    }
  );

  const onSubmit = (formData: z.infer<typeof ValidatorSchema>) => {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "end") {
        if (prevFieldKey) {
          delete node.data.component.configuration.metadata[prevFieldKey];
          delete node.data.component.configuration.input[prevFieldKey];
        }

        node.data = {
          ...node.data,
          component: {
            ...node.data.component,
            configuration: {
              ...node.data.component.configuration,
              metadata: {
                ...node.data.component.configuration.metadata,
                [formData.key]: {
                  title: formData.title,
                },
              },
              input: {
                ...node.data.component.configuration.input,
                [formData.key]: formData.value,
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
    updatePipelineRecipeIsDirty(() => true);

    setEnableEdit(false);
    setPrevFieldKey(null);
    form.reset({
      title: "",
      value: "",
      key: "",
    });
  };

  function onDeleteField(key: string) {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "end") {
        delete node.data.component.configuration.metadata[key];
        delete node.data.component.configuration.input[key];

        node.data = {
          ...node.data,
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
    updatePipelineRecipeIsDirty(() => true);
  }

  function onEditField(key: string) {
    form.reset({
      title: data.component.configuration.metadata[key].title,
      value: data.component.configuration.input[key],
      key: key,
    });
    setEnableEdit(true);
  }

  const testModeOutputFields = useComponentOutputFields({
    schema: pipelineOpenAPIOutputSchema,
    data: testModeTriggerResponse?.outputs ?? null,
    nodeType: "end",
    chooseTitleFrom: "title",
  });

  const hasTargetEdges = React.useMemo(() => {
    return edges.some((edge) => edge.target === id);
  }, [edges, id]);

  return (
    <React.Fragment>
      <div className="flex w-[var(--pipeline-builder-node-available-width)] flex-col rounded-sm bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            end
          </p>
        </div>

        {enableEdit ? (
          <Form.Root {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3 flex flex-row justify-between">
                <Button
                  variant="tertiaryGrey"
                  size="sm"
                  className="!px-2 !py-2"
                  type="button"
                  onClick={() => {
                    setEnableEdit(!enableEdit);
                    setPrevFieldKey(null);
                    form.reset({
                      title: "",
                      key: "",
                      value: "",
                    });
                  }}
                >
                  <Icons.ArrowLeft className="m-auto h-4 w-4 stroke-semantic-fg-secondary" />
                </Button>
                <div>
                  <Button variant="primary" type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </div>
              <div className="flex flex-col space-y-3">{fields}</div>
            </form>
          </Form.Root>
        ) : testModeEnabled ? (
          <div className="flex w-full flex-col gap-y-4">
            {testModeOutputFields}
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            {Object.entries(data.component.configuration.input).map(
              ([key, value]) => {
                const reference = extractPipelineComponentReferenceFromString({
                  key,
                  value: value,
                  currentPath: [],
                  nodeId: "end",
                });

                return (
                  <div key={key} className="flex flex-col">
                    <div className="mb-2 flex flex-row items-center justify-between">
                      <div className="my-auto font-sans text-base font-semibold text-semantic-fg-primary">
                        {key}
                      </div>
                      {currentVersion === "latest" && isOwner ? (
                        <div className="my-auto flex flex-row gap-x-4">
                          <button
                            onClick={() => {
                              onEditField(key);
                              setPrevFieldKey(key);
                            }}
                          >
                            <Icons.Edit03 className="h-6 w-6 stroke-semantic-accent-on-bg" />
                          </button>
                          <button onClick={() => onDeleteField(key)}>
                            <Icons.Trash01 className="h-6 w-6 stroke-semantic-error-on-bg" />
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <div>
                      {reference?.type === "singleCurlyBrace" ? (
                        <Tag
                          className="gap-x-1.5"
                          variant="lightBlue"
                          size="md"
                        >
                          {reference.referenceValue.withoutCurlyBraces}
                        </Tag>
                      ) : (
                        reference?.referenceValues.map((referenceValue) => (
                          <Tag
                            key={referenceValue.withCurlyBraces}
                            className="gap-x-1.5"
                            variant="lightBlue"
                            size="md"
                          >
                            {referenceValue.withoutCurlyBraces}
                          </Tag>
                        ))
                      )}
                    </div>
                  </div>
                );
              }
            )}
            <Button
              className="flex w-full"
              variant="primary"
              onClick={() => setEnableEdit(!enableEdit)}
              disabled={
                isOwner ? (currentVersion === "latest" ? false : true) : true
              }
            >
              <p className="my-auto">Add Field</p>
              <Icons.Plus
                className={cn(
                  "my-auto h-4 w-4",
                  currentVersion === "latest"
                    ? "stroke-semantic-bg-primary"
                    : "stroke-semantic-fg-secondary"
                )}
              />
            </Button>
          </div>
        )}
      </div>
      <CustomHandle
        className={hasTargetEdges ? "" : "!opacity-0"}
        type="target"
        position={Position.Left}
        id={id}
      />
    </React.Fragment>
  );
};
