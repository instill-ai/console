import cn from "clsx";
import * as React from "react";
import * as z from "zod";
import {
  Button,
  Checkbox,
  ComplicateIcons,
  Form,
  Icons,
  Input,
  Tag,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";

import { StartNodeInputType } from "../StartNodeInputType";
import {
  InstillStore,
  Nullable,
  StartOperatorInput,
  StartOperatorInputType,
  useInstillStore,
} from "../../../../lib";
import { PipelineComponentReference, StartNodeData } from "../../type";
import {
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
} from "../../lib";

export const Schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  key: z.string().min(1, { message: "Key is required" }),
});

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  isOwner: store.isOwner,
  currentVersion: store.currentVersion,
});

export const StartNodeInputForm = ({ data }: { data: StartNodeData }) => {
  const {
    nodes,
    updateNodes,
    updateEdges,
    updatePipelineRecipeIsDirty,
    isOwner,
    currentVersion,
  } = useInstillStore(useShallow(selector));

  const [enableEdit, setEnableEdit] = React.useState(false);
  const [selectedType, setSelectedType] =
    React.useState<Nullable<StartOperatorInputType>>(null);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);
  const [inputTypeIsArray, setInputTypeIsArray] = React.useState(false);

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  const onCreateInput = (formData: z.infer<typeof Schema>) => {
    if (!selectedType) return;
    let configuraton: Nullable<StartOperatorInput> = null;

    if (inputTypeIsArray) {
      switch (selectedType) {
        case "string": {
          configuraton = {
            type: "array",
            items: {
              type: "string",
            },
            instillFormat: "array:string",
            title: formData.title,
          };
          break;
        }
        case "audio": {
          configuraton = {
            type: "array",
            items: {
              type: "string",
            },
            instillFormat: "array:audio/*",
            title: formData.title,
          };
          break;
        }
        case "boolean": {
          configuraton = {
            type: "array",
            items: {
              type: "boolean",
            },
            instillFormat: "array:boolean",
            title: formData.title,
          };
          break;
        }
        case "image": {
          configuraton = {
            type: "array",
            items: {
              type: "string",
            },
            instillFormat: "array:image/*",
            title: formData.title,
          };
          break;
        }
        case "number": {
          configuraton = {
            type: "array",
            items: {
              type: "number",
            },
            instillFormat: "array:number",
            title: formData.title,
          };
          break;
        }
      }
    } else {
      switch (selectedType) {
        case "string": {
          configuraton = {
            type: "string",
            instillFormat: "string",
            title: formData.title,
          };
          break;
        }
        case "audio": {
          configuraton = {
            type: "string",
            instillFormat: "audio/*",
            title: formData.title,
          };
          break;
        }
        case "boolean": {
          configuraton = {
            type: "boolean",
            instillFormat: "boolean",
            title: formData.title,
          };
          break;
        }
        case "image": {
          configuraton = {
            type: "string",
            instillFormat: "image/*",
            title: formData.title,
          };
          break;
        }
        case "number": {
          configuraton = {
            type: "number",
            instillFormat: "number",
            title: formData.title,
          };
          break;
        }
      }
    }

    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "start" && configuraton) {
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
                [formData.key]: configuraton,
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
    setInputTypeIsArray(false);
    updatePipelineRecipeIsDirty(() => true);
    form.reset({
      title: "",
      key: "",
    });
  };

  const onDeleteInput = (key: string) => {
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
    updatePipelineRecipeIsDirty(() => true);
  };

  function pickSelectedTypeFromInstillFormat(
    instillFormat: string
  ): Nullable<StartOperatorInputType> {
    switch (instillFormat) {
      case "string":
      case "array:string": {
        return "string";
      }
      case "audio":
      case "array:audio/*": {
        return "audio";
      }
      case "boolean":
      case "array:boolean": {
        return "boolean";
      }
      case "image":
      case "array:image/*": {
        return "image";
      }
      case "number":
      case "array:number": {
        return "number";
      }

      default:
        return null;
    }
  }

  const onEditInput = (key: string) => {
    form.reset({
      title: data.component.configuration.metadata[key].title,
      key: key,
    });
    setEnableEdit(true);
    setInputTypeIsArray(
      data.component.configuration.metadata[key].type === "array"
    );

    setSelectedType(
      pickSelectedTypeFromInstillFormat(
        data.component.configuration.metadata[key].instillFormat
      )
    );
  };

  return enableEdit ? (
    <Form.Root {...form}>
      <form onSubmit={form.handleSubmit(onCreateInput)}>
        <div className="mb-3 flex flex-row justify-between">
          <Button
            variant="tertiaryGrey"
            size="sm"
            className="!px-2 !py-2"
            type="button"
            onClick={() => {
              setEnableEdit(!enableEdit);
              setSelectedType(null);
              setPrevFieldKey(null);
              form.reset({
                title: "",
                key: "",
              });
              setInputTypeIsArray(false);
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
        <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-3">
          <StartNodeInputType
            type="string"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "string") {
                setSelectedType(null);
              } else {
                setSelectedType("string");
              }
              setInputTypeIsArray(false);
            }}
          />
          <StartNodeInputType
            type="number"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "number") {
                setSelectedType(null);
              } else {
                setSelectedType("number");
              }
              setInputTypeIsArray(false);
            }}
          />
          <StartNodeInputType
            type="image"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "image") {
                setSelectedType(null);
              } else {
                setSelectedType("image");
              }
              setInputTypeIsArray(false);
            }}
          />
          <StartNodeInputType
            type="audio"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "audio") {
                setSelectedType(null);
              } else {
                setSelectedType("audio");
              }
              setInputTypeIsArray(false);
            }}
          />
          <StartNodeInputType
            type="boolean"
            selectedType={selectedType}
            onSelect={() => {
              if (selectedType === "boolean") {
                setSelectedType(null);
              } else {
                setSelectedType("boolean");
              }
              setInputTypeIsArray(false);
            }}
          />
        </div>
        {["number", "image", "string", "audio"].includes(selectedType ?? "") ? (
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
            control={form.control}
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
            control={form.control}
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
    <div className="flex flex-col space-y-3">
      {Object.entries(data.component.configuration.metadata).map(
        ([key, value]) => {
          let icon: Nullable<React.ReactElement> = null;
          let label: Nullable<string> = null;

          switch (value.instillFormat) {
            case "string": {
              icon = (
                <Icons.Type02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
              );
              label = "text";

              break;
            }
            case "array:string": {
              icon = (
                <Icons.Type02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
              );
              label = "text_array";

              break;
            }
            case "audio": {
              icon = (
                <Icons.Recording02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
              );
              label = "audio";
              break;
            }
            case "array:audio/*": {
              icon = (
                <Icons.Recording02 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
              );
              label = "audio_array";
              break;
            }
            case "boolean": {
              icon = (
                <ComplicateIcons.ToggleLeft
                  fillAreaColor="fill-semantic-accent-on-bg"
                  className="m-auto h-4 w-4"
                />
              );
              label = "boolean";
              break;
            }
            case "array:boolean": {
              icon = (
                <ComplicateIcons.ToggleLeft
                  fillAreaColor="fill-semantic-accent-on-bg"
                  className="m-auto h-4 w-4"
                />
              );
              label = "boolean_array";
              break;
            }
            case "image": {
              icon = (
                <Icons.Image01 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
              );
              label = "image";
              break;
            }
            case "array:image/*": {
              icon = (
                <Icons.Image01 className="m-auto h-4 w-4 stroke-semantic-accent-on-bg" />
              );
              label = "image_array";
              break;
            }
            case "number": {
              icon = (
                <ComplicateIcons.Number
                  fillAreaColor="fill-semantic-accent-on-bg"
                  className="m-auto h-4 w-4"
                />
              );
              label = "number";
              break;
            }
            case "array:number": {
              icon = (
                <ComplicateIcons.Number
                  fillAreaColor="fill-semantic-accent-on-bg"
                  className="m-auto h-4 w-4"
                />
              );
              label = "number_array";
              break;
            }
            default:
              break;
          }

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
                        onEditInput(key);
                        setPrevFieldKey(key);
                      }}
                      disabled={false}
                    >
                      <Icons.Edit03 className="h-6 w-6 stroke-semantic-accent-on-bg" />
                    </button>
                    <button onClick={() => onDeleteInput(key)} disabled={false}>
                      <Icons.Trash01 className="h-6 w-6 stroke-semantic-error-on-bg" />
                    </button>
                  </div>
                ) : null}
              </div>
              <div>
                <Tag className="gap-x-1.5" variant="lightBlue" size="md">
                  {icon}
                  {label}
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
        disabled={isOwner ? (currentVersion === "latest" ? false : true) : true}
        type="button"
      >
        <p className="my-auto">Add Field</p>
        <Icons.Plus
          className={cn(
            "my-auto h-4 w-4 stroke-semantic-bg-primary",
            currentVersion === "latest"
              ? "stroke-semantic-bg-primary"
              : "stroke-semantic-fg-secondary"
          )}
        />
      </Button>
    </div>
  );
};
