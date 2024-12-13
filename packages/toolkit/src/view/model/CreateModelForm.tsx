"use client";

import type {
  CreateNamespaceModelRequest,
  ModelTask,
  Visibility,
} from "instill-sdk";
import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Form,
  getModelInstanceTaskToolkit,
  getModelRegionToolkit,
  Icons,
  Input,
  RadioGroup,
  Select,
  Textarea,
  toast,
} from "@instill-ai/design-system";

import { EntitySelector, LoadingSpin } from "../../components";
import {
  InstillErrors,
  InstillModelTask,
  InstillModelVisibility,
  resourceIdPrefix,
} from "../../constant";
import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useCreateNamespaceModel,
  useInstillStore,
  useModelAvailableRegions,
  useRouteInfo,
  useShallow,
} from "../../lib";
import { FieldDescriptionTooltip } from "../../lib/use-instill-form/components/common";
import { useUserNamespaces } from "../../lib/useUserNamespaces";
import { env, formatResourceId } from "../../server";

type Option = {
  value: string;
  title: string;
};

const CreateModelSchema = z
  .object({
    id: z.string(),
    description: z.string().optional(),
    visibility: z
      .enum(InstillModelVisibility)
      .default(InstillModelVisibility[1]),
    region: z.string(),
    hardware: z.string(),
    hardwareCustom: z.string().optional(),
    task: z.enum(InstillModelTask).default(InstillModelTask[0]),
    namespaceId: z.string(),
  })
  .superRefine((state, ctx) => {
    if (state.hardware === "Custom" && !state.hardwareCustom) {
      return ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: InstillErrors.NoCustomHardwareNameError,
        path: ["hardware"],
      });
    }
  });

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  updateNavigationNamespaceAnchor: store.updateNavigationNamespaceAnchor,
});

export const CreateModelForm = () => {
  const {
    accessToken,
    enabledQuery,
    navigationNamespaceAnchor,
    updateNavigationNamespaceAnchor,
  } = useInstillStore(useShallow(selector));

  const router = useRouter();
  const { amplitudeIsInit } = useAmplitudeCtx();
  const [regionOptions, setRegionOptions] = React.useState<Option[]>([]);
  const [hardwareOptions, setHardwareOptions] = React.useState<
    Record<string, Option[]>
  >({});
  const [hardwareCustomValue, setHardwareCustomValue] =
    React.useState<string>("");
  const [creating, setCreating] = React.useState(false);

  const routeInfo = useRouteInfo();

  const form = useForm<z.infer<typeof CreateModelSchema>>({
    resolver: zodResolver(CreateModelSchema),
    mode: "onChange",
    defaultValues: { id: "" },
  });

  const userNamespaces = useUserNamespaces();

  const formattedModelId = formatResourceId(
    form.watch("id"),
    resourceIdPrefix.model,
  );

  const {
    formState: { isDirty },
  } = form;

  const modelRegions = useModelAvailableRegions({
    accessToken,
    enabledQuery,
  });

  React.useEffect(() => {
    if (regionOptions.length && Object.keys(hardwareOptions).length) {
      const targetRegion = regionOptions[0]?.value;

      if (targetRegion) {
        if (!form.getValues("region")) {
          form.setValue("region", targetRegion);
        }

        const targetHardwareOptions = hardwareOptions[targetRegion];

        if (targetHardwareOptions && targetHardwareOptions[0]) {
          if (!form.getValues("hardware")) {
            form.setValue("hardware", targetHardwareOptions[0].value);
          }
        }
      }
    }
  }, [form, regionOptions, hardwareOptions]);

  React.useEffect(() => {
    if (!form.getValues("namespaceId")) {
      if (navigationNamespaceAnchor) {
        form.setValue("namespaceId", navigationNamespaceAnchor);
        return;
      }

      if (routeInfo.isSuccess && routeInfo.data.namespaceId) {
        form.setValue("namespaceId", routeInfo.data.namespaceId);
      }
    }
  }, [form, routeInfo.isSuccess, routeInfo.data, navigationNamespaceAnchor]);

  React.useEffect(() => {
    const currentEnv: "CE" | "CLOUD" = env("NEXT_PUBLIC_APP_ENV");

    if (modelRegions.data && !regionOptions.length) {
      const newRegionOptions = modelRegions.data
        .filter((item) =>
          currentEnv === "CE"
            ? item.regionName === "REGION_LOCAL"
            : item.regionName !== "REGION_LOCAL",
        )
        .map((item) => ({
          value: item.regionName,
          title: getModelRegionToolkit(item.regionName) || "Unknown",
        }));

      const newHardwareOptions: Record<string, Option[]> = {};

      for (const region of modelRegions.data) {
        newHardwareOptions[region.regionName] = region.hardware.map((item) => ({
          ...item,
          value: item.value || "Custom",
        }));
      }

      setRegionOptions(newRegionOptions);
      setHardwareOptions(newHardwareOptions);
    }
  }, [form, modelRegions.isSuccess, modelRegions.data, regionOptions.length]);

  const createModel = useCreateNamespaceModel();
  async function onSubmit(data: z.infer<typeof CreateModelSchema>) {
    if (
      !routeInfo.isSuccess ||
      !formattedModelId ||
      !userNamespaces.isSuccess
    ) {
      return;
    }

    setCreating(true);

    const targetNamespace = userNamespaces.data.find(
      (namespace) => namespace.id === data.namespaceId,
    );

    if (targetNamespace) {
      const payload: CreateNamespaceModelRequest = {
        namespaceId: targetNamespace.id,
        id: formattedModelId,
        description: data.description,
        visibility: data.visibility ?? "VISIBILITY_PUBLIC",
        region: data.region,
        hardware:
          data.hardware === "Custom"
            ? data.hardwareCustom || ""
            : data.hardware,
        task: data.task,
        modelDefinition: "model-definitions/container",
        configuration: {},
      };

      try {
        await createModel.mutateAsync({
          accessToken,
          payload,
        });

        if (amplitudeIsInit) {
          sendAmplitudeData("create_model");
        }

        updateNavigationNamespaceAnchor(() => targetNamespace.id);

        router.push(
          `/${data.namespaceId}/models/${formattedModelId}/playground`,
        );
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
    <div className="flex w-full flex-col md:w-1/2">
      {routeInfo.isSuccess && modelRegions.isSuccess ? (
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
                          <div className="flex flex-row items-center">
                            <Form.Label className="product-body-text-3-semibold">
                              Owner
                            </Form.Label>
                            <p className="ml-1 !font-bold product-body-text-4-regular">
                              *
                            </p>
                          </div>
                          <Form.Control>
                            <EntitySelector
                              value={field?.value || ""}
                              onChange={(value: string) => {
                                field.onChange(value);

                                if (form.getValues("id")) {
                                  form.trigger("id");
                                }
                              }}
                              data={
                                userNamespaces.isSuccess
                                  ? userNamespaces.data
                                  : []
                              }
                            />
                          </Form.Control>
                          <p className="text-semantic-fg-secondary product-body-text-4-regular">
                            Use the drop-down to choose a different owner.
                          </p>
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
                          <div className="flex flex-row items-center">
                            <Form.Label className="product-body-text-3-semibold">
                              Model ID
                            </Form.Label>
                            <p className="ml-1 !font-bold product-body-text-4-regular">
                              *
                            </p>
                          </div>
                          <Form.Control>
                            <Input.Root className="px-[9px]">
                              <Input.Core
                                {...field}
                                className="pl-0 !product-body-text-2-regular"
                                type="text"
                                placeholder="Model ID"
                                required={false}
                                value={field.value || ""}
                              />
                            </Input.Root>
                          </Form.Control>
                          {isDirty ? (
                            <p className="text-semantic-fg-secondary product-body-text-4-regular">
                              ID will be transformed to: {formattedModelId}
                            </p>
                          ) : null}
                          <Form.Message />
                        </Form.Item>
                      );
                    }}
                  />
                </div>
              </div>
              <Form.Field
                control={form.control}
                name="description"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label className="product-body-text-3-semibold">
                        Description
                      </Form.Label>
                      <Form.Control>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          autoComplete="off"
                          placeholder="A short description of this model"
                          className="!resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-2-regular focus-visible:!ring-1"
                        />
                      </Form.Control>
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
                      <div className="flex flex-row items-center gap-x-2">
                        <Form.Label className="product-body-text-3-semibold">
                          AI task
                        </Form.Label>
                        <FieldDescriptionTooltip
                          description={`You can read more about AI tasks <a rel="noopener noreferrer" target="_blank" href="https://www.instill.tech/docs/model/ai-task">here</a>`}
                        />
                      </div>
                      <Form.Control>
                        <Select.Root
                          value={field?.value || InstillModelTask[0]}
                          onValueChange={(value: ModelTask) => {
                            field.onChange(value);
                          }}
                        >
                          <Select.Trigger className="mt-auto w-full">
                            <Select.Value />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Group>
                              {InstillModelTask.map((task) => {
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
                      <p className="text-xs text-semantic-fg-secondary">
                        The kind of operations your model is going to perform.
                      </p>
                    </Form.Item>
                  );
                }}
              />
              {/* INS-5438: We tempoarily hide the private option for better visibility */}
              <RadioGroup.Root
                onValueChange={(
                  value: Exclude<Visibility, "VISIBILITY_UNSPECIFIED">,
                ) => {
                  form.setValue("visibility", value);
                }}
                className="!flex flex-col gap-y-4"
                defaultValue={InstillModelVisibility[1]}
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
                {/* <div className="flex items-center space-x-3">
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
                </div> */}
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

                            const hardwareOption = hardwareOptions[value];

                            if (hardwareOption && hardwareOption[0]) {
                              const targetValue = hardwareOption[0].value;

                              form.setValue("hardware", targetValue);
                            }
                            updateCustomHardware("");
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
                      <p className="text-xs text-semantic-fg-secondary">
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
                                    ]?.map((option) => (
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
                        <p className="text-xs text-semantic-fg-secondary">
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
                disabled={
                  creating ||
                  !userNamespaces.isSuccess ||
                  userNamespaces.data.length === 0
                }
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
        <LoadingSpin className="!m-0 !text-semantic-fg-secondary" />
      )}
    </div>
  );
};
