import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { shallow } from "zustand/shallow";

import { Button, Form, Input, Select } from "@instill-ai/design-system";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../pipeline-builder/usePipelineBuilderStore";
import { useEffect } from "react";
import {
  extractReferencesFromConfiguration,
  composeEdgesFromReferences,
  validateIntillUpstreamTypes,
} from "../pipeline-builder/lib";
import { GeneralRecord } from "../../lib";
import { PipelineComponentReference } from "../pipeline-builder";

export const BlockchainFormSchema = z
  .object({
    input: z.object({
      images: z.string().nullable().optional(),
      asset_creator: z.string().nullable().optional(),
      abstract: z.string().nullable().optional(),
      custom: z
        .object({
          digital_source_type: z.string().nullable().optional(),
          mining_preference: z.string().nullable().optional(),
          generated_through: z.string().nullable().optional(),
          generated_by: z.string().nullable().optional(),
          creator_wallet: z.string().nullable().optional(),
          license: z
            .object({
              name: z.string().nullable().optional(),
              document: z.string().nullable().optional(),
            })
            .optional()
            .nullable(),
        })
        .nullable()
        .optional(),
    }),
  })
  .superRefine((state, ctx) => {
    if (!state.input.images) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "images is required",
        path: ["images"],
      });
    } else {
      const result = validateIntillUpstreamTypes({
        type: "reference",
        value: state.input.images,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.images"],
        });
      }
    }

    if (state.input.asset_creator) {
      const result = validateIntillUpstreamTypes({
        type: "reference_and_string",
        value: state.input.asset_creator,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.asset_creator"],
        });
      }
    }

    if (state.input.abstract) {
      const result = validateIntillUpstreamTypes({
        type: "reference_and_string",
        value: state.input.abstract,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.abstract"],
        });
      }
    }

    if (state.input.custom?.generated_through) {
      const result = validateIntillUpstreamTypes({
        type: "reference_and_string",
        value: state.input.custom?.generated_through,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.custom.generated_through"],
        });
      }
    }

    if (state.input.custom?.generated_by) {
      const result = validateIntillUpstreamTypes({
        type: "reference_and_string",
        value: state.input.custom?.generated_by,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.custom.generated_by"],
        });
      }
    }

    if (state.input.custom?.creator_wallet) {
      const result = validateIntillUpstreamTypes({
        type: "reference_and_string",
        value: state.input.custom?.creator_wallet,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.custom.creator_wallet"],
        });
      }
    }

    if (state.input.custom?.license?.name) {
      const result = validateIntillUpstreamTypes({
        type: "reference_and_string",
        value: state.input.custom?.license?.name,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.custom.license.name"],
        });
      }
    }

    if (state.input.custom?.license?.document) {
      const result = validateIntillUpstreamTypes({
        type: "reference_and_string",
        value: state.input.custom?.license?.document,
      });

      if (!result.isValid) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.error,
          path: ["input.custom.license.document"],
        });
      }
    }
  });

export type BlockchainFormProps = {
  configuration: GeneralRecord;
  disabledAll?: boolean;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
});

export const BlockchainForm = (props: BlockchainFormProps) => {
  const { disabledAll, configuration } = props;

  const {
    nodes,
    updateNodes,
    updateEdges,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    updatePipelineRecipeIsDirty,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  const form = useForm<z.infer<typeof BlockchainFormSchema>>({
    resolver: zodResolver(BlockchainFormSchema),
    defaultValues: {
      ...configuration,
      input: {
        images: undefined,
        custom: {
          digital_source_type: "trainedAlgorithmicMedia",
          mining_preference: "notAllowed",
        },
      },
    },
  });

  const { reset } = form;

  useEffect(() => {
    reset({
      ...configuration,
      input: configuration.input ? configuration.input : {},
    });
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
              configuration: {
                ...data,
                task: "TASK_COMMIT",
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
    updateSelectedConnectorNodeId(() => null);
    updatePipelineRecipeIsDirty(() => true);
  }

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex flex-col space-y-5">
          <Form.Field
            control={form.control}
            name="input.images"
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
                  <Form.Description>
                    The images you want to upload to blockchain.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.asset_creator"
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
                  <Form.Description>
                    Name of the asser creator.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="input.abstract"
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
                  <Form.Description>
                    A summary or abstract of the asset.
                  </Form.Description>
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
              name="input.custom.digital_source_type"
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
                      Specify the type of the source. More details see
                      https://docs.numbersprotocol.io/introduction/numbers-protocol/defining-web3-assets/assettree/digitalsourcetype.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <Form.Field
              control={form.control}
              name="input.custom.mining_preference"
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
                    <Form.Description>
                      Designates the selection made by the asset creators or
                      licensed owners to decide if the asset is suitable for
                      inclusion in a data mining or AI/ML training workflow.
                      More details see
                      https://docs.numbersprotocol.io/introduction/numbers-protocol/defining-web3-assets/assettree/miningpreference.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <Form.Field
              control={form.control}
              name="input.custom.generated_through"
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
                    <Form.Description>
                      URL of the service that is used to generate the content.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <Form.Field
              control={form.control}
              name="input.custom.generated_by"
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
                    <Form.Description>
                      The AI model used to generate the content.
                    </Form.Description>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            <Form.Field
              control={form.control}
              name="input.custom.creator_wallet"
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
                    <Form.Description>
                      The Wallet address of the asset creator.
                    </Form.Description>
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
                name="input.custom.license.name"
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
                      <Form.Description>
                        License of the asset file.
                      </Form.Description>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
              <Form.Field
                control={form.control}
                name="input.custom.license.document"
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
                        URL of the license file.
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
