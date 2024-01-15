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
  Select,
  Switch,
  Textarea,
  useToast,
} from "@instill-ai/design-system";
import {
  InstillStore,
  User,
  toastInstillError,
  useInstillStore,
  useShallow,
  useUpdateUser,
  useUserMe,
} from "../../../lib";
import { FormLabel } from "../FormLabel";
import { LoadingSpin } from "../../../components";
import AvatarEditor from "react-avatar-editor";

export const UserProfileTabSchema = z.object({
  last_name: z.string().optional().nullable(),
  first_name: z.string().optional().nullable(),
  id: z.string().min(1, "User name is required"),
  role: z.string().optional().nullable(),
  profile_avatar: z.string().optional().nullable(),
  newsletter_subscription: z.boolean(),
  profile_data: z
    .object({
      bio: z.string().optional().nullable(),
      github: z.string().optional().nullable(),
      twitter: z.string().optional().nullable(),
    })
    .optional(),
});

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const UserProfileTab = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const { toast } = useToast();
  const [profileAvatar, setProfileAvatar] = React.useState<
    string | File | null
  >(null);
  const [isOpenProfileAvatar, setIsOpenProfileAvatar] =
    React.useState<boolean>(false);

  const editorRef = React.useRef(null);

  const user = useUserMe({
    accessToken,
    enabled: enabledQuery,
  });

  const form = useForm<z.infer<typeof UserProfileTabSchema>>({
    resolver: zodResolver(UserProfileTabSchema),
  });

  const { reset } = form;

  React.useEffect(() => {
    if (!user.isSuccess) return;

    reset(user.data);
  }, [user.data, user.isSuccess, reset]);

  const updateUser = useUpdateUser();

  async function onSubmit(data: z.infer<typeof UserProfileTabSchema>) {
    if (!user.isSuccess || !accessToken || updateUser.isLoading) return;

    const payload: Partial<User> = {
      id: user.data.id,
      first_name: data.first_name ?? undefined,
      last_name: data.last_name ?? undefined,
      role: data.role ?? undefined,
      profile_avatar: profileAvatar
        ? String(profileAvatar)
        : data.profile_avatar ?? undefined,
      profile_data: {
        ...user.data.profile_data,
        bio: data.profile_data?.bio ?? undefined,
        github: data.profile_data?.github ?? undefined,
        twitter: data.profile_data?.twitter ?? undefined,
      },
      newsletter_subscription: data.newsletter_subscription,
    };

    try {
      await updateUser.mutateAsync({ payload, accessToken });
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

  const handleSetProfilePicture = () => {
    // Save the cropped image as a file or perform any other actions here
    // For simplicity, let's assume you have a function to handle image upload
    const croppedImage = editorRef.current
      // @ts-ignore
      ?.getImageScaledToCanvas()
      ?.toDataURL();
    setProfileAvatar(croppedImage);
    // Close the dialog or perform any other actions
    setIsOpenProfileAvatar(false);
  };

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
                name="first_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label className="product-body-text-3-semibold">
                        First name
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
                name="last_name"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <Form.Label className="product-body-text-3-semibold">
                        Last name
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
                name="role"
                render={({ field }) => {
                  return (
                    <Form.Item className="w-full">
                      <div className="flex flex-row justify-between">
                        <Form.Label className="product-body-text-3-semibold">
                          Role
                        </Form.Label>
                        <p className=" text-semantic-fg-secondary product-body-text-4-regular">
                          optional
                        </p>
                      </div>
                      <Form.Control>
                        <Select.Root
                          value={field?.value || ""}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger className="w-full">
                            <Select.Value placeholder="Select Role" />
                          </Select.Trigger>
                          <Select.Content>
                            <Select.Group>
                              {instillUserRoles.map((role) => (
                                <Select.Item
                                  value={role.value}
                                  key={role.value}
                                >
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
                name="profile_data.bio"
                render={({ field }) => {
                  return (
                    <Form.Item>
                      <div className="flex flex-row justify-between">
                        <Form.Label className="product-body-text-3-semibold">
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
                                  profileAvatar ? String(profileAvatar) : field.value
                                }
                                alt={`${user.data?.name}-profile`}
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
                name="profile_data.github"
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
                name="profile_data.twitter"
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
              {updateUser.isLoading ? (
                <LoadingSpin className="!h-4 !w-4" />
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </Form.Root>
      <Dialog.Root open={isOpenProfileAvatar}>
        <Dialog.Content className="w-[400px]">
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
                color={[248,249,252]}
                scale={1}
              />
            ) : null}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => handleSetProfilePicture()}
              variant={"primary"}
              className="w-full"
            >
              Set new profile picture
            </Button>
          </div>
          <Dialog.Close />
        </Dialog.Content>
      </Dialog.Root>
    </Setting.TabRoot>
  );
};
