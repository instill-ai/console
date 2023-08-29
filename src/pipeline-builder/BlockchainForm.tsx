import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { shallow } from "zustand/shallow";

import { Button, Form, Input, Select } from "@instill-ai/design-system";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "./usePipelineBuilderStore";
import { useEffect } from "react";
import {
  ConfigurationReference,
  extractReferencesFromConfiguration,
} from "./extractReferencesFromConfiguration";
import { composeEdgesFromReferences } from "./composeEdgesFromReferences";

export const BlockchainFormSchema = z.object({
  images: z.string().nullable(),
  asset_creator: z.string().nullable(),
  abstract: z.string().nullable(),
  custom: z
    .object({
      digital_source_type: z.string().nullable(),
      mining_preference: z.string().nullable(),
      generated_through: z.string().nullable(),
      generated_by: z.string().nullable(),
      creator_wallet: z.string().nullable(),
      license: z.object({
        name: z.string().nullable(),
        document: z.string().nullable(),
      }),
    })
    .nullable(),
});

export type BlockchainFormProps = {
  disabledAll?: boolean;
  configuration: Record<string, any>;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
});

export const BlockchainForm = (props: BlockchainFormProps) => {
  const { disabledAll, configuration } = props;

  const { nodes, updateNodes, updateEdges, selectedConnectorNodeId } =
    usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const form = useForm<z.infer<typeof BlockchainFormSchema>>({
    resolver: zodResolver(BlockchainFormSchema),
    defaultValues: {
      ...configuration,
      images: undefined,
      custom: {
        digital_source_type: "trainedAlgorithmicMedia",
        mining_preference: "notAllowed",
      },
    },
  });

  const { reset } = form;

  useEffect(() => {
    reset(configuration);
  }, [configuration, reset]);

  function onSubmit(data: z.infer<typeof BlockchainFormSchema>) {
    const newNodes = nodes.map((node) => {
      if (
        node.id === selectedConnectorNodeId &&
        node.data.nodeType === "connector"
      ) {
        return {
          ...node,
          data: {
            ...node.data,
            component: {
              ...node.data.component,
              configuration: data,
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
  }

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex flex-col space-y-5">
          <Form.Field
            control={form.control}
            name="images"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>Images *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
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
            name="asset_creator"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>Asset Creator</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
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
            name="abstract"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>Abstract</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll ? disabledAll : false}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <div className="flex flex-col gap-y-5 rounded-sm border border-semantic-bg-line p-5">
            <p className="text-semantic-fg-secondary product-body-text-2-semibold">
              Custom
            </p>
            <Form.Field
              control={form.control}
              name="custom.digital_source_type"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Digital Source Type</Form.Label>
                    <Select.Root
                      onValueChange={field.onChange}
                      disabled={disabledAll}
                      value={field.value ?? undefined}
                    >
                      <Form.Control>
                        <Select.Trigger className="w-full">
                          <Select.Value placeholder="Select an Digital Source Type" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        <Select.Item
                          key="trainedAlgorithmicMedia"
                          value="trainedAlgorithmicMedia"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">trainedAlgorithmicMedia</p>
                        </Select.Item>
                        <Select.Item
                          key="trainedAlgorithmicData"
                          value="trainedAlgorithmicData"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">trainedAlgorithmicData</p>
                        </Select.Item>
                        <Select.Item
                          key="digitalCapture"
                          value="digitalCapture"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">digitalCapture</p>
                        </Select.Item>
                        <Select.Item
                          key="digitalArt"
                          value="digitalArt"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">digitalArt</p>
                        </Select.Item>
                        <Select.Item
                          key="algorithmicMedia"
                          value="algorithmicMedia"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">algorithmicMedia</p>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                    <Form.Description>
                      Select a blockchain connector type.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <Form.Field
              control={form.control}
              name="custom.mining_preference"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Mining Preference</Form.Label>
                    <Select.Root
                      onValueChange={field.onChange}
                      disabled={disabledAll}
                      value={field.value ?? undefined}
                    >
                      <Form.Control>
                        <Select.Trigger className="w-full">
                          <Select.Value placeholder="Select an Mining Preference" />
                        </Select.Trigger>
                      </Form.Control>
                      <Select.Content>
                        <Select.Item
                          key="dataMining"
                          value="dataMining"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">dataMining</p>
                        </Select.Item>
                        <Select.Item
                          key="aiInference"
                          value="aiInference"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">aiInference</p>
                        </Select.Item>
                        <Select.Item
                          key="notAllowed"
                          value="notAllowed"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">notAllowed</p>
                        </Select.Item>
                        <Select.Item
                          key="aiGenerativeTraining"
                          value="aiGenerativeTraining"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">aiGenerativeTraining</p>
                        </Select.Item>
                        <Select.Item
                          key="aiGenerativeTrainingWithAuthorship"
                          value="aiGenerativeTrainingWithAuthorship"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">
                            aiGenerativeTrainingWithAuthorship
                          </p>
                        </Select.Item>
                        <Select.Item
                          key="aiTraining"
                          value="aiTraining"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">aiTraining</p>
                        </Select.Item>
                        <Select.Item
                          key="aiTrainingWithAuthorship"
                          value="aiTrainingWithAuthorship"
                          className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                        >
                          <p className="my-auto">aiTrainingWithAuthorship</p>
                        </Select.Item>
                      </Select.Content>
                    </Select.Root>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <Form.Field
              control={form.control}
              name="custom.generated_through"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Generated Through</Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          type="text"
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={disabledAll ? disabledAll : false}
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
              name="custom.generated_by"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Generated By</Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          type="text"
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={disabledAll ? disabledAll : false}
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
              name="custom.creator_wallet"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>Creator Wallet</Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          type="text"
                          value={field.value ?? ""}
                          autoComplete="off"
                          disabled={disabledAll ? disabledAll : false}
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <div className="flex flex-col gap-y-5 rounded-sm border border-semantic-bg-line p-5">
              <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                License
              </p>
              <Form.Field
                control={form.control}
                name="custom.license.name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>License Name</Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            type="text"
                            value={field.value ?? ""}
                            autoComplete="off"
                            disabled={disabledAll ? disabledAll : false}
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
                name="custom.license.name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label>License Document</Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            type="text"
                            value={field.value ?? ""}
                            autoComplete="off"
                            disabled={disabledAll ? disabledAll : false}
                          />
                        </Input.Root>
                      </Form.Control>
                      <Form.Description>
                        Url to the license document
                      </Form.Description>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex w-full flex-row-reverse gap-x-4">
          <Button
            type="submit"
            variant="secondaryColour"
            size="lg"
            className="gap-x-2"
          >
            Save
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
