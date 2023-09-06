import cn from "clsx";
import { Node, NodeProps, Position } from "reactflow";
import { StartNodeData } from "../type";
import {
  Button,
  ComplicateIcons,
  Form,
  Icons,
  Input,
  Tag,
  useToast,
} from "@instill-ai/design-system";
import * as React from "react";

import { Nullable, useTriggerUserPipeline, useUser } from "@instill-ai/toolkit";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../usePipelineBuilderStore";
import {
  PipelineComponentReference,
  extractReferencesFromConfiguration,
 composeEdgesFromReferences } from "../lib";
import { shallow } from "zustand/shallow";
import { CustomHandle } from "./CustomHandle";
import { useStartOperatorTestModeInputForm } from "../use-node-input-fields";
import {
  StartNodeInputType,
  StartOperatorInputTypes,
} from "./StartNodeInputType";

export const CreateStartOperatorInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
});

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineId: state.pipelineId,
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  testModeEnabled: state.testModeEnabled,
  pipelineIsNew: state.pipelineIsNew,
  updateStartOperatorInputData: state.updateStartOperatorInputData,
});

export const StartNode = ({ data, id }: NodeProps<StartNodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [selectedType, setSelectedType] =
    React.useState<Nullable<StartOperatorInputTypes>>(null);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);

  const {
    pipelineId,
    nodes,
    updateNodes,
    updateEdges,
    testModeEnabled,
    updateStartOperatorInputData,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const { toast } = useToast();

  const createStartOperatorInputform = useForm<
    z.infer<typeof CreateStartOperatorInputSchema>
  >({
    resolver: zodResolver(CreateStartOperatorInputSchema),
  });

  const {
    Schema: StartOperatorTestModeInputSchema,
    fields: startOperatorTestModeInputfields,
    form: startOperatorTestModeInputForm,
  } = useStartOperatorTestModeInputForm({ nodes });

  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  const useTriggerPipeline = useTriggerUserPipeline();

  const onTestPipeline = (
    data: z.infer<typeof StartOperatorTestModeInputSchema>
  ) => {
    if (!user.isSuccess) return;

    useTriggerPipeline.mutate(
      {
        pipelineName: `${user.data.name}/pipelines/${pipelineId}`,
        accessToken: null,
        payload: {
          inputs: [data],
        },
      },
      {
        onSuccess: (data) => {
          console.log(data);
        },
      }
    );

    updateStartOperatorInputData(() => data);
  };

  const onSubmit = (
    formData: z.infer<typeof CreateStartOperatorInputSchema>
  ) => {
    if (!selectedType) return;

    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "start") {
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
                [formData.key]: {
                  type: selectedType,
                  title: formData.title,
                },
              },
            },
          },
        };
      }
      return node;
    });

    // updateNodes(() => {
    //   console.log("2");
    //   return newNodes;
    // });

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
    setSelectedType(null);
    setPrevFieldKey(null);
    createStartOperatorInputform.reset({
      title: "",
      key: "",
    });
  };

  const onDeleteField = (key: string) => {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "start") {
        delete node.data.component.configuration[key];

        node.data = {
          ...node.data,
        };
      }
      return node;
    });

    // updateNodes(() => {
    //   console.log("1");
    //   return newNodes;
    // });

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
  };

  const onEditField = (key: string) => {
    createStartOperatorInputform.reset({
      title: data.component.configuration.metadata[key].title,
      key: key,
    });
    setEnableEdit(true);
    setSelectedType(data.component.configuration.metadata[key].type);
  };

  return (
    <>
      <div className="relative flex min-w-[246px] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-line px-3 py-2.5">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Start
          </p>
          {enableEdit ? null : (
            <Icons.Edit05 className="my-auto h-3 w-3 stroke-semantic-fg-secondary" />
          )}
        </div>

        {enableEdit ? (
          <Form.Root {...createStartOperatorInputform}>
            <form
              onSubmit={createStartOperatorInputform.handleSubmit(onSubmit)}
            >
              <div className="mb-3 flex flex-row justify-between">
                <Icons.ArrowLeft
                  className="my-auto h-5 w-5 stroke-slate-500"
                  onClick={() => {
                    setEnableEdit(!enableEdit);
                    setSelectedType(null);
                    createStartOperatorInputform.reset();
                  }}
                />
                <div>
                  <Button variant="primary" type="submit" size="sm">
                    Save
                  </Button>
                </div>
              </div>
              <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-3">
                <StartNodeInputType
                  type="text"
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                />
                <StartNodeInputType
                  type="number"
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                />
                <StartNodeInputType
                  type="image"
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                />
                <StartNodeInputType
                  type="audio"
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                />
                <StartNodeInputType
                  type="boolean"
                  selectedType={selectedType}
                  setSelectedType={setSelectedType}
                />
              </div>
              <div
                className={cn(
                  selectedType ? "" : "hidden",
                  "flex flex-col space-y-3"
                )}
              >
                <Form.Field
                  control={createStartOperatorInputform.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <Form.Item>
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
                              placeholder="My prompt"
                            />
                          </Input.Root>
                        </Form.Control>
                        <Form.Message />
                      </Form.Item>
                    );
                  }}
                />
                <Form.Field
                  control={createStartOperatorInputform.control}
                  name="key"
                  render={({ field }) => {
                    return (
                      <Form.Item>
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
                              placeholder="text_prompt"
                            />
                          </Input.Root>
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
          <div className="flex flex-col">
            {testModeEnabled ? (
              <Form.Root {...startOperatorTestModeInputForm}>
                <form
                  className={cn(
                    "w-full",
                    startOperatorTestModeInputfields.length !== 0 ? "mb-3" : ""
                  )}
                  onSubmit={startOperatorTestModeInputForm.handleSubmit(
                    onTestPipeline
                  )}
                >
                  <div className="flex flex-col space-y-3">
                    {...startOperatorTestModeInputfields}
                  </div>
                  <div className="absolute left-[6px] top-0 -translate-y-[calc(100%+2px)]">
                    <Button
                      type="submit"
                      variant="secondaryGrey"
                      size="lg"
                      className="gap-x-2"
                    >
                      Run
                      <Icons.Play className="h-4 w-4 stroke-semantic-fg-primary" />
                    </Button>
                  </div>
                </form>
              </Form.Root>
            ) : (
              Object.entries(data.component.configuration.metadata).map(
                ([key, value]) => {
                  let icon: Nullable<React.ReactElement> = null;

                  switch (value.type) {
                    case "text": {
                      icon = (
                        <Icons.Type02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
                      );
                      break;
                    }
                    case "audio": {
                      icon = (
                        <Icons.Recording02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
                      );
                      break;
                    }
                    case "boolean": {
                      icon = (
                        <ComplicateIcons.ToggleLeft
                          fillAreaColor="fill-semantic-accent-on-bg"
                          className="m-auto h-4 w-4"
                        />
                      );
                      break;
                    }
                    case "image": {
                      icon = (
                        <Icons.Image01 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
                      );
                      break;
                    }
                    case "number": {
                      icon = (
                        <ComplicateIcons.Number
                          fillAreaColor="fill-semantic-accent-on-bg"
                          className="m-auto h-4 w-4"
                        />
                      );
                      break;
                    }
                    default:
                      break;
                  }

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
                        <Tag
                          className="gap-x-1.5"
                          variant="lightBlue"
                          size="md"
                        >
                          {icon}
                          {key}
                        </Tag>
                      </div>
                    </div>
                  );
                }
              )
            )}
            <Button
              className="flex w-full flex-1"
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
