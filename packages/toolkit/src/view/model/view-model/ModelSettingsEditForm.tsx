import { z } from "zod";
import {
  InstillErrors /* , InstillModelVisibility */,
} from "../../../constant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  Input,
  Textarea,
  getModelHardwareToolkit,
  Select,
  toast,
  Button /* , Icons, RadioGroup */,
} from "@instill-ai/design-system";
import { useMemo, useState } from "react";
import {
  InstillStore,
  Model,
  UpdateUserModelPayload,
  Visibility,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useInstillStore,
  useModelRegions,
  useShallow,
  useUpdateUserModel,
} from "../../../lib";
import { LoadingSpin, UploadImageFieldWithCrop } from "../../../components";

export type ModelSettingsEditFormProps = {
  model?: Model;
  onUpdate: () => void;
};

type Option = {
  value: string;
  title: string;
};

const EditModelSchema = z
  .object({
    description: z.string().optional(),
    source_url: z.literal("").or(z.string().url()),
    documentation_url: z.literal("").or(z.string().url()),
    license: z.literal("").or(z.string().url()),
    //visibility: z.enum(InstillModelVisibility).default(InstillModelVisibility[0]),
    hardware: z.string(),
    hardwareCustom: z.string().optional(),
    profile_image: z.string().optional(),
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
});

export const ModelSettingsEditForm = ({
  model,
  onUpdate,
}: ModelSettingsEditFormProps) => {
  const { accessToken } = useInstillStore(useShallow(selector));
  const [hardwareCustomValue, setHardwareCustomValue] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const { amplitudeIsInit } = useAmplitudeCtx();

  const modelRegions = useModelRegions({ accessToken });

  const hardwareOptions = useMemo(() => {
    if (!modelRegions.data || !model) {
      return [];
    }

    return modelRegions.data
      .find((item) => item.region_name === model.region)
      ?.hardware.reduce(
        (acc: Option[], hardwareName) => [
          ...acc,
          {
            value: hardwareName,
            title: getModelHardwareToolkit(hardwareName),
          },
        ],
        []
      );
  }, [modelRegions, model]);

  const defaultValues = useMemo(() => {
    if (!model) {
      return undefined;
    }

    const hardwareName = getModelHardwareToolkit(model.hardware);

    return {
      description: model.description,
      source_url: model.source_url,
      documentation_url: model.documentation_url,
      license: model.license,
      //visibility: model.visibility as Exclude<Visibility, "VISIBILITY_UNSPECIFIED">,
      hardware: hardwareName === "Unknown" ? "Custom" : model.hardware,
      hardwareCustom: hardwareName === "Unknown" ? model.hardware : "",
      profile_image: model.profile_image,
    };
  }, [model]);

  const form = useForm<z.infer<typeof EditModelSchema>>({
    resolver: zodResolver(EditModelSchema),
    mode: "onChange",
    values: defaultValues,
  });
  const updateUserModel = useUpdateUserModel();

  async function onSubmit(data: z.infer<typeof EditModelSchema>) {
    if (!model) {
      return;
    }

    setUpdating(true);

    const payload: UpdateUserModelPayload = {
      description: data.description,
      source_url: data.source_url,
      documentation_url: data.documentation_url,
      license: data.license,
      //visibility: data.visibility,
      hardware:
        data.hardware === "Custom" ? data.hardwareCustom || "" : data.hardware,
      profile_image: data.profile_image,
    };

    try {
      await updateUserModel.mutateAsync({
        name: model.name,
        payload,
        accessToken,
      });

      toast({
        title: "Success!",
        variant: "notification-success",
        size: "large",
        description: "Model was successfully updated!",
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
        toast,
      });
    }
  }

  const updateCustomHardware = (value: string) => {
    setHardwareCustomValue(value);
    form.setValue("hardwareCustom", value);
  };

  const formID = "edit-model-form";

  return (
    <div className="mt-1 flex flex-col xl:w-1/2">
      <Form.Root {...form}>
        <form id={formID} onSubmit={form.handleSubmit(onSubmit)}>
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
              name="source_url"
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
              name="documentation_url"
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
              fieldName="profile_image"
              form={form}
              title="Cover image"
            />
            {/* TODO: Uncomment when PATCH allows updating visibility
            
            <RadioGroup.Root
              onValueChange={(
                value: Exclude<Visibility, "VISIBILITY_UNSPECIFIED">
              ) => {
                form.setValue("visibility", value);
              }}
              className="!flex flex-col gap-y-4"
              defaultValue={model?.visibility || InstillModelVisibility[0]}
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
            </RadioGroup.Root> */}
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
                        value={field?.value || hardwareOptions?.[0].value}
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
                    <p className="text-semantic-fg-secondary product-body-text-3-regular">
                      {`This will affect the model's performance and operational costs. Please refer to the documentation for detailed pricing information.`}
                    </p>
                  </Form.Item>
                );
              }}
            />
          </div>
          <div className="pb-14 pt-12">
            <Button
              disabled={updating}
              form={formID}
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
