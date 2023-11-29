import * as z from "zod";
import * as React from "react";
import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  Logos,
  Select,
  Textarea,
  toast,
} from "@instill-ai/design-system";

import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Nullable, useCreateOrganization } from "../../lib";
import { LoadingSpin } from "../../components";

export type CreateOrganizationDialogProps = {
  accessToken: Nullable<string>;
  onCreate?: () => void;
};

const CreateTokenSchema = z.object({
  id: z.string().nonempty(),
  org_name: z.string().nonempty(),
  homepage: z.nullable(z.string()),
  github_username: z.nullable(z.string()),
  twitter_username: z.nullable(z.string()),
  organization_bio: z.nullable(z.string()),
  organization_type: z.nullable(z.string()),
});

export const CreateOrganizationDialog = (
  props: CreateOrganizationDialogProps
) => {
  const [open, setOpen] = React.useState(false);
  const { accessToken, onCreate } = props;
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<z.infer<typeof CreateTokenSchema>>({
    resolver: zodResolver(CreateTokenSchema),
    defaultValues: {
      id: "",
      org_name: "",
      homepage: null,
      github_username: null,
      twitter_username: null,
      organization_bio: null,
      organization_type: null,
    },
  });

  const createOrganization = useCreateOrganization();
  const handleCreateOrganization = (
    data: z.infer<typeof CreateTokenSchema>
  ) => {
    if (!accessToken) return;

    const payload = {
      id: data.id,
      org_name: data.org_name,
    };

    setIsLoading(true);

    createOrganization.mutate(
      { payload, accessToken },
      {
        onSuccess: () => {
          setIsLoading(false);
          if (onCreate) {
            onCreate();
          }

          toast({
            title: "Organization created!",
            variant: "alert-success",
            size: "small",
          });

          setOpen(false);
        },
        onError: (err) => {
          setIsLoading(false);
          if (isAxiosError(err)) {
            if (err.response?.status === 409) {
              form.setError("id", {
                type: "manual",
                message: "Organization ID already existed",
              });
              return;
            }
            form.setError("id", {
              type: "manual",
              message: err.response?.data.message,
            });
          }
        },
      }
    );
  };

  return (
    <Dialog.Root open={open} onOpenChange={(open) => setOpen(open)}>
      <Dialog.Trigger asChild>
        <Button variant="primary" size="lg">
          Create Organization
        </Button>
      </Dialog.Trigger>
      <Dialog.Content className="!w-[650px]">
        <Dialog.Header>
          <Dialog.Title>
            <div className="flex flex-row gap-x-4">
              <div className="my-auto rounded-lg bg-white p-3">
                <Logos.OpenAI className="h-6 w-6" />
              </div>
              <p className="my-auto product-headings-heading-1">
                New Organization
              </p>
            </div>
          </Dialog.Title>
        </Dialog.Header>

        <Form.Root {...form}>
          <form
            className="w-full space-y-3"
            onSubmit={form.handleSubmit(handleCreateOrganization)}
          >
            <div className="flex w-full flex-row gap-x-4">
              <Form.Field
                control={form.control}
                name="id"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-1/2">
                      <Form.Label
                        htmlFor={field.name}
                        className="product-body-text-2-semibold"
                      >
                        Organization username *
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            id={field.name}
                            type="text"
                            placeholder="Username"
                            {...field}
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
                    <Form.Item className="w-1/2">
                      <Form.Label
                        htmlFor={field.name}
                        className="product-body-text-2-semibold"
                      >
                        Organization Full name *
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            id={field.name}
                            type="text"
                            placeholder="Full name"
                            {...field}
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

            <div className="w-full space-y-3">
              <p className="product-body-text-1-semibold">Upload your logo</p>
              <div className="my-auto space-y-3 rounded border border-dashed bg-slate-50 px-10 py-10 text-center">
                <Icons.Upload01 className="mx-auto h-8 w-8 stroke-slate-500" />
                <p className="mx-auto product-body-text-4-regular">
                  Drag-and-drop file, or browse computer
                </p>
              </div>
            </div>
            <div className="flex w-full flex-row gap-x-4">
              <Form.Field
                control={form.control}
                name="organization_type"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-1/2">
                      <Form.Label
                        htmlFor={field.name}
                        className="product-body-text-2-semibold"
                      >
                        Organization type
                      </Form.Label>
                      <Form.Control>
                        <Select.Root
                          value={field?.value || ""}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger className="w-full">
                            <Select.Value placeholder="Select Organization" />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Group>
                              <Select.Label>Organization 1</Select.Label>
                              <Select.Item value="organization-1">
                                Organization
                              </Select.Item>
                              <Select.Item value="organization-2">
                                Organization
                              </Select.Item>
                              <Select.Item value="organization-3">
                                Organization
                              </Select.Item>
                              <Select.Item value="organization-4">
                                Organization
                              </Select.Item>
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
                name="homepage"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-1/2">
                      <Form.Label
                        htmlFor={field.name}
                        className="product-body-text-2-semibold"
                      >
                        Homepage
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            id={field.name}
                            type="text"
                            placeholder="Homepage"
                            {...field}
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
            <div className="flex w-full flex-row gap-x-4">
              <Form.Field
                control={form.control}
                name="github_username"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-1/2">
                      <Form.Label
                        htmlFor={field.name}
                        className="product-body-text-2-semibold"
                      >
                        Github username
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            id={field.name}
                            type="text"
                            placeholder="Github username"
                            {...field}
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
                name="twitter_username"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-1/2">
                      <Form.Label
                        htmlFor={field.name}
                        className="product-body-text-2-semibold"
                      >
                        Twitter username
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            id={field.name}
                            type="text"
                            placeholder="Twitter username"
                            {...field}
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

            <div className="w-full space-y-2">
              <Form.Field
                control={form.control}
                name="organization_bio"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full">
                      <Form.Label
                        htmlFor={field.name}
                        className="product-body-text-2-semibold"
                      >
                        Organization bio
                      </Form.Label>
                      <Form.Control>
                        <Textarea
                          placeholder="Content"
                          id={field.name}
                          {...field}
                          value={field.value || ""}
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
            </div>

            <div className="mt-8 w-full">
              <Button
                type="submit"
                className="w-full flex-1"
                variant="primary"
                size="lg"
              >
                {isLoading ? <LoadingSpin /> : "Create Organization"}
              </Button>
            </div>
          </form>
        </Form.Root>

        <Dialog.Close className="!right-6 !top-6" />
      </Dialog.Content>
    </Dialog.Root>
  );
};
