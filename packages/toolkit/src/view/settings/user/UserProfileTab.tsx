"use client";

import * as z from "zod";
import * as React from "react";

import { Setting } from "..";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Form,
  Input,
  Switch,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import {
  AuthenticatedUser,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useAuthenticatedUser,
  GeneralAppPageProp,
} from "../../../lib";
import { FormLabel } from "../FormLabel";
import { LoadingSpin, UploadImageFieldWithCrop } from "../../../components";
import { useUpdateAuthenticatedUser } from "../../../lib";

export const UserProfileTabSchema = z.object({
  id: z.string().min(1, "User name is required"),
  newsletter_subscription: z.boolean(),

  profile: z
    .object({
      avatar: z.string().optional(),
      display_name: z.string().optional(),
      company_name: z.string().optional(),
      bio: z.string().optional(),
      public_email: z.string().optional(),
      social_profile_links: z
        .object({
          github: z.string().optional(),
          x: z.string().optional(),
          website: z.string().optional(),
        })
        .optional(),
    })
    .optional(),
});

export type UserProfileTabProps = GeneralAppPageProp;

export const UserProfileTab = (props: UserProfileTabProps) => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken, enableQuery, router } = props;

  const { toast } = useToast();

  const me = useAuthenticatedUser({
    accessToken,
    enabled: enableQuery,
  });

  const form = useForm<z.infer<typeof UserProfileTabSchema>>({
    resolver: zodResolver(UserProfileTabSchema),
  });

  const { reset } = form;

  React.useEffect(() => {
    if (me.isError) {
      router.push("/404");
      return;
    }
    if (!me.isSuccess) return;

    reset(me.data);
  }, [me.data, me.isSuccess, me.isError, reset, router]);

  const updateAuthenticatedUser = useUpdateAuthenticatedUser();

  async function onSubmit(data: z.infer<typeof UserProfileTabSchema>) {
    if (!me.isSuccess || !accessToken || updateAuthenticatedUser.isPending)
      return;

    const payload: Partial<AuthenticatedUser> = {
      ...data,
      id: me.data.id,
    };

    try {
      await updateAuthenticatedUser.mutateAsync({ payload, accessToken });

      if (amplitudeIsInit) {
        sendAmplitudeData("update_user_profile_settings");
      }

      form.reset(payload);
      toast({
        title: "Profile updated successfully",
        variant: "alert-success",
        size: "small",
      });
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when updating your profile.",
        error,
        toast,
      });
    }
  }

  return (
    <Setting.TabRoot>
      <Setting.TabHeader
        title="Profile"
        description="Update your personal details here."
      />
      <Form.Root {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
          <Setting.TabSectionRoot>
            <Setting.TabSectionHeader
              title="Public profile"
              description="This will be displayed on your profile."
            />
            <Setting.TabSectionContent className="gap-y-4">
              <Form.Field
                control={form.control}
                name="profile.display_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label className="product-body-text-3-semibold">
                        Display name
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            type="text"
                            className="!product-body-text-2-regular"
                            value={field.value ?? ""}
                            autoComplete="off"
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
                name="id"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full">
                      <Form.Label className="product-body-text-3-semibold">
                        Username
                      </Form.Label>
                      <div className="group flex flex-row rounded-sm focus-within:outline focus-within:outline-2 focus-within:outline-semantic-accent-default">
                        <div className="rounded-l-sm border-b border-l border-r border-t border-semantic-bg-line bg-semantic-bg-primary px-4 py-2.5">
                          <span className="text-semantic-fg-primary product-body-text-3-regular">
                            instill.tech/
                          </span>
                        </div>
                        <div className="w-full">
                          <Form.Control>
                            <Input.Root className="h-full !rounded-l-none !border-l-none focus-within:!border-semantic-bg-line focus-within:!outline-none">
                              <Input.Core
                                {...field}
                                className="pl-2 !product-body-text-2-regular"
                                disabled={true}
                                type="text"
                                placeholder=""
                                required={false}
                                value={field.value || ""}
                              />
                            </Input.Root>
                          </Form.Control>
                        </div>
                      </div>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />

              <Form.Field
                control={form.control}
                name="profile.company_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label className="product-body-text-3-semibold">
                        Company name
                      </Form.Label>
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            type="text"
                            className="!product-body-text-2-regular"
                            value={field.value ?? ""}
                            autoComplete="off"
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
                name="profile.bio"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <div className="flex flex-row justify-between">
                        <Form.Label
                          className="product-body-text-3-semibold"
                          id="user-proifle-bio"
                        >
                          Bio
                        </Form.Label>
                        <p className=" text-semantic-fg-secondary product-body-text-4-regular">
                          optional
                        </p>
                      </div>
                      <Form.Control>
                        <Textarea
                          {...field}
                          value={field.value ?? ""}
                          autoComplete="off"
                          className="!resize-y !text-[#1D2433] !text-opacity-80 !product-body-text-2-regular focus-visible:!ring-1"
                        />
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
            </Setting.TabSectionContent>
          </Setting.TabSectionRoot>
          <Setting.TabSectionSeparator />
          <Setting.TabSectionRoot>
            <Setting.TabSectionHeader
              title="Your photo"
              description="This will be displayed on your profile."
            />
            <Setting.TabSectionContent className="gap-y-4">
              <UploadImageFieldWithCrop
                fieldName="profile.avatar"
                form={form}
                title="Upload your image"
                rounded
                showAsOptional
              />
            </Setting.TabSectionContent>
          </Setting.TabSectionRoot>
          <Setting.TabSectionSeparator />
          <Setting.TabSectionRoot>
            <Setting.TabSectionHeader
              title="Newsletter"
              description="Receive the latest news from Instill AI"
            />
            <Setting.TabSectionContent className="gap-y-4">
              <Form.Field
                control={form.control}
                name="newsletter_subscription"
                render={({ field }) => {
                  return (
                    <div className="flex-rol flex gap-x-3">
                      <div className="pt-1">
                        <Form.Control>
                          <Switch
                            checked={field.value}
                            onCheckedChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                        </Form.Control>
                      </div>
                      <div className="flex flex-col">
                        <p className="text-semantic-fg-primary product-body-text-2-semibold">
                          Subscribe to our newsletter
                        </p>
                        <p className="text-semantic-fg-secondary product-body-text-2-regular">
                          open source updates, community highlights, blog posts,
                          useful tutorials and more!
                        </p>
                      </div>
                    </div>
                  );
                }}
              />
            </Setting.TabSectionContent>
          </Setting.TabSectionRoot>
          <Setting.TabSectionSeparator />
          <Setting.TabSectionRoot>
            <Setting.TabSectionHeader
              title="Social profiles"
              description="Add your social profile"
            />
            <Setting.TabSectionContent className="gap-y-4">
              <Form.Field
                control={form.control}
                name="profile.social_profile_links.github"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <FormLabel title="GitHub profile link" optional={true} />
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            disabled={false}
                            type="text"
                            placeholder="GitHub profile link"
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
                name="profile.social_profile_links.x"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <FormLabel title="X profile link" optional={true} />
                      <Form.Control>
                        <Input.Root>
                          <Input.Core
                            {...field}
                            disabled={false}
                            type="text"
                            placeholder="X profile link"
                            value={field.value || ""}
                          />
                        </Input.Root>
                      </Form.Control>
                      <Form.Message />
                    </Form.Item>
                  );
                }}
              />
            </Setting.TabSectionContent>
          </Setting.TabSectionRoot>
          <Setting.TabSectionSeparator />
          <div className="flex flex-row-reverse">
            <Button type="submit" size="lg" variant="primary">
              {updateAuthenticatedUser.isPending ? (
                <LoadingSpin className="!h-4 !w-4" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </Form.Root>
    </Setting.TabRoot>
  );
};
