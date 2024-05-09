import { z } from "zod";
import { InstillErrors } from "../../constant";
import { env, validateInstillID } from "../../server";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Nullable, useAppEntity, useAuthenticatedUser, useUserMemberships } from "../../lib";
import { Button, Form, Input, Select, Tag } from "@instill-ai/design-system";
import React, { useEffect } from "react";
import { LoadingSpin } from "../../components";

export type CreateModelFormProps = {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
}

const CreateModelSchema = z
  .object({
    id: z.string(),
    description: z.string().optional().nullable(),
    visibility: z.enum(["VISIBILITY_PRIVATE", "VISIBILITY_PUBLIC"]).default("VISIBILITY_PRIVATE"),
    region: z.enum(["REGION_GCP_EUROPE_WEST_4"]).default("REGION_GCP_EUROPE_WEST_4"),
    hardware: z.enum(["CPU"]).default("CPU"),
    task: z.enum(["TASK_CLASSIFICATION", "TASK_DETECTION", "TASK_KEYPOINT", "TASK_OCR", "TASK_INSTANCE_SEGMENTATION", "TASK_SEMANTIC_SEGMENTATION", "TASK_TEXT_GENERATION", "TASK_TEXT_TO_IMAGE", "TASK_IMAGE_TO_IMAGE", "TASK_IMAGE_TO_TEXT"]).default("TASK_CLASSIFICATION"),
    parent: z.string(),
    //configuration: z.object({}),
  })
  .superRefine((state, ctx) => {
    if (!validateInstillID(state.id)) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.IDInvalidError,
        path: ["id"],
      });
    }
  });

export const CreateModelForm = (props: CreateModelFormProps) => {
  const { enabledQuery, accessToken  } = props;

  const entity = useAppEntity();
  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });
  const userMemberships = useUserMemberships({
    enabled: entity.isSuccess,
    userID: me.isSuccess ? me.data.id : null,
    accessToken,
  });

  const form = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
    mode: "onChange",
  });

  const organizationsAndUserList = React.useMemo(() => {
    const orgsAndUserList: {
      id: string;
      name: string;
      type: "user" | "organization";
    }[] = [];

    if (userMemberships.isSuccess) {
      userMemberships.data.forEach((org) => {
        orgsAndUserList.push({
          id: org.organization.id,
          name: org.organization.name,
          type: "organization",
        });
      });
    }

    if (entity.isSuccess && entity.data.entity && entity.data.entityName) {
      orgsAndUserList.push({
        id: entity.data.entity,
        name: entity.data.entityName,
        type: "user",
      });
    }

    return orgsAndUserList;
  }, [
    userMemberships.isSuccess,
    userMemberships.data,
    entity.isSuccess,
    entity.data,
  ]);

  useEffect(() => {
    form.setValue('parent', entity.data.entity || '');
  }, [form, entity.isSuccess, entity.data]);

  const formID = "create-new-model-form";

  return (
    <div className="flex flex-col">
      <div className="flex border-b border-semantic-bg-line p-6">
        <h3 className=" text-semantic-fg-primary product-body-text-1-semibold">
          Create a model
        </h3>
      </div>
      <div className="flex flex-col pt-5">
        {entity.isSuccess ? (
          <Form.Root {...form}>
            <form id={formID} onSubmit={form.handleSubmit(console.log/* onSubmit */)}>
              <div className="flex flex-col gap-y-5">
                <div className="space-y-2">
                  <div className="flex flex-row gap-x-4">
                    <Form.Field
                      control={form.control}
                      name="parent"
                      render={({ field }) => {
                        return (
                          <Form.Item className="w-full">
                            <Form.Label className="product-body-text-3-semibold">
                              Owner
                            </Form.Label>
                            <Form.Control>
                              <Select.Root
                                value={field?.value || ""}
                                onValueChange={(e) => {
                                  field.onChange(e);
                                  if (form.getValues("id")) {
                                    form.trigger("id");
                                  }
                                }}
                              >
                                <Select.Trigger className="w-full pl-[14px]">
                                  <Select.Value placeholder="Select Model Owner">
                                    <div className="flex flex-row gap-x-2">
                                      <span className="my-auto">
                                        {field?.value?.length || 0 >= 10
                                          ? field?.value?.slice(0, 10) +
                                            "..."
                                          : field.value}
                                      </span>
                                      <span className="my-auto">
                                        {organizationsAndUserList.find(
                                          (namespace) =>
                                            namespace.id === field.value
                                        )?.type === "organization" ? (
                                          <Tag
                                            variant="lightBlue"
                                            size="sm"
                                            className="!py-0"
                                          >
                                            organization
                                          </Tag>
                                        ) : (
                                          <Tag
                                            size="sm"
                                            className="!py-0"
                                            variant="lightNeutral"
                                          >
                                            user
                                          </Tag>
                                        )}
                                      </span>
                                    </div>
                                  </Select.Value>
                                </Select.Trigger>
                                <Select.Content>
                                  <Select.Group>
                                    {organizationsAndUserList.length &&
                                      organizationsAndUserList.map(
                                        (namespace) => (
                                          <Select.Item
                                            value={namespace.id}
                                            key={namespace.id}
                                          >
                                            <div className="flex flex-row gap-x-2">
                                              <span className="my-auto">
                                                {namespace.id}
                                              </span>
                                              <span className="my-auto">
                                                {namespace.type ===
                                                "organization" ? (
                                                  <Tag
                                                    variant="lightBlue"
                                                    size="sm"
                                                    className="!py-0"
                                                  >
                                                    organization
                                                  </Tag>
                                                ) : (
                                                  <Tag
                                                    size="sm"
                                                    className="!py-0"
                                                    variant="lightNeutral"
                                                  >
                                                    user
                                                  </Tag>
                                                )}
                                              </span>
                                            </div>
                                          </Select.Item>
                                        )
                                      )}
                                  </Select.Group>
                                </Select.Content>
                              </Select.Root>
                            </Form.Control>
                            <Form.Message />
                          </Form.Item>
                        );
                      }}
                    />

                    <span className="pt-[30px] text-2xl text-semantic-fg-disabled">
                      /
                    </span>

                    <Form.Field
                      control={form.control}
                      name="id"
                      render={({ field }) => {
                        return (
                          <Form.Item className="w-full">
                            <Form.Label className="product-body-text-3-semibold">
                              Model ID
                            </Form.Label>
                            <Form.Control>
                              <Input.Root>
                                <Input.Core
                                  {...field}
                                  className="pl-2 !product-body-text-2-regular"
                                  type="text"
                                  placeholder="Model ID"
                                  required={false}
                                  value={field.value || ""}
                                />
                              </Input.Root>
                            </Form.Control>

                            <Form.Message />
                          </Form.Item>
                        );
                      }}
                    />
                  </div>
                  <p className="text-semantic-fg-secondary product-body-text-3-regular">
                    <span>Your model URL in Instill AI will be:</span>
                    <span className="ml-2 break-all product-body-text-3-semibold">
                      {form.watch("id") !== "" && form.watch("id")
                        ? `${env(
                            "NEXT_PUBLIC_CONSOLE_BASE_URL"
                          )}/${form.getValues(
                            "parent"
                          )}/models/${form.getValues("id")}`
                        : null}
                    </span>
                  </p>
                </div>
              </div>
            </form>
          </Form.Root>
        ) : (
          <LoadingSpin className="!m-auto" />
        )}
      </div>
    </div>
  )
}