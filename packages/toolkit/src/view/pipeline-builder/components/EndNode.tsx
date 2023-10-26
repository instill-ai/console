import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { shallow } from "zustand/shallow";
import { NodeProps, Position } from "reactflow";
import {
  Button,
  Form,
  Icons,
  Input,
  Tag,
  Textarea,
} from "@instill-ai/design-system";

import { EndNodeData, PipelineComponentReference } from "../type";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import {
  extractReferencesFromConfiguration,
  extractPipelineComponentReferenceFromString,
  composeEdgesFromReferences,
} from "../lib";
import { CustomHandle } from "./CustomHandle";
import { Nullable } from "../../../lib";
import { useEndOperatorTestModeOutputFields } from "../use-node-output-fields";

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
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
  isOwner: state.isOwner,
  currentVersion: state.currentVersion,
});

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
    pipelineOpenAPISchema,
    updatePipelineRecipeIsDirty,
    isOwner,
    currentVersion,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const form = useForm<z.infer<typeof CreateEndOperatorInputSchema>>({
    resolver: zodResolver(CreateEndOperatorInputSchema),
  });

  const onSubmit = (formData: z.infer<typeof CreateEndOperatorInputSchema>) => {
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

  const testModeOutputFields = useEndOperatorTestModeOutputFields(
    pipelineOpenAPISchema,
    testModeTriggerResponse ? testModeTriggerResponse.outputs : []
  );

  const hasTargetEdges = React.useMemo(() => {
    return edges.some((edge) => edge.target === id);
  }, [edges, id]);

  return (
    <>
      <div className="flex flex-col rounded-sm bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg">
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
              className="flex w-[232px]"
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
    </>
  );
};
