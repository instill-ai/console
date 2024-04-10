"use client";

import * as React from "react";
import * as z from "zod";
import { Setting } from "..";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, Input } from "@instill-ai/design-system";
import { useAuthenticatedUser, GeneralAppPageProp } from "../../../lib";

const UserAccountTabSchema = z.object({
  email: z.string(),
});

export type UserAccountTabProps = GeneralAppPageProp;

export const UserAccountTab = (props: UserAccountTabProps) => {
  const { accessToken, enableQuery, router } = props;

  const me = useAuthenticatedUser({
    enabled: enableQuery,
    accessToken: accessToken,
  });

  const form = useForm<z.infer<typeof UserAccountTabSchema>>({
    resolver: zodResolver(UserAccountTabSchema),
  });

  const { reset } = form;

  React.useEffect(() => {
    if (me.isError) {
      router.push("/404");
      return;
    }
    if (!me.isSuccess) return;

    reset({
      email: me.data?.email ?? "",
    });
  }, [me.data, me.isError, router, me.isSuccess, reset]);

  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="Account"
        description="Update your account details here."
      />
      <Form.Root {...form}>
        <form className="flex flex-col">
          <Setting.TabSectionRoot>
            <Setting.TabSectionHeader
              title="Primary Email"
              description="We will use this email to communicate with you."
            />
            <Setting.TabSectionContent>
              <Form.Field
                control={form.control}
                name="email"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label className="product-body-text-3-semibold">
                        Primary Email
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            type="text"
                            disabled={true}
                            className="!product-body-text-2-regular"
                            value={field.value ?? ""}
                            autoComplete="off"
                          />
                        </Input.Root>
                      </Form.Control>
                      <Form.Message />
                      <Form.Description
                        className=" text-semantic-fg-secondary product-body-text-4-regular"
                        text="This is also the email to use to authenticate on Instill.tech"
                      />
                    </Form.Item>
                  );
                }}
              />
            </Setting.TabSectionContent>
          </Setting.TabSectionRoot>
        </form>
      </Form.Root>
    </Setting.TabRoot>
  );
};
