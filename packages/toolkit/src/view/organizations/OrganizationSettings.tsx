import {
  Button,
  Form,
  Icons,
  Input,
  Logos,
  toast,
} from "@instill-ai/design-system";
import {
  InstillJSONSchema,
  Nullable,
  useUpdateOrganization,
  useInstillForm,
  useOrganization,
  useUser,
} from "../../lib";
import { z } from "zod";
import * as React from "react";
import { useRouter } from "next/router";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export type OrganizationSettingsProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
  disabledAll: boolean;
  organizationName: Nullable<string>;
};

const OrganisationSettingsSchema: InstillJSONSchema = {
  title: "Organization",
  type: "object",
  required: ["name", "email", "username"],
  properties: {
    org_name: {
      description: "",
      instillFormat: "text",
      anyOf: [
        {
          type: "string",
          instillUpstreamType: "value",
        },
        {
          type: "string",
          instillUpstreamType: "reference",
        },
        {
          type: "string",
          instillUpstreamType: "template",
        },
      ],
      instillUpstreamTypes: ["value", "reference"],
      title: "Organisation Username",
      example: "open-ai",
    },
    email: {
      description: "",
      instillFormat: "text",
      anyOf: [
        {
          type: "string",
          instillUpstreamType: "value",
        },
        {
          type: "string",
          instillUpstreamType: "reference",
        },
        {
          type: "string",
          instillUpstreamType: "template",
        },
      ],
      instillUpstreamTypes: ["value", "reference"],
      title: "Email",
      example: "sam.altman@openai.com",
    },
    name: {
      description: "",
      instillFormat: "text",
      anyOf: [
        {
          type: "string",
          instillUpstreamType: "value",
        },
        {
          type: "string",
          instillUpstreamType: "reference",
        },
        {
          type: "string",
          instillUpstreamType: "template",
        },
      ],
      instillUpstreamTypes: ["value", "reference"],
      title: "Organisation Domain Name",
      example: "openai.com",
    },
  },
};

const UpdateOrganizationSchema = z.object({
  id: z.string().nonempty(),
  org_name: z.string().nonempty(),
  name: z.nullable(z.string()),
  email: z.nullable(z.string()),
});

export const OrganizationSettings = (props: OrganizationSettingsProps) => {
  const { accessToken, enableQuery, disabledAll, organizationName } = props;

  const organization = useOrganization({
    organizationName: organizationName,
    enabled: enableQuery,
    retry: false,
    accessToken,
  });

  const updateOrganization = useUpdateOrganization();

  const form = useForm<z.infer<typeof UpdateOrganizationSchema>>({
    resolver: zodResolver(UpdateOrganizationSchema),
    defaultValues: {
      id: "",
      org_name: "",
      name: null,
      email: null,
    },
  });

  const onSubmit = (data: z.infer<typeof UpdateOrganizationSchema>) => {
    if (!accessToken) return;

    const payload = {
      id: data.id,
      org_name: data.org_name,
      name: null,
      email: null,
    };

    updateOrganization.mutate(
      { payload, accessToken, organizationName },
      {
        onSuccess: () => {
          toast({
            title: "Organization updated!",
            variant: "alert-success",
            size: "small",
          });
        },
        onError: (err) => {
          if (isAxiosError(err)) {
            toast({
              title: "Something went wrong!",
              variant: "alert-error",
              size: "small",
            });
          }
        },
      }
    );
  };

  React.useEffect(() => {
    if (organization.data) {
      form.setValue("org_name", organization.data.org_name);
    }
  }, [organization.data]);

  return (
    <div className="flex flex-col">
      <div className="mb-6">
        <div className="mb-5 flex flex-row">
          <p className="text-lg font-semibold leading-7 text-[#101828]">
            Account Settings
          </p>
        </div>
        <div className="border-b border-b-[#EAECF0]" />
      </div>

      <div className="flex h-full w-full flex-col">
        <Form.Root {...form}>
          <form
            className="w-full space-y-3"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <Form.Field
              control={form.control}
              name="org_name"
              render={({ field }) => {
                return (
                  <Form.Item className="w-full">
                    <Form.Label
                      htmlFor={field.name}
                      className=""
                    >
                      Organization username
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          id={field.name}
                          type="text"
                          placeholder="Username"
                          {...field}
                          value={field.value || ""}
                          disabled={disabledAll}
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
              name="email"
              render={({ field }) => {
                return (
                  <Form.Item className="w-full">
                    <Form.Label
                      htmlFor={field.name}
                      className=""
                    >
                      Email
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          id={field.name}
                          type="text"
                          placeholder="Email"
                          {...field}
                          value={field.value || ""}
                          disabled={disabledAll}
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
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item className="w-full">
                    <Form.Label
                      htmlFor={field.name}
                      className=""
                    >
                      Organisation Domain Name
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          id={field.name}
                          type="text"
                          placeholder="Name"
                          {...field}
                          value={field.value || ""}
                          disabled={disabledAll}
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                  </Form.Item>
                );
              }}
            />
            {disabledAll === false ? (
              <div className="flex flex-row-reverse pt-1">
                <Button type="submit" size="lg" variant="primary">
                  Submit
                </Button>
              </div>
            ) : null}
          </form>
        </Form.Root>
      </div>
    </div>
  );
};
