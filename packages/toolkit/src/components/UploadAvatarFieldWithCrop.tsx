"use client";

import * as React from "react";
import { Button, Dialog, Form, Input } from "@instill-ai/design-system";
import { FormLabel } from "../view/settings/FormLabel";
import AvatarEditor from "react-avatar-editor";
import { UseFormReturn } from "react-hook-form";

export const UploadAvatarFieldWithCrop = ({
  fieldName,
  form,
  placeholder,
  title,
}: {
  fieldName: string;

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: UseFormReturn<any>;
  placeholder?: React.ReactNode;
  title?: string;
}) => {
  const [profileAvatar, setProfileAvatar] = React.useState<
    string | File | null
  >(null);
  const [openProfileAvatar, setOpenProfileAvatar] =
    React.useState<boolean>(false);
  const editorRef = React.useRef<AvatarEditor>(null);

  function handleSetProfilePicture() {
    // Save the cropped image as a file or perform any other actions here
    // For simplicity, let's assume you have a function to handle image upload
    const croppedImage = editorRef.current
      ?.getImageScaledToCanvas()
      ?.toDataURL();
    setProfileAvatar(croppedImage ?? null);
    form.setValue(fieldName, croppedImage ?? undefined);
    // Close the dialog or perform any other actions
    setOpenProfileAvatar(false);
  }

  function handleCancelCropProfile() {
    setOpenProfileAvatar(false);
    setProfileAvatar(null);

    form.resetField("profile.avatar");
  }

  return (
    <React.Fragment>
      <Form.Field
        control={form.control}
        name={fieldName}
        render={({ field }) => {
          return (
            <Form.Item className="w-full">
              <FormLabel
                title={title || "Upload your profile"}
                optional={true}
              />
              <Form.Control>
                <div>
                  <label
                    htmlFor="upload-avatar-field"
                    className="flex h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded border border-dashed border-semantic-bg-line bg-semantic-bg-base-bg text-semantic-fg-secondary product-body-text-3-medium"
                  >
                    {field.value ? (
                      <img
                        src={
                          profileAvatar ? String(profileAvatar) : field.value
                        }
                        alt="avatar-profile"
                        className="h-[150px] rounded-full object-contain"
                      />
                    ) : placeholder ? (
                      placeholder
                    ) : (
                      <p>Upload your avatar</p>
                    )}

                    <Input.Root className="hidden">
                      <Input.Core
                        {...field}
                        id="upload-avatar-field"
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
                            setOpenProfileAvatar(true);
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
      <Dialog.Root open={openProfileAvatar}>
        <Dialog.Content className="!w-[400px]">
          <Dialog.Header>
            <Dialog.Title>Crop your image</Dialog.Title>
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
              Set
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
    </React.Fragment>
  );
};
