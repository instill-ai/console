import cn from "clsx";
import * as React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  Input,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import {
  ConnectorDefinition,
  ConnectorResourceWithDefinition,
  Nullable,
  UpdateUserConnectorResourcePayload,
  getInstillApiErrorMessage,
  useCreateUserConnectorResource,
  useUpdateUserConnectorResource,
  useUser,
} from "@instill-ai/toolkit";
import {
  recursiveReplaceTargetValue,
  recursivelyReplaceNullAndEmptyStringWithUndefined,
} from "../lib";
import { isAxiosError } from "axios";

export const BlockchainResourceFormSchema = z
  .object({
    id: z.string().min(1, { message: "ID is required" }),
    description: z.string().nullable().optional(),
    connector_definition_name: z.string(),
    configuration: z.object({
      capture_token: z.string().nullable().optional(),
    }),
  })
  .superRefine((state, ctx) => {
    if (
      state.connector_definition_name ===
      "connector-definitions/blockchain-numbers"
    ) {
      if (!state.configuration.capture_token) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "capture_token is required",
          path: ["configuration.capture_token"],
        });
      }
    }
  });

export type BlockchainResourceFormProps = {
  disabledAll?: boolean;
  blockchainResource: Nullable<ConnectorResourceWithDefinition>;
  blockchainDefinition: ConnectorDefinition;
  accessToken: Nullable<string>;
  onSelectConnectorResource?: (
    connectorResource: ConnectorResourceWithDefinition
  ) => void;
} & BackButtonProps;

type BackButtonProps =
  | {
      enableBackButton: true;
      onBack: () => void;
    }
  | {
      enableBackButton: false;
    };

export const BlockchainResourceForm = (props: BlockchainResourceFormProps) => {
  const {
    disabledAll,
    blockchainResource,
    blockchainDefinition,
    onSelectConnectorResource,
    accessToken,
    enableBackButton,
  } = props;

  const form = useForm<z.infer<typeof BlockchainResourceFormSchema>>({
    resolver: zodResolver(BlockchainResourceFormSchema),
    defaultValues: blockchainResource
      ? blockchainResource
      : {
          connector_definition_name: blockchainDefinition.name,
        },
  });

  const { toast } = useToast();

  const user = useUser({
    enabled: true,
    accessToken,
  });

  const createBlockchain = useCreateUserConnectorResource();
  const updateBlockchain = useUpdateUserConnectorResource();

  function onSubmit(data: z.infer<typeof BlockchainResourceFormSchema>) {
    if (!user.isSuccess) return;

    if (!blockchainResource) {
      const payload = {
        id: data.id,
        connector_definition_name: data.connector_definition_name,
        description: data.description ?? undefined,
        configuration: recursivelyReplaceNullAndEmptyStringWithUndefined(
          data.configuration
        ),
      };

      createBlockchain.mutate(
        { payload, userName: user.data.name, accessToken },
        {
          onSuccess: ({ connectorResource }) => {
            if (onSelectConnectorResource) {
              onSelectConnectorResource({
                ...connectorResource,
                connector_definition: blockchainDefinition,
              });
            }

            toast({
              title: "Successfully create blockchain resource",
              variant: "alert-success",
              size: "small",
            });
          },
          onError: (error) => {
            if (isAxiosError(error)) {
              toast({
                title:
                  "Something went wrong when create the blockchain resource",
                variant: "alert-error",
                size: "large",
                description: getInstillApiErrorMessage(error),
              });
            } else {
              toast({
                title:
                  "Something went wrong when create the blockchain resource",
                variant: "alert-error",
                size: "large",
                description: "Please try again later",
              });
            }
          },
        }
      );
      return;
    }

    const payload: UpdateUserConnectorResourcePayload = {
      connectorResourceName: blockchainResource.name,
      description: data.description ?? undefined,
      configuration: recursivelyReplaceNullAndEmptyStringWithUndefined(
        recursiveReplaceTargetValue(
          data.configuration,
          "*****MASK*****",
          undefined
        )
      ),
    };

    updateBlockchain.mutate(
      { payload, accessToken },
      {
        onSuccess: ({ connectorResource }) => {
          if (onSelectConnectorResource) {
            onSelectConnectorResource({
              ...connectorResource,
              connector_definition: blockchainDefinition,
            });
          }

          toast({
            title: "Successfully update blockchain resource",
            variant: "alert-success",
            size: "small",
          });
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast({
              title: "Something went wrong when update the blockchain resource",
              variant: "alert-error",
              size: "large",
              description: getInstillApiErrorMessage(error),
            });
          } else {
            toast({
              title: "Something went wrong when update the blockchain resource",
              variant: "alert-error",
              size: "large",
              description: "Please try again later",
            });
          }
        },
      }
    );
  }

  return (
    <Form.Root {...form}>
      <form className="w-full" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-10 flex flex-col space-y-5">
          <Form.Field
            control={form.control}
            name="id"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>ID *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={blockchainResource ? true : disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Pick an ID to help you identify this resource. The ID
                    conforms to RFC-1034, which restricts to letters, numbers,
                    and hyphen, with the first character a letter, the last a
                    letter or a number, and a 63 character maximum.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="description"
            render={({ field }) => {
              return (
                <Form.Item>
                  <Form.Label>Description</Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      value={field.value ?? ""}
                      disabled={disabledAll}
                    />
                  </Form.Control>
                  <Form.Description>
                    Fill with a short description.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
          <Form.Field
            control={form.control}
            name="configuration.capture_token"
            render={({ field }) => {
              const display =
                blockchainDefinition.name ===
                "connector-definitions/blockchain-numbers";
              return (
                <Form.Item className={display ? "" : "hidden"}>
                  <Form.Label>Capture token *</Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        type="text"
                        value={field.value ?? ""}
                        autoComplete="off"
                        disabled={disabledAll}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Description>
                    Fill your Capture token in the Capture App. To access your
                    tokens, you need a Capture App account and you can sign in
                    with email or wallet to acquire the Capture Token.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
        <div className="flex w-full flex-row gap-x-4">
          {enableBackButton ? (
            <Button
              type="button"
              variant="secondaryGrey"
              size="lg"
              className="!w-full !flex-1 gap-x-2"
              onClick={() => {
                props.onBack();
              }}
            >
              Back
            </Button>
          ) : null}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className={cn(enableBackButton ? "!w-full !flex-1" : "ml-auto")}
          >
            Save
          </Button>
        </div>
      </form>
    </Form.Root>
  );
};
