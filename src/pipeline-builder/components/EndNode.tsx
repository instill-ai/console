import { NodeProps, Position } from "reactflow";
import { EndNodeData } from "../type";
import {
  Button,
  Form,
  Icons,
  Input,
  Tag,
  Textarea,
} from "@instill-ai/design-system";
import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Nullable } from "@instill-ai/toolkit";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import {
  PipelineComponentReference,
  extractReferencesFromConfiguration,
  extractPipelineComponentReferenceFromString,
  composeEdgesFromReferences,
} from "../lib";
import { shallow } from "zustand/shallow";
import { CustomHandle } from "./CustomHandle";
import { useEndOperatorTestModeOutputFields } from "pipeline-builder/use-node-output-fields";

export const CreateEndOperatorInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
  value: z.string().min(1, { message: "Value is required" }),
});

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  edges: state.edges,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  testModeEnabled: state.testModeEnabled,
  testModeTriggerResponse: state.testModeTriggerResponse,
  pipelineOpenAPISchema: state.pipelineOpenAPISchema,
});

export const EndNode = ({ data, id }: NodeProps<EndNodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);

  const {
    nodes,
    updateNodes,
    updateEdges,
    testModeEnabled,
    testModeTriggerResponse,
    pipelineOpenAPISchema,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const form = useForm<z.infer<typeof CreateEndOperatorInputSchema>>({
    resolver: zodResolver(CreateEndOperatorInputSchema),
  });

  const onSubmit = (formData: z.infer<typeof CreateEndOperatorInputSchema>) => {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "end") {
        if (prevFieldKey) {
          delete node.data.component.configuration.metadata[prevFieldKey];
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
  }

  function onEditField(key: string) {
    form.reset({
      title: data.component.configuration.metadata[key].title,
      value: data.component.configuration.input[key],
      key: key,
    });
    setEnableEdit(true);
  }

  const testModeOutputFields = useEndOperatorTestModeOutputFields(
    pipelineOpenAPISchema,
    testModeTriggerResponse ? testModeTriggerResponse.outputs : []
  );

  return (
    <>
      <div className="flex flex-col rounded-sm bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            End
          </p>
          {enableEdit ? null : (
            <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-fg-secondary" />
          )}
        </div>

        {enableEdit ? (
          <Form.Root {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3 flex flex-row justify-between">
                <Icons.ArrowLeft
                  className="my-auto h-5 w-5 stroke-slate-500"
                  onClick={() => {
                    setEnableEdit(!enableEdit);
                    form.reset();
                  }}
                />
                <div>
                  <Button variant="primary" type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </div>
              <div className="flex flex-col space-y-3">
                <Form.Field
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-[318px]">
                        <Form.Label className="!font-sans !text-base !font-semibold">
                          Title
                        </Form.Label>
                        <Form.Control className="h-8">
                          <Input.Root className="!px-[9px] !py-1.5">
                            <Input.Core
                              {...field}
                              type="text"
                              value={field.value ?? ""}
                              autoComplete="off"
                              className="!h-5 !text-sm"
                              placeholder="Prompt"
                            />
                          </Input.Root>
                        </Form.Control>
                        <Form.Message />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="key"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-[318px]">
                        <Form.Label className="!font-sans !text-base !font-semibold">
                          Key
                        </Form.Label>
                        <Form.Control className="h-8">
                          <Input.Root className="!px-[9px] !py-1.5">
                            <Input.Core
                              {...field}
                              type="text"
                              value={field.value ?? ""}
                              autoComplete="off"
                              className="!h-5 !text-sm"
                              placeholder="prompt"
                            />
                          </Input.Root>
                        </Form.Control>
                        <Form.Message />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={form.control}
                  name="value"
                  render={({ field }) => {
                    return (
                      <Form.Item className="w-[318px]">
                        <Form.Label className="!font-sans !text-base !font-semibold">
                          Value
                        </Form.Label>
                        <Form.Control>
                          <Textarea
                            {...field}
                            value={field.value ?? ""}
                            autoComplete="off"
                            className="!h-[72px] resize-none !text-sm"
                            placeholder="Hello world. This is a bot. Hello world. This is a bot. Hello world. This is a bot  {{ openai.prompt }}, {{ start.prompt }}"
                          />
                        </Form.Control>
                        <Form.Message />
                      </Form.Item>
                    );
                  }}
                />
              </div>
            </form>
          </Form.Root>
        ) : testModeEnabled ? (
          <>
            <div className="flex min-w-[200px] flex-col gap-y-4">
              {testModeOutputFields}
            </div>
          </>
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
              className="flex w-[232px]"
              variant="primary"
              onClick={() => setEnableEdit(!enableEdit)}
            >
              Add Field
              <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
            </Button>
          </div>
        )}
      </div>
      <CustomHandle type="target" position={Position.Left} id={id} />
      <CustomHandle type="source" position={Position.Right} id={id} />
    </>
  );
};
