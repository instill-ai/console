import { z } from "zod";
import { InstillErrors } from "../../constant";
import { env, validateInstillID } from "../../server";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateUserModelPayload,
  ModelTask,
  Nullable,
  Visibility,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useAppEntity,
  useAuthenticatedUser,
  useCreateUserModel,
  useModelRegions,
  useUserMemberships,
} from "../../lib";
import {
  Button,
  Form,
  Icons,
  Input,
  RadioGroup,
  Select,
  Tag,
  Textarea,
  getModelInstanceTaskToolkit,
  toast,
  getModelRegionToolkit,
  getModelHardwareToolkit,
} from "@instill-ai/design-system";
import React, { useEffect, useState } from "react";
import { LoadingSpin } from "../../components";
import { useRouter } from "next/navigation";

const TASKS = [
  "TASK_CLASSIFICATION",
  "TASK_DETECTION",
  "TASK_KEYPOINT",
  "TASK_OCR",
  "TASK_INSTANCE_SEGMENTATION",
  "TASK_SEMANTIC_SEGMENTATION",
  "TASK_TEXT_GENERATION",
  "TASK_TEXT_TO_IMAGE",
  "TASK_IMAGE_TO_IMAGE",
  "TASK_IMAGE_TO_TEXT",
] as const;

export type CreateModelFormProps = {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
};

type Option = {
  value: string;
  title: string;
};

const CreateModelSchema = z
  .object({
    id: z.string(),
    description: z.string().optional(),
    visibility: z
      .enum(["VISIBILITY_PRIVATE", "VISIBILITY_PUBLIC"])
      .default("VISIBILITY_PRIVATE"),
    region: z.string(),
    hardware: z.string(),
    hardwareCustom: z.string().optional(),
    task: z.enum(TASKS).default("TASK_CLASSIFICATION"),
    namespaceId: z.string(),
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

    if (state.hardware === "Custom" && !state.hardwareCustom) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.NoCustomHardwareNameError,
        path: ["hardware"],
      });
    }
  });

export const CreateModelForm = (props: CreateModelFormProps) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { enabledQuery, accessToken } = props;
  const [regionOptions, setRegionOptions] = useState<Option[]>([]);
  const [hardwareOptions, setHardwareOptions] = useState<
    Record<string, Option[]>
  >({});
  const [hardwareCustomValue, setHardwareCustomValue] = useState<string>("");
  const [creating, setCreating] = React.useState(false);

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

  const modelRegions = useModelRegions({ accessToken });

  useEffect(() => {
    if (regionOptions.length && Object.keys(hardwareOptions).length) {
      if (!form.getValues("region")) {
        form.setValue("region", regionOptions[0].value);
      }

      if (!form.getValues("hardware")) {
        form.setValue(
          "hardware",
          hardwareOptions[regionOptions[0].value][0].value
        );
      }
    }
  }, [form, regionOptions, hardwareOptions]);

  useEffect(() => {
    if (entity.data.entity && !form.getValues("namespaceId")) {
      form.setValue("namespaceId", entity.data.entity);
    }
  }, [form, entity.isSuccess, entity.data]);

  useEffect(() => {
    const currentEnv: "CE" | "CLOUD" = env("NEXT_PUBLIC_APP_ENV");

    if (modelRegions.data && !regionOptions.length) {
      const newRegionOptions = modelRegions.data
        .filter((item) =>
          currentEnv === "CE"
            ? item.region_name === "REGION_LOCAL"
            : item.region_name !== "REGION_LOCAL"
        )
        .map((item) => ({
          value: item.region_name,
          title: getModelRegionToolkit(item.region_name),
        }));
      const newHardwareOptions: Record<string, Option[]> =
        modelRegions.data.reduce((acc, curr) => {
          const regionHardware = curr.hardware.map((item) => ({
            value: item,
            title: getModelHardwareToolkit(item),
          }));

          return {
            ...acc,
            [curr.region_name]: regionHardware,
          };
        }, {});

      setRegionOptions(newRegionOptions);
      setHardwareOptions(newHardwareOptions);
    }
  }, [form, modelRegions.isSuccess, modelRegions.data, regionOptions.length]);

  const createModel = useCreateUserModel();
  async function onSubmit(data: z.infer<typeof CreateModelSchema>) {
    if (!entity.isSuccess) {
      return;
    }

    setCreating(true);

    const payload: CreateUserModelPayload = {
      id: data.id,
      description: data.description,
      visibility: data.visibility,
      region: data.region,
      hardware:
        data.hardware === "Custom" ? data.hardwareCustom || "" : data.hardware,
      task: data.task,
      model_definition: "model-definitions/container",
      configuration: {},
    };

    const namespace = organizationsAndUserList.find(
      (account) => account.id === data.namespaceId
    )?.name;

    if (namespace) {
      try {
        await createModel.mutateAsync({
          accessToken,
          entityName: namespace,
          payload,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("create_model");
        }

        router.push(`/${data.namespaceId}/models/${data.id}`);
      } catch (error) {
        setCreating(false);
        toastInstillError({
          title: "Failed to create model",
          error,
          toast,
        });
      }
    } else {
      setCreating(false);
      toastInstillError({
        title: "Please choose a valid owner to create your model",
        error: null,
        toast,
      });
    }
  }

  const updateCustomHardware = (value: string) => {
    setHardwareCustomValue(value);
    form.setValue("hardwareCustom", value);
  };

  const formID = "create-new-model-form";

  return (
    <div className="flex flex-col xl:w-1/2">
      {entity.isSuccess && modelRegions.isSuccess ? (
        <Form.Root {...form}>
          <form id={formID} onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-10">
              <div className="space-y-2">
                <div className="flex flex-row gap-x-4">
                  <Form.Field
                    control={form.control}
                    name="namespaceId"
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
                                      {field?.value?.length >= 10
                                        ? field?.value?.slice(0, 10) + "..."
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
                                          <Select.ItemText>
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
                                          </Select.ItemText>
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
                  {`Git it a short and memorable ID, like 'cat-detector'. You can use <add the naming rule of the ID>. Use the top account drop-down to choose a different owner.`}
                </p>
              </div>
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <div className="flex flex-row justify-between">
                        <Form.Label className="product-body-text-3-semibold">
                          Description
                        </Form.Label>
                        <p className=" text-semantic-fg-secondary product-body-text-4-regular">
                          Optional
                        </p>
                      </div>
                      <Form.Control>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          autoComplete="off"
                          placeholder="A short description of this model"
                          className="!resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-2-regular focus-visible:!ring-1"
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
              <Form.Field
                control={form.control}
                name="task"
                render={({ field }) => {
                  return (
                    <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                      <Form.Label className="product-body-text-3-semibold">
                        Model task
                      </Form.Label>
                      <Form.Control>
                        <Select.Root
                          value={field?.value || TASKS[0]}
                          onValueChange={(value: ModelTask) => {
                            field.onChange(value);
                          }}
                        >
                          <Select.Trigger className="mt-auto w-full">
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Group>
                              {TASKS.map((task) => {
                                const { label } =
                                  getModelInstanceTaskToolkit(task);

                                return (
                                  <Select.Item
                                    key={task}
                                    value={task}
                                    label={label}
                                  />
                                );
                              })}
                            </Select.Group>
                          </Select.Content>
                        </Select.Root>
                      </Form.Control>
                      <p className="text-semantic-fg-secondary product-body-text-3-regular">
                        The kind of operations your model is going to perform.
                      </p>
                    </Form.Item>
                  );
                }}
              />
              <RadioGroup.Root
                onValueChange={(
                  value: Exclude<Visibility, "VISIBILITY_UNSPECIFIED">
                ) => {
                  form.setValue("visibility", value);
                }}
                className="!flex flex-col gap-y-4"
                defaultValue="VISIBILITY_PRIVATE"
              >
                <div className="flex items-center space-x-3">
                  <label
                    htmlFor="radio-public"
                    className="flex flex-row gap-x-3"
                  >
                    <RadioGroup.Item
                      className="my-auto"
                      value="VISIBILITY_PUBLIC"
                      id="radio-public"
                    />
                    <Icons.BookOpen02 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                    <div className="flex flex-col gap-y-1">
                      <p className="text-semantic-fg-primary product-body-text-3-semibold">
                        Public
                      </p>
                      <p className="text-semantic-fg-secondary product-body-text-4-regular">
                        Anyone on the internet can see and run this model.
                      </p>
                    </div>
                  </label>
                </div>
                <div className="flex items-center space-x-3">
                  <label
                    htmlFor="radio-private"
                    className="flex flex-row gap-x-3"
                  >
                    <RadioGroup.Item
                      className="my-auto"
                      value="VISIBILITY_PRIVATE"
                      id="radio-private"
                    />

                    <Icons.Lock03 className="my-auto h-4 w-4 stroke-semantic-fg-secondary" />
                    <div className="flex flex-col gap-y-1">
                      <p className="text-semantic-fg-primary product-body-text-3-semibold">
                        Private
                      </p>
                      <p className="text-semantic-fg-secondary product-body-text-4-regular">
                        Only you and your team members can see and run this
                        model.
                      </p>
                    </div>
                  </label>
                </div>
              </RadioGroup.Root>
              <Form.Field
                control={form.control}
                name="region"
                render={({ field }) => {
                  return (
                    <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                      <Form.Label className="product-body-text-3-semibold">
                        Cloud Region
                      </Form.Label>
                      <Form.Control>
                        <Select.Root
                          value={field?.value || regionOptions?.[0]?.value}
                          onValueChange={(value: string) => {
                            field.onChange(value);

                            if (Object.keys(hardwareOptions).length) {
                              form.setValue(
                                "hardware",
                                hardwareOptions[value][0].value
                              );
                            }
                            {
                              updateCustomHardware("");
                            }
                          }}
                        >
                          <Select.Trigger className="mt-auto w-full">
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Group>
                              {regionOptions.map((option) => (
                                <Select.Item
                                  key={option.value}
                                  value={option.value}
                                  label={option.title}
                                />
                              ))}
                            </Select.Group>
                          </Select.Content>
                        </Select.Root>
                      </Form.Control>
                      <p className="text-semantic-fg-secondary product-body-text-3-regular">
                        {`This will affect the model's performance and operational costs. Please refer to the documentation for detailed pricing information.`}
                      </p>
                    </Form.Item>
                  );
                }}
              />
              {form.getValues("region") ? (
                <Form.Field
                  control={form.control}
                  name="hardware"
                  render={({ field }) => {
                    return (
                      <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                        <Form.Label className="product-body-text-3-semibold">
                          Hardware
                        </Form.Label>
                        <Form.Control>
                          <Select.Root
                            value={
                              field?.value ||
                              hardwareOptions?.[form.getValues("region")]?.[0]
                                ?.value
                            }
                            onValueChange={(value: string) => {
                              field.onChange(value);

                              updateCustomHardware("");
                            }}
                          >
                            <Select.Trigger className="mt-auto w-full">
                              <Select.Value />
                            </Select.Trigger>
                            <Select.Content>
                              <Select.Group>
                                {Object.keys(hardwareOptions).length &&
                                form.getValues("region")
                                  ? hardwareOptions[
                                      form.getValues("region")
                                    ].map((option) => (
                                      <Select.Item
                                        key={option.value}
                                        value={option.value}
                                        label={option.title}
                                      />
                                    ))
                                  : null}
                              </Select.Group>
                            </Select.Content>
                          </Select.Root>
                        </Form.Control>
                        {field?.value === "Custom" ? (
                          <Input.Root>
                            <Input.Core
                              disabled={false}
                              required={false}
                              type="text"
                              placeholder="Your hardware name"
                              value={hardwareCustomValue}
                              onChange={(event) => {
                                const value = event.target.value;

                                updateCustomHardware(value);

                                form.trigger("hardware");
                              }}
                            />
                          </Input.Root>
                        ) : null}
                        <Form.Message />
                        <p className="text-semantic-fg-secondary product-body-text-3-regular">
                          {`This will affect the model's performance and operational costs. Please refer to the documentation for detailed pricing information.`}
                        </p>
                      </Form.Item>
                    );
                  }}
                />
              ) : null}
            </div>
            <div className="pb-14 pt-12">
              <Button
                disabled={creating || organizationsAndUserList.length === 0}
                form={formID}
                variant="primary"
                size="lg"
                type="submit"
              >
                {creating ? (
                  <LoadingSpin className="!text-semantic-fg-secondary" />
                ) : (
                  "Create Model"
                )}
              </Button>
            </div>
          </form>
        </Form.Root>
      ) : (
        <LoadingSpin className="!m-auto !text-semantic-fg-secondary" />
      )}
    </div>
  );
};
