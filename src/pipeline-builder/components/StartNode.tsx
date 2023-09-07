import cn from "clsx";
import { Node, NodeProps, Position } from "reactflow";
import {
  StartNodeData,
  StartOperatorInputSingularType,
  StartOperatorInputType,
} from "../type";
import {
  Button,
  Checkbox,
  ComplicateIcons,
  Form,
  Icons,
  Input,
  Tag,
  useToast,
} from "@instill-ai/design-system";
import * as React from "react";

import {
  Nullable,
  getInstillApiErrorMessage,
  useTriggerUserPipeline,
  useUser,
} from "@instill-ai/toolkit";
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
  composeEdgesFromReferences,
  recursivelyReplaceNullAndEmptyStringWithUndefined,
  recursivelyRemoveUndefinedAndNullFromArray,
  recursiveParseToInt,
} from "../lib";
import { shallow } from "zustand/shallow";
import { CustomHandle } from "./CustomHandle";
import { useStartOperatorTestModeInputForm } from "../use-node-input-fields";
import { StartNodeInputType } from "./StartNodeInputType";
import { isAxiosError } from "axios";

export const CreateStartOperatorInputSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
});

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  pipelineId: state.pipelineId,
  pipelineIsNew: state.pipelineIsNew,
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  testModeEnabled: state.testModeEnabled,
  updateTestModeTriggerResponse: state.updateTestModeTriggerResponse,
});

export const StartNode = ({ data, id }: NodeProps<StartNodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [selectedType, setSelectedType] =
    React.useState<Nullable<StartOperatorInputSingularType>>(null);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);
  const [isTriggering, setIsTriggering] = React.useState(false);
  const [inputTypeIsArray, setInputTypeIsArray] = React.useState(false);

  const {
    pipelineId,
    nodes,
    updateNodes,
    updateEdges,
    testModeEnabled,
    updateTestModeTriggerResponse,
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

  const {
    formState: { errors },
  } = startOperatorTestModeInputForm;

  React.useEffect(() => {
    console.log(errors);
  }, [errors]);

  const useTriggerPipeline = useTriggerUserPipeline();

  const onTriggerPipeline = (
    data: z.infer<typeof StartOperatorTestModeInputSchema>
  ) => {
    if (!user.isSuccess) return;

    const input = recursivelyRemoveUndefinedAndNullFromArray(
      recursivelyReplaceNullAndEmptyStringWithUndefined(
        recursiveParseToInt(data)
      )
    );

    setIsTriggering(true);

    useTriggerPipeline.mutate(
      {
        pipelineName: `${user.data.name}/pipelines/${pipelineId}`,
        accessToken: null,
        payload: {
          inputs: [input],
        },
        returnTraces: true,
      },
      {
        onSuccess: (data) => {
          setIsTriggering(false);
          updateTestModeTriggerResponse(() => data);
        },
        onError: (error) => {
          setIsTriggering(false);
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when trigger the pipeline",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when trigger the pipeline",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
        },
      }
    );
  };

  const onSubmit = (
    formData: z.infer<typeof CreateStartOperatorInputSchema>
  ) => {
    if (!selectedType) return;

    let finalType: StartOperatorInputType = selectedType;

    if (inputTypeIsArray) {
      switch (selectedType) {
        case "text": {
          finalType = "text_array";
          break;
        }
        case "audio": {
          finalType = "audio_array";
          break;
        }
        case "boolean": {
          finalType = "boolean_array";
          break;
        }
        case "image": {
          finalType = "image_array";
          break;
        }
        case "number": {
          finalType = "number_array";
          break;
        }
      }
    }

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
                ...node.data.component.configuration.metadata,
                [formData.key]: {
                  type: finalType,
                  title: formData.title,
                },
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
  };

  const onEditField = (key: string) => {
    createStartOperatorInputform.reset({
      title: data.component.configuration.metadata[key].title,
      key: key,
    });
    setEnableEdit(true);
    setSelectedType(() => {
      let finalType = data.component.configuration.metadata[key].type;

      switch (finalType) {
        case "text_array": {
          finalType = "text";
          setInputTypeIsArray(true);
          break;
        }
        case "audio_array": {
          finalType = "audio";
          setInputTypeIsArray(true);
          break;
        }
        case "boolean_array": {
          finalType = "boolean";
          setInputTypeIsArray(true);
          break;
        }
        case "image_array": {
          finalType = "image";
          setInputTypeIsArray(true);
          break;
        }
        case "number_array": {
          finalType = "number";
          setInputTypeIsArray(true);
          break;
        }
      }

      return finalType;
    });
  };

  return (
    <>
      <div className="relative flex min-w-[246px] flex-col rounded-sm border-2 border-semantic-bg-primary bg-semantic-bg-base-bg px-3 py-2.5 shadow-md hover:shadow-lg">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Start
          </p>
          {enableEdit ? null : (
            <Icons.Edit03 className="my-auto h-3 w-3 stroke-semantic-fg-secondary" />
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
              {["number", "image", "text", "audio"].includes(
                selectedType ?? ""
              ) ? (
                <div className="mb-3 flex flex-row space-x-3">
                  <Checkbox
                    checked={inputTypeIsArray}
                    onCheckedChange={(e) => {
                      if (typeof e === "boolean") {
                        setInputTypeIsArray(e);
                      }
                    }}
                    id="is_array"
                    className="my-auto h-4 w-4"
                  />
                  <div className="grid gap-1.5 leading-none">
                    <label
                      htmlFor="is_array"
                      className="text-semantic-fg-primary product-body-text-4-semibold"
                    >
                      Convert selected type to array
                    </label>
                  </div>
                </div>
              ) : null}
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
                  className="w-full"
                  onSubmit={startOperatorTestModeInputForm.handleSubmit(
                    onTriggerPipeline
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
                      {isTriggering ? (
                        <svg
                          className="m-auto h-4 w-4 animate-spin text-semantic-fg-secondary"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                      ) : (
                        <Icons.Play className="h-4 w-4 stroke-semantic-fg-primary" />
                      )}
                    </Button>
                  </div>
                </form>
              </Form.Root>
            ) : (
              <div className="flex flex-col space-y-3">
                {Object.entries(data.component.configuration.metadata).map(
                  ([key, value]) => {
                    let icon: Nullable<React.ReactElement> = null;

                    switch (value.type) {
                      case "text":
                      case "text_array": {
                        icon = (
                          <Icons.Type02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
                        );
                        break;
                      }
                      case "audio":
                      case "audio_array": {
                        icon = (
                          <Icons.Recording02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
                        );
                        break;
                      }
                      case "boolean":
                      case "boolean_array": {
                        icon = (
                          <ComplicateIcons.ToggleLeft
                            fillAreaColor="fill-semantic-accent-on-bg"
                            className="m-auto h-4 w-4"
                          />
                        );
                        break;
                      }
                      case "image":
                      case "image_array": {
                        icon = (
                          <Icons.Image01 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
                        );
                        break;
                      }
                      case "number":
                      case "number_array": {
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
                            {value.type}
                          </Tag>
                        </div>
                      </div>
                    );
                  }
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
        )}
      </div>
      <CustomHandle type="target" position={Position.Left} id={id} />
      <CustomHandle type="source" position={Position.Right} id={id} />
    </>
  );
};
