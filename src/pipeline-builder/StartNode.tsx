import { Handle, NodeProps, Position } from "reactflow";
import { NodeData } from "./type";
import { Button, Form, Icons, Input } from "@instill-ai/design-system";
import * as React from "react";
import {
  StartNodeInputType,
  StartOperatorInputTypes,
} from "pipeline-builder/StartNodeInputType";
import { Nullable } from "@instill-ai/toolkit";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const CreateStartOperatorInputSchema = z.object({
  displayed_name: z.string(),
  key: z.string(),
});

export const StartNode = ({ data, id }: NodeProps<NodeData>) => {
  const [enableEdit, setEnableEdit] = React.useState(false);
  const [selectedType, setSelectedType] =
    React.useState<Nullable<StartOperatorInputTypes>>(null);

  const form = useForm<z.infer<typeof CreateStartOperatorInputSchema>>({
    resolver: zodResolver(CreateStartOperatorInputSchema),
  });

  const onSubmit = (data: z.infer<typeof CreateStartOperatorInputSchema>) => {
    console.log(data);
  };

  return (
    <>
      <div className="flex flex-col rounded-sm bg-semantic-bg-line px-2 py-2.5">
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
            <div className="mb-3 flex flex-row justify-between">
              <div>
                <Icons.ArrowLeft
                  className="my-auto h-5 w-5 stroke-slate-500"
                  onClick={() => setEnableEdit(!enableEdit)}
                />
              </div>
              <div>
                <Button
                  variant="primary"
                  onClick={() => setEnableEdit(!enableEdit)}
                  size="sm"
                >
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
            <div className={selectedType ? "" : "hidden"}>
              <Form.Root {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="flex flex-col space-y-3">
                    <Form.Field
                      control={form.control}
                      name="displayed_name"
                      render={({ field }) => {
                        return (
                          <Form.Item>
                            <Form.Label>Display name</Form.Label>
                            <Form.Control>
                              <Input.Root>
                                <Input.Core
                                  {...field}
                                  type="text"
                                  value={field.value ?? ""}
                                  autoComplete="off"
                                  className="!h-5"
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
                            <Form.Label>Key</Form.Label>
                            <Form.Control>
                              <Input.Root>
                                <Input.Core
                                  {...field}
                                  type="text"
                                  value={field.value ?? ""}
                                  autoComplete="off"
                                  className="!h-5"
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
          </div>
        ) : (
          <Button
            className="flex w-[232px]"
            variant="primary"
            onClick={() => setEnableEdit(!enableEdit)}
          >
            Add Field
            <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
          </Button>
        )}
      </div>
      <Handle type="target" position={Position.Left} id={id} />
      <Handle type="source" position={Position.Right} id={id} />
    </>
  );
};
