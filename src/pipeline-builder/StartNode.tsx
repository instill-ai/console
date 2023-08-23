import cn from "clsx";
import { Handle, NodeProps, Position } from "reactflow";
import { StartNodeData } from "./type";
import {
  Button,
  ComplicateIcons,
  Form,
  Icons,
  Input,
  Tag,
} from "@instill-ai/design-system";
import * as React from "react";
import {
  StartNodeInputType,
  StartOperatorInputTypes,
} from "pipeline-builder/StartNodeInputType";
import { Nullable } from "@instill-ai/toolkit";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePipelineBuilderStore } from "./usePipelineBuilderStore";

export const CreateStartOperatorInputSchema = z.object({
  display_name: z.string(),
  key: z.string(),
});

export const StartNode = ({ data, id }: NodeProps<StartNodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [selectedType, setSelectedType] =
    React.useState<Nullable<StartOperatorInputTypes>>(null);
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);

  const updateNodes = usePipelineBuilderStore((state) => state.updateNodes);

  const form = useForm<z.infer<typeof CreateStartOperatorInputSchema>>({
    resolver: zodResolver(CreateStartOperatorInputSchema),
  });

  const onSubmit = (
    formData: z.infer<typeof CreateStartOperatorInputSchema>
  ) => {
    if (!selectedType) return;

    updateNodes((prev) => {
      return prev.map((node) => {
        if (node.data.nodeType === "start") {
          if (prevFieldKey) {
            delete node.data.component.configuration[prevFieldKey];
          }

          if (formData.key in node.data.component.configuration) {
            node.data.component.configuration[formData.key] = {
              type: selectedType,
              display_name: formData.display_name,
            };
          } else {
            node.data.component.configuration = {
              ...node.data.component.configuration,
              [formData.key]: {
                type: selectedType,
                display_name: formData.display_name,
              },
            };
          }
        }
        return node;
      });
    });

    setEnableEdit(false);
    setSelectedType(null);
    setPrevFieldKey(null);
    form.reset();
  };

  const onDeleteField = (key: string) => {
    updateNodes((prev) => {
      return prev.map((node) => {
        if (node.data.nodeType === "start") {
          const configuration = node.data.component.configuration;
          delete configuration[key];
        }
        return node;
      });
    });
  };

  const onEditField = (key: string) => {
    form.reset({
      display_name: data.component.configuration[key].display_name,
      key: key,
    });
    setEnableEdit(true);
    setSelectedType(data.component.configuration[key].type);
  };

  return (
    <>
      <div className="flex flex-col rounded-sm bg-semantic-bg-line px-3 py-2.5">
        <div className="mb-4 flex flex-row gap-x-1">
          <p className="text-semantic-fg-secondary product-body-text-4-medium">
            Start
          </p>
          {enableEdit ? null : (
            <Icons.Edit05 className="my-auto h-3 w-3 stroke-semantic-fg-secondary" />
          )}
        </div>

        {enableEdit ? (
          <div className="flex flex-col">
            <Form.Root {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="mb-3 flex flex-row justify-between">
                  <Icons.ArrowLeft
                    className="my-auto h-5 w-5 stroke-slate-500"
                    onClick={() => {
                      setEnableEdit(!enableEdit);
                      setSelectedType(null);
                      form.reset();
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
                    control={form.control}
                    name="display_name"
                    render={({ field }) => {
                      return (
                        <Form.Item>
                          <Form.Label className="!font-sans !text-base !font-semibold">
                            Display name
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
          </div>
        ) : (
          <div className="flex flex-col gap-y-4">
            {Object.entries(data.component.configuration).map(
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
                        {value.display_name}
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
                        {icon}
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
