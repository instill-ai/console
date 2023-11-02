import * as z from "zod";
import * as React from "react";
import {
  Button,
  Form,
  Icons,
  Input,
  Textarea,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useShallow } from "zustand/react/shallow";

import {
  GeneralRecord,
  InstillStore,
  Nullable,
  PipelineConnectorComponent,
  useInstillStore,
} from "../../../../lib";
import { PipelineComponentReference } from "../../type";
import {
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
} from "../../lib";

export const Schema = z.object({
  key: z.string().min(1, { message: "Key is required" }),
  value: z.string().min(1, { message: "Value is required" }),
});

const selector = (store: InstillStore) => ({
  testModeEnabled: store.testModeEnabled,
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export const DataConnectorFreeForm = ({
  enableEdit,
  setEnableEdit,
  nodeID,
  component,
  dataTaskNotSelected,
}: {
  enableEdit: boolean;
  setEnableEdit: React.Dispatch<React.SetStateAction<boolean>>;
  nodeID: string;
  component: PipelineConnectorComponent;
  dataTaskNotSelected: boolean;
}) => {
  const [prevFieldKey, setPrevFieldKey] =
    React.useState<Nullable<string>>(null);

  const form = useForm<z.infer<typeof Schema>>({
    resolver: zodResolver(Schema),
  });

  const {
    testModeEnabled,
    nodes,
    updateNodes,
    updateEdges,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  function onSubmitDataConnectorInput(formData: z.infer<typeof Schema>) {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "connector" && node.id === nodeID) {
        if (prevFieldKey) {
          delete node.data.component.configuration.input.data[prevFieldKey];
        }

        node.data = {
          ...node.data,
          component: {
            ...node.data.component,
            configuration: {
              ...node.data.component.configuration,
              input: {
                ...node.data.component.configuration.input,
                data: {
                  ...node.data.component.configuration.input.data,
                  [formData.key]: formData.value,
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

    updatePipelineRecipeIsDirty(() => true);

    setEnableEdit(false);
    setPrevFieldKey(null);
    form.reset({
      value: "",
      key: "",
    });
  }

  function onEditDataConnectorInput(key: string) {
    form.reset({
      value: component.configuration.input.data[key],
      key: key,
    });
    setEnableEdit(true);
  }

  function onDeleteDataConnectorInput(key: string) {
    const newNodes = nodes.map((node) => {
      if (node.data.nodeType === "connector" && node.id === nodeID) {
        delete node.data.component.configuration.input.data[key];
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
    updatePipelineRecipeIsDirty(() => true);
    updateEdges(() => newEdges);
  }

  if (testModeEnabled) {
    return (
      <div className="mb-3 flex flex-col space-y-3">
        {component.configuration?.input?.data
          ? Object.entries(
              component.configuration.input.data as Record<string, string>
            ).map(([key, value]) => {
              return (
                <div
                  key={key}
                  className="flex flex-row flex-wrap justify-between gap-x-2 gap-y-2  rounded-[6px] bg-semantic-bg-primary p-2"
                >
                  <p className="my-auto text-semantic-fg-secondary product-body-text-4-semibold">
                    {key}
                  </p>
                  <div className="min-h-[32px] min-w-[100px] break-all rounded-sm border border-semantic-bg-line px-2 py-1.5 text-semantic-fg-secondary product-body-text-3-regular">
                    {value}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    );
  }

  if (enableEdit) {
    return (
      <Form.Root {...form}>
        <form onSubmit={form.handleSubmit(onSubmitDataConnectorInput)}>
          <div className="mb-3 flex flex-row justify-between">
            <Button
              variant="tertiaryGrey"
              size="sm"
              className="!px-2 !py-2"
              type="button"
              onClick={() => {
                form.reset({
                  value: "",
                  key: "",
                });
                setEnableEdit(!enableEdit);
                setPrevFieldKey(null);
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
          <div className="mb-3 flex flex-col space-y-3">
            <Form.Field
              control={form.control}
              name="key"
              render={({ field }) => {
                return (
                  <Form.Item className="w-full">
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
                  <Form.Item className="w-full">
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
    );
  }

  return (
    <div className="mb-3 flex flex-col">
      <div className="mb-3 flex flex-col space-y-4">
        {component.configuration?.input?.data
          ? Object.entries(
              component.configuration.input.data as GeneralRecord
            ).map(([key]) => {
              return (
                <div key={key} className="flex flex-col">
                  <div className="flex flex-row items-center justify-between">
                    <div className="my-auto flex flex-col gap-y-1">
                      <p className="my-auto text-semantic-fg-primary product-body-text-3-semibold">
                        {key}
                      </p>
                    </div>
                    <div className="my-auto flex flex-row gap-x-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onEditDataConnectorInput(key);
                          setPrevFieldKey(key);
                        }}
                      >
                        <Icons.Edit03 className="h-6 w-6 stroke-semantic-accent-on-bg" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteDataConnectorInput(key);
                        }}
                      >
                        <Icons.Trash01 className="h-6 w-6 stroke-semantic-error-on-bg" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          : null}
      </div>
      {dataTaskNotSelected ? null : (
        <Button
          className="flex w-full"
          variant="primary"
          onClick={(e) => {
            e.stopPropagation();
            setEnableEdit(!enableEdit);
          }}
        >
          Add Field
          <Icons.Plus className="my-auto h-5 w-5 stroke-semantic-bg-primary " />
        </Button>
      )}
    </div>
  );
};
