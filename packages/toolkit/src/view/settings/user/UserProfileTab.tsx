import * as z from "zod";
import * as React from "react";

import { Setting, instillUserRoles } from "..";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  Form,
  Input,
  Switch,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import {
  AuthenticatedUser,
  InstillStore,
  sendAmplitudeData,
  toastInstillError,
  useAmplitudeCtx,
  useInstillStore,
  useShallow,
  useAuthenticatedUser,
} from "../../../lib";
import { FormLabel } from "../FormLabel";
import { LoadingSpin } from "../../../components";
import AvatarEditor from "react-avatar-editor";
import { useUpdateAuthenticatedUser } from "../../../lib";

export const UserProfileTabSchema = z.object({
  id: z.string().min(1, "User name is required"),
  profile_avatar: z.string().optional(),
  newsletter_subscription: z.boolean(),

  profile: z
    .object({
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

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const UserProfileTab = () => {
  const { amplitudeIsInit } = useAmplitudeCtx();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const { toast } = useToast();
  const [profileAvatar, setProfileAvatar] = React.useState<
    string | File | null
  >(null);
  const [isOpenProfileAvatar, setIsOpenProfileAvatar] =
    React.useState<boolean>(false);

  const editorRef = React.useRef<AvatarEditor>(null);

  const me = useAuthenticatedUser({
    accessToken,
    enabled: enabledQuery,
  });

  const form = useForm<z.infer<typeof UserProfileTabSchema>>({
    resolver: zodResolver(UserProfileTabSchema),
  });

  const { reset } = form;

  React.useEffect(() => {
    if (!me.isSuccess) return;

    reset(me.data);
  }, [me.data, me.isSuccess, reset]);

  const updateAuthenticatedUser = useUpdateAuthenticatedUser();

  async function onSubmit(data: z.infer<typeof UserProfileTabSchema>) {
    if (!me.isSuccess || !accessToken || updateAuthenticatedUser.isLoading)
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

  function handleSetProfilePicture() {
    // Save the cropped image as a file or perform any other actions here
    // For simplicity, let's assume you have a function to handle image upload
    const croppedImage = editorRef.current
      ?.getImageScaledToCanvas()
      ?.toDataURL();
    setProfileAvatar(croppedImage ?? null);
    // Close the dialog or perform any other actions
    setIsOpenProfileAvatar(false);
  }

  function handleCancelCropProfile() {
    setIsOpenProfileAvatar(false);
    setProfileAvatar(null);

    form.resetField("profile_avatar");
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
              <Form.Field
                control={form.control}
                name="profile_avatar"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full">
                      <FormLabel
                        title="Upload your profile test"
                        optional={true}
                      />
                      <Form.Control>
                        <div>
                          <label
                            htmlFor="org-logo-input"
                            className="flex h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded border border-dashed border-semantic-bg-line bg-semantic-bg-base-bg text-semantic-fg-secondary product-body-text-3-medium"
                          >
                            {field.value ? (
                              <img
                                src={
                                  profileAvatar
                                    ? String(profileAvatar)
                                    : field.value
                                }
                                alt={`${me.data?.name}-profile`}
                                className="h-[150px] rounded-full object-contain"
                              />
                            ) : (
                              <p>Upload your profile test</p>
                            )}

                            <Input.Root className="hidden">
                              <Input.Core
                                {...field}
                                id="org-logo-input"
                                type="file"
                                accept="images/*"
                                value={undefined}
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const reader = new FileReader();
                                    reader.onload = () => {
                                      const result = reader.result;
                                      field.onChange(result);
                                      setProfileAvatar(String(result));
                                    };
                                    reader.readAsDataURL(file);
                                    setIsOpenProfileAvatar(true);
                                  }
                                }}
                              />
                            </Input.Root>
                          </label>
                        </div>
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
              {updateAuthenticatedUser.isLoading ? (
                <LoadingSpin className="!h-4 !w-4" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </Form.Root>
      <Dialog.Root open={isOpenProfileAvatar}>
        <Dialog.Content className="!w-[400px]">
          <Dialog.Header>
            <Dialog.Title>Crop your new profile picture</Dialog.Title>
          </Dialog.Header>
          <div className="flex items-center justify-center">
            {profileAvatar ? (
              <AvatarEditor
                ref={editorRef}
                image={profileAvatar}
                width={300}
                height={300}
                border={20}
                borderRadius={9999}
                color={[248, 249, 252]}
                scale={1}
              />
            ) : null}
          </div>
          <div className="flex flex-row justify-between gap-x-4">
            <Button
              onClick={() => handleSetProfilePicture()}
              variant="primary"
              className="w-full"
            >
              Set new profile picture
            </Button>
            <Button
              onClick={() => handleCancelCropProfile()}
              variant="secondaryGrey"
              className="w-full"
            >
              Cancel
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Root>
    </Setting.TabRoot>
  );
};
