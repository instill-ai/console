import { z } from "zod";
import { InstillErrors } from "../../constant";
import { env, validateInstillID } from "../../server";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateUserModelPayload, ModelTask, Nullable, Visibility, sendAmplitudeData, toastInstillError, useAmplitudeCtx, useAppEntity, useAuthenticatedUser, useCreateUserModel, useUserMemberships } from "../../lib";
import { Button, Form, Icons, Input, RadioGroup, Select, Tag, Textarea, getModelInstanceTaskToolkit, toast } from "@instill-ai/design-system";
import React, { useEffect, useState } from "react";
import { LoadingSpin } from "../../components";
import { useRouter } from "next/navigation";

const REGIONS = [
  {
    value: "REGION_GCP_EUROPE_WEST4",
    title: "GCP europe-west4",
  },
];

const HARDWARE = [
  {
    value: "CPU",
    title: "CPU",
  },
  {
    value: "NVIDIA_TESLA_T4",
    title: "Nvidia Tesla T4",
  },
  {
    value: "NVIDIA_L4",
    title: "Nvidia L4",
  },
  {
    value: "NVIDIA_A100",
    title: "Nvidia A100",
  },
];

const TASKS = ["TASK_CLASSIFICATION", "TASK_DETECTION", "TASK_KEYPOINT", "TASK_OCR", "TASK_INSTANCE_SEGMENTATION", "TASK_SEMANTIC_SEGMENTATION", "TASK_TEXT_GENERATION", "TASK_TEXT_TO_IMAGE", "TASK_IMAGE_TO_IMAGE", "TASK_IMAGE_TO_TEXT"] as const;

export type CreateModelFormProps = {
  accessToken: Nullable<string>;
  enabledQuery: boolean;
}

type Option = {
  value: string;
  title: string;
}

const CreateModelSchema = z
  .object({
    id: z.string(),
    description: z.string().optional(),
    visibility: z.enum(["VISIBILITY_PRIVATE", "VISIBILITY_PUBLIC"]).default("VISIBILITY_PRIVATE"),
    region: z.string(),
    hardware: z.string(),
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
  });

export const CreateModelForm = (props: CreateModelFormProps) => {
  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { enabledQuery, accessToken  } = props;
  const [regionOptions, setRegionOptions] = useState<Option[]>([]);
  const [region, setRegion] = useState<string>('');
  const [hardwareOptions, setHardwareOptions] = useState<Option[]>([]);
  const [hardware, setHardware] = useState<string>('');
  const [creating, setCreating] = React.useState(false);
  const [task, setTask] = useState<ModelTask>(TASKS[0]);

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
    form.setValue('namespaceId', entity.data.entity || '');
  }, [form, entity.isSuccess, entity.data]);

  useEffect(() => {
    const currentRegion = REGIONS[0].value;
    setRegionOptions(REGIONS);
    setRegion(currentRegion);
    form.setValue('region', currentRegion);
    
    const currentHardware = HARDWARE[0].value;
    setHardwareOptions(HARDWARE);
    setHardware(currentHardware);
    form.setValue('hardware', currentHardware);

    form.setValue('task', TASKS[0]);
  }, []);

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
      hardware: data.hardware,
      task: data.task,
      model_definition: "model-definitions/container",
      configuration: {},
    };

    let isOrg = false;
    const namespace = organizationsAndUserList.find(
      account => {
        if (account.id === data.namespaceId) {
          isOrg = account.type === 'organization';

          return true;
        }

        return false;
      }
    )?.name;

    if (namespace) {
      try {
        await createModel.mutateAsync({
          accessToken,
          entityName: data.namespaceId,
          isOrg,
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

  const formID = "create-new-model-form";

  return (
    <div className="flex flex-col xl:w-1/2">
      {entity.isSuccess ? (
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
              <div className="flex flex-col gap-y-2.5 md:w-1/2">
                <Form.Label className="product-body-text-3-semibold">
                  Model task
                </Form.Label>
                <Select.Root
                  value={task}
                  onValueChange={(value: ModelTask) => {
                    setTask(value);
                    form.setValue('task', value);
                  }}
                >
                  <Select.Trigger className="mt-auto w-full">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {TASKS.map(task => {
                        const { label } = getModelInstanceTaskToolkit(task);

                        return <Select.Item key={task} value={task}>{label}</Select.Item>;
                      })}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <p className="text-semantic-fg-secondary product-body-text-3-regular">
                  The kind of operations your model is going to perform.
                </p>
              </div>
              {/* const { label, getIcon } = getModelInstanceTaskToolkit(task); */}
              <RadioGroup.Root
                onValueChange={(value: Exclude<Visibility, 'VISIBILITY_UNSPECIFIED'>) => {
                  form.setValue('visibility', value);
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
                  <label htmlFor="radio-private" className="flex flex-row gap-x-3">
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
                        Only you and your team members can see and run this model.
                      </p>
                    </div>
                  </label>
                </div>
              </RadioGroup.Root>
              <div className="flex flex-col gap-y-2.5 md:w-1/2">
                <Form.Label className="product-body-text-3-semibold">
                  Cloud Region
                </Form.Label>
                <Select.Root
                  value={region}
                  onValueChange={(value) => {
                    setRegion(value);
                    form.setValue('region', value);
                  }}
                >
                  <Select.Trigger className="mt-auto w-full">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {regionOptions.map(option => <Select.Item key={option.value} value={option.value}>{option.title}</Select.Item>)}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <p className="text-semantic-fg-secondary product-body-text-3-regular">
                  {`This will affect the model's performance and operational costs. Please refer to the documentation for detailed pricing information.`}
                </p>
              </div>
              <div className="flex flex-col gap-y-2.5 md:w-1/2">
                <Form.Label className="product-body-text-3-semibold">
                  Hardware
                </Form.Label>
                <Select.Root
                  value={hardware}
                  onValueChange={(value) => {
                    setHardware(value);
                    form.setValue('hardware', value);
                  }}
                >
                  <Select.Trigger className="mt-auto w-full">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Group>
                      {hardwareOptions.map(option => <Select.Item key={option.value} value={option.value}>{option.title}</Select.Item>)}
                    </Select.Group>
                  </Select.Content>
                </Select.Root>
                <p className="text-semantic-fg-secondary product-body-text-3-regular">
                  {`This will affect the model's performance and operational costs. Please refer to the documentation for detailed pricing information.`}
                </p>
              </div>
            </div>
            <div className="pt-12 pb-14">
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
  )
}