import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import React from "react";
import { isAxiosError } from "axios";

import {
  SingleSelectOption,
  Form,
  ProgressMessageBoxState,
  Input,
  BasicProgressMessageBox,
  Button,
  Select,
  Switch,
} from "@instill-ai/design-system";

import {
  validateConfigureProfileFormFieldSchema,
  configureProfileFormFieldSchema,
  checkUserIdExist,
  useConfigureProfileFormStore,
  useUser,
  useUpdateUser,
  getInstillApiErrorMessage,
  type Nullable,
  type User,
} from "../../lib";

export type ConfigureProfileFormProps = {
  user: Nullable<User>;
  roles: SingleSelectOption[];
  onConfigure: Nullable<() => void>;
  accessToken: Nullable<string>;
};

export const ConfigureProfileForm = (props: ConfigureProfileFormProps) => {
  const { user, roles, onConfigure, accessToken } = props;

  const setFieldError = useConfigureProfileFormStore(
    (state) => state.setFieldError
  );

  const instillUser = useUser({
    accessToken,
    enabled: accessToken ? true : false,
  });

  const [messageBoxState, setMessageBoxState] =
    React.useState<ProgressMessageBoxState>({
      activate: false,
      message: null,
      description: null,
      status: null,
    });

  const updateUser = useUpdateUser();

  const form = useForm<z.infer<typeof configureProfileFormFieldSchema>>({
    resolver: zodResolver(configureProfileFormFieldSchema),
    defaultValues: {
      ...user,
    },
  });

  const handleUpdate = async (
    data: z.infer<typeof configureProfileFormFieldSchema>
  ) => {
    if (!instillUser.isSuccess) {
      return;
    }

    validateConfigureProfileFormFieldSchema(data);

    if (data.id !== instillUser.data.id) {
      // Check whether user id exist
      const userIdExist = await checkUserIdExist({
        id: data.id as string,
        accessToken,
      });

      if (userIdExist) {
        form.setError(
          "id",
          {
            type: "manual",
            message: "User ID already exists. Please try another one.",
          },
          { shouldFocus: true }
        );
        return;
      }
    }

    setMessageBoxState(() => ({
      activate: true,
      status: "progressing",
      description: null,
      message: "Updating...",
    }));

    updateUser.mutate(
      {
        payload: {
          first_name: data.first_name?.trim() || "",
          last_name: data.last_name?.trim() || "",
          org_name: data.org_name?.trim() || "",
          id:
            data.id === instillUser.data.id
              ? undefined
              : data.id?.trim() || undefined,
          role: data.role || undefined,
          newsletter_subscription: data.newsletter_subscription || false,
        },
        accessToken,
      },
      {
        onSuccess: () => {
          setMessageBoxState(() => ({
            activate: true,
            status: "success",
            description: null,
            message: "Succeed.",
          }));
          if (onConfigure) onConfigure();
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: getInstillApiErrorMessage(error),
              message: "Something went wrong when update your profile",
            }));
          } else {
            setMessageBoxState(() => ({
              activate: true,
              status: "error",
              description: "",
              message: "Something went wrong when update your profile",
            }));
          }
        },
      }
    );
  };

  const { reset } = form;

  React.useEffect(() => {
    if (user) {
      reset({
        ...user,
      });
    }
  }, [user, reset]);

  return (
    <Form.Root {...form}>
      <form
        className="w-full  min-w-[720px] lg:w-[680px]"
        onSubmit={form.handleSubmit(handleUpdate)}
      >
        <div className="mb-8 flex flex-col gap-y-6">
          <div className="flex flex-row gap-x-6">
            <Form.Field
              control={form.control}
              name="first_name"
              render={({ field }) => {
                return (
                  <Form.Item className="w-[287px]">
                    <div className="mb-2 flex flex-row gap-x-2">
                      <Form.Label>First Name</Form.Label>
                      <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
                        (optional)
                      </p>
                    </div>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="pl-2"
                          disabled={false}
                          type="text"
                          placeholder=""
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
              name="last_name"
              render={({ field }) => {
                return (
                  <Form.Item className="w-[287px]">
                    <div className="mb-2 flex flex-row gap-x-2">
                      <Form.Label>Last Name</Form.Label>
                      <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
                        (optional)
                      </p>
                    </div>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="pl-2"
                          disabled={false}
                          type="text"
                          placeholder=""
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

          <Form.Field
            control={form.control}
            name="id"
            render={({ field }) => {
              return (
                <Form.Item className="w-[287px]">
                  <div className="mb-2 flex flex-row gap-x-2">
                    <Form.Label>Username *</Form.Label>
                    <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
                      This will be your unique identifier
                    </p>
                  </div>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        className="pl-2"
                        disabled={true}
                        type="text"
                        placeholder=""
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
            name="org_name"
            render={({ field }) => {
              return (
                <Form.Item className="w-[287px]">
                  <div className="mb-2 flex flex-row gap-x-2">
                    <Form.Label>Organisation Name</Form.Label>
                    <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
                      Your company name
                    </p>
                  </div>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        className="pl-2"
                        disabled={false}
                        type="text"
                        placeholder=""
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
            name="role"
            render={({ field }) => {
              return (
                <Form.Item className="w-[287px]">
                  <div className="mb-2 flex flex-row gap-x-2">
                    <Form.Label>Role</Form.Label>
                    <p className="my-auto font-sans text-xs font-normal text-instillGrey70">
                      (optional)
                    </p>
                  </div>
                  <Form.Control>
                    <Select.Root
                      value={field?.value || ""}
                      onValueChange={field.onChange}
                    >
                      <Select.Trigger className="w-full pl-[14px]">
                        <Select.Value placeholder="Select Role" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Group>
                          {roles.map((role) => (
                            <Select.Item value={role.value} key={role.value}>
                              {role.label}
                            </Select.Item>
                          ))}
                        </Select.Group>
                      </Select.Content>
                    </Select.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />

          <Form.Field
            control={form.control}
            name="newsletter_subscription"
            render={({ field }) => {
              return (
                <Form.Item className="w-full !space-y-2">
                  <Form.Label htmlFor="profile-newsletter-subscription">
                    Newsletter subscription *
                  </Form.Label>
                  <Switch
                    id="profile-newsletter-subscription"
                    onCheckedChange={field.onChange}
                    checked={field.value || undefined}
                  />
                  <Form.Description>
                    Receive the latest news from Instill AI for open source
                    updates, community highlights, blog posts, useful tutorials
                    and more! You can unsubscribe any time.
                  </Form.Description>
                  <Form.Message />
                </Form.Item>
              );
            }}
          />
        </div>
        <div className="flex flex-row">
          <div className="mb-auto w-1/2">
            <BasicProgressMessageBox
              state={messageBoxState}
              setActivate={(activate) =>
                setMessageBoxState((prev) => ({ ...prev, activate }))
              }
              width="w-full"
              closable={true}
            />
          </div>
          <div className="ml-auto flex flex-row gap-x-2">
            <Button
              size="lg"
              disabled={false}
              variant="secondaryGrey"
              className="my-auto px-10"
              type="button"
              color="secondary"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              disabled={instillUser.isSuccess ? false : true}
              className="my-auto"
            >
              Save Changes
            </Button>
          </div>
        </div>
      </form>
    </Form.Root>
  );
};
