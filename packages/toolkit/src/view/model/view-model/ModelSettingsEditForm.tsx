"use client";

import type {
  Model,
  UpdateNamespaceModelRequest,
  Visibility,
} from "instill-sdk";
import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { InstillNameInterpreter } from "instill-sdk";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Button,
  Form,
  Icons,
  Input,
  RadioGroup,
  Select,
  Textarea,
} from "@instill-ai/design-system";

import { LoadingSpin, UploadImageFieldWithCrop } from "../../../components";
import { InstillErrors, InstillModelVisibility } from "../../../constant";
import {
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  toastInstillSuccess,
  useAmplitudeCtx,
  useInstillStore,
  useModelAvailableRegions,
  useShallow,
  useUpdateNamespaceModel,
} from "../../../lib";

export type ModelSettingsEditFormProps = {
  model?: Model;
  onUpdate: () => void;
};

const EditModelSchema = z
  .object({
    description: z.string().optional(),
    sourceUrl: z.literal("").or(z.string().url()),
    documentationUrl: z.literal("").or(z.string().url()),
    license: z.literal("").or(z.string().url()),
    visibility: z.enum(InstillModelVisibility),
    hardware: z.string(),
    hardwareCustom: z.string().optional(),
    profileImage: z.string().optional(),
    tags: z.string().optional(),
    //configuration: z.object({}),
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
});

export const ModelSettingsEditForm = ({
  model,
  onUpdate,
}: ModelSettingsEditFormProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [hardwareCustomValue, setHardwareCustomValue] =
    React.useState<string>("");
  const [updating, setUpdating] = React.useState(false);
  const { amplitudeIsInit } = useAmplitudeCtx();

  const modelRegions = useModelAvailableRegions({ accessToken, enabledQuery });

  const hardwareOptions = React.useMemo(() => {
    if (!modelRegions.data || !model) {
      return [];
    }

    const targetModelRegion = modelRegions.data.find(
      (item) => item.regionName === model.region,
    );

    return (
      targetModelRegion?.hardware.map((item) => ({
        ...item,
        value: item.value || "Custom",
      })) ?? []
    );
  }, [modelRegions, model]);

  React.useEffect(() => {
    if (hardwareCustomValue || !model || !hardwareOptions.length) {
      return;
    }

    const targetHardware = hardwareOptions.find(
      (h) => h.value === model.hardware,
    );

    if (!targetHardware) {
      setHardwareCustomValue(model.hardware);
    }
  }, [model, hardwareOptions, hardwareCustomValue]);

  const defaultValues = React.useMemo(() => {
    if (!model || hardwareOptions.length === 0) {
      return undefined;
    }

    const targetHardware = hardwareOptions.find(
      (h) => h.value === model.hardware,
    );

    return {
      description: model.description,
      sourceUrl: model.sourceUrl,
      documentationUrl: model.documentationUrl,
      license: model.license,
      visibility: model.visibility as Exclude<
        Visibility,
        "VISIBILITY_UNSPECIFIED"
      >,
      hardware: targetHardware ? targetHardware.value : "Custom",
      hardwareCustom: targetHardware ? "" : model.hardware,
      profileImage: model.profileImage,
      tags: model.tags.join(", "),
    };
  }, [model, hardwareOptions]);

  const form = useForm<z.infer<typeof EditModelSchema>>({
    resolver: zodResolver(EditModelSchema),
    mode: "onChange",
    values: defaultValues,
    disabled: !model?.permission.canEdit,
  });

  const updateNamespaceModel = useUpdateNamespaceModel();

  async function onSubmit(data: z.infer<typeof EditModelSchema>) {
    if (!model) {
      return;
    }

    const { namespaceId } = InstillNameInterpreter.model(model.name);

    if (!namespaceId) {
      return;
    }

    setUpdating(true);

    const payload: UpdateNamespaceModelRequest = {
      namespaceId,
      modelId: model.id,
      description: data.description,
      sourceUrl: data.sourceUrl,
      documentationUrl: data.documentationUrl,
      license: data.license,
      visibility: data.visibility,
      hardware:
        data.hardware === "Custom" ? data.hardwareCustom || "" : data.hardware,
      profileImage: data.profileImage,
      tags:
        data.tags
          ?.trim()
          .toLowerCase()
          .split(",")
          .map((item) => item.trim())
          .filter((item) => item) || [],
    };

    try {
      await updateNamespaceModel.mutateAsync({
        payload,
        accessToken,
      });

      toastInstillSuccess({
        title: "Model was successfully updated",
      });

      if (amplitudeIsInit) {
        sendAmplitudeData("update_model");
      }

      setUpdating(false);
      onUpdate();
    } catch (error) {
      setUpdating(false);
      toastInstillError({
        title: "Failed to update model",
        error,
      });
    }
  }

  const updateCustomHardware = (value: string) => {
    setHardwareCustomValue(value);
    form.setValue("hardwareCustom", value);
  };

  const formId = "edit-model-form";

  return (
    <div className="mt-1 flex flex-col xl:w-1/2">
      <Form.Root {...form}>
        <form id={formId} onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-y-10">
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
              name="sourceUrl"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      GitHub
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="GitHub repo url"
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
            <Form.Field
              control={form.control}
              name="documentationUrl"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      Link
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="Documentation or other relevant url"
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
            <Form.Field
              control={form.control}
              name="license"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      License
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="Model license url"
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
            <UploadImageFieldWithCrop
              fieldName="profileImage"
              form={form}
              title="Cover image"
            />
            {/* INS-5438: We tempoarily hide the private option for better visibility */}
            <RadioGroup.Root
              onValueChange={(
                value: Exclude<Visibility, "VISIBILITY_UNSPECIFIED">,
              ) => {
                form.setValue("visibility", value);
              }}
              className="!flex flex-col gap-y-4"
              defaultValue={model?.visibility || InstillModelVisibility[1]}
            >
              <div className="flex items-center space-x-3">
                <label htmlFor="radio-public" className="flex flex-row gap-x-3">
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
                      Only you and your team members can see and run this model.
                    </p>
                  </div>
                </label>
              </div> */}
            </RadioGroup.Root>
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
                        value={field?.value || hardwareOptions?.[0]?.value}
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
                            {hardwareOptions?.length
                              ? hardwareOptions.map((option) => (
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
            <Form.Field
              control={form.control}
              name="tags"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-2.5 md:w-1/2">
                    <Form.Label className="product-body-text-3-semibold">
                      Tags
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="Add a tag"
                          required={false}
                          value={field.value || ""}
                          onChange={(event) =>
                            field.onChange(
                              event.target.value.toLocaleLowerCase(),
                            )
                          }
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                    <p className="text-xs text-semantic-fg-secondary">
                      {`Separate tags with a comma.`}
                    </p>
                  </Form.Item>
                );
              }}
            />
          </div>
          <div className="pb-14 pt-12">
            <Button
              disabled={!model?.permission.canEdit || updating}
              form={formId}
              variant="primary"
              size="lg"
              type="submit"
            >
              {updating ? (
                <LoadingSpin className="!text-semantic-fg-secondary" />
              ) : (
                "Update Model"
              )}
            </Button>
          </div>
        </form>
      </Form.Root>
    </div>
  );
};
