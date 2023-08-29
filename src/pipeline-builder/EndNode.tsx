import { Handle, NodeProps, Position } from "reactflow";
import { EndNodeData } from "./type";
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
} from "./usePipelineBuilderStore";
import {
  ConfigurationReference,
  extractReferencesFromConfiguration,
} from "./extractReferencesFromConfiguration";
import { shallow } from "zustand/shallow";
import { composeEdgesFromReferences } from "./composeEdgesFromReferences";

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
});

export const EndNode = ({ data, id }: NodeProps<EndNodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);

  const { nodes, updateNodes, updateEdges } = usePipelineBuilderStore(
    pipelineBuilderSelector,
    shallow
  );

  const form = useForm<z.infer<typeof CreateEndOperatorInputSchema>>({
    resolver: zodResolver(CreateEndOperatorInputSchema),
  });

  const onSubmit = (formData: z.infer<typeof CreateEndOperatorInputSchema>) => {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "end") {
        if (prevFieldKey) {
          delete node.data.component.configuration.body[prevFieldKey];
        }

        node.data = {
          ...node.data,
          component: {
            ...node.data.component,
            configuration: {
              ...node.data.component.configuration,
              body: {
                ...node.data.component.configuration.body,
                [formData.key]: {
                  title: formData.title,
                  value: formData.value,
                },
              },
            },
          },
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: ConfigurationReference[] = [];

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

  const onDeleteField = (key: string) => {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "end") {
        delete node.data.component.configuration.body[key];

        node.data = {
          ...node.data,
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: ConfigurationReference[] = [];

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
  };

  const onEditField = (key: string) => {
    form.reset({
      title: data.component.configuration.body[key].title,
      value: data.component.configuration.body[key].value,
      key: key,
    });
    setEnableEdit(true);
  };

  return (
    <>
      <div className="flex flex-col rounded-sm bg-semantic-bg-line px-3 py-2.5">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            End
          </p>
          {enableEdit ? null : (
            <Icons.Edit05 className="my-auto h-3 w-3 stroke-semantic-fg-secondary" />
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
        ) : (
          <div className="flex flex-col gap-y-4">
            {Object.entries(data.component.configuration.body).map(
              ([key, value]) => {
                return (
                  <div key={key} className="flex flex-col">
                    <div className="mb-2 flex flex-row items-center justify-between">
                      <div className="my-auto font-sans text-base font-semibold text-semantic-fg-primary">
                        {value.title}
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
                      <Tag className="gap-x-1.5" variant="lightBlue" size="md">
                        {key}
                      </Tag>
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
      <Handle type="target" position={Position.Left} id={id} />
      <Handle type="source" position={Position.Right} id={id} />
    </>
  );
};
