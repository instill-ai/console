import { Button, Form, Icons, Logos } from "@instill-ai/design-system";
import { Nullable, useInstillForm, useUser } from "../../lib";
import { TabBase } from "../user-settings/TabBase";
import { CreateOrganizationDialog } from "./CreateOrganizationDialog";
import Link from "next/link";
import { z } from "zod";
import * as React from "react";

export type OrganizationSettingsProps = {
  accessToken: Nullable<string>;
  enableQuery: boolean;
};

export const OrganizationSettings = (props: OrganizationSettingsProps) => {
  const { accessToken, enableQuery } = props;

  const [data, setData] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const user = useUser({
    enabled: enableQuery,
    accessToken,
  });

  const { form, fields, ValidatorSchema, formTree } = useInstillForm(
    {
      title: "Organization",
      type: "object",
      required: ["name", "email", "username"],
      properties: {
        username: {
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
          example: "open.com",
        },
      },
    },
    null
  );

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
          <form className="w-full">
            <div className="mb-5 flex flex-col gap-y-5">{fields}</div>
            <div className="flex flex-row-reverse">
              <Button
                type="button"
                size="lg"
                variant="primary"
                onClick={() => {
                  const data = form.getValues();

                  try {
                    const parsedData = ValidatorSchema.parse(data);
                    setData(JSON.stringify(parsedData, null, 2));
                    setError(null);
                  } catch (err) {
                    if (err instanceof z.ZodError) {
                      setError(JSON.stringify(err, null, 2));
                    }
                  }
                }}
              >
                Save Change
              </Button>
            </div>
          </form>
        </Form.Root>
      </div>
    </div>
  );
};
