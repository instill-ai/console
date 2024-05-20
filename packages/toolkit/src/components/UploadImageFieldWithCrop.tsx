"use client";

import * as React from "react";
import { Button, Dialog, Form, Input } from "@instill-ai/design-system";
import { FormLabel } from "../view/settings/FormLabel";
import AvatarEditor from "react-avatar-editor";
import { UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import cn from "clsx";

const DEFAULT_DIMENSIONS = {
  width: 300,
  height: 300,
};

export const UploadImageFieldWithCrop = ({
  fieldName,
  form,
  placeholder,
  title,
  dimensions = DEFAULT_DIMENSIONS,
  rounded,
  showAsOptional,
}: {
  fieldName: string;
  title: string;
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  form: UseFormReturn<any>;
  placeholder?: React.ReactNode;
  dimensions?: {
    width: number;
    height: number;
  };
  rounded?: boolean;
  showAsOptional?: boolean;
}) => {
  const [image, setImage] = React.useState<string | File | null>(null);
  const [openImage, setOpenImage] = React.useState<boolean>(false);
  const editorRef = React.useRef<AvatarEditor>(null);
  const [imageInputId] = React.useState(uuidv4());

  function handleSetProfilePicture() {
    // Save the cropped image as a file or perform any other actions here
    // For simplicity, let's assume you have a function to handle image upload
    const croppedImage = editorRef.current
      ?.getImageScaledToCanvas()
      ?.toDataURL();
    setImage(croppedImage ?? null);
    form.setValue(fieldName, croppedImage ?? undefined);
    // Close the dialog or perform any other actions
    setOpenImage(false);
  }

  function handleCancelCropProfile() {
    setOpenImage(false);
    setImage(null);

    form.resetField(fieldName);
  }

  return (
    <React.Fragment>
      <Form.Field
        control={form.control}
        name={fieldName}
        render={({ field }) => {
          return (
            <Form.Item className="w-full">
              <FormLabel title={title} optional={showAsOptional} />
              <Form.Control>
                <div>
                  <label
                    htmlFor={`upload-image-field-${imageInputId}`}
                    className="flex w-full cursor-pointer flex-col items-center justify-center rounded border border-dashed border-semantic-bg-line bg-semantic-bg-base-bg py-4 text-semantic-fg-secondary product-body-text-3-medium"
                  >
                    {field.value ? (
                      <img
                        src={image ? String(image) : field.value}
                        alt={title}
                        className={cn(
                          "h-[150px] object-contain",
                          rounded ? "rounded-full" : null
                        )}
                      />
                    ) : placeholder ? (
                      placeholder
                    ) : (
                      <p>Upload your image</p>
                    )}

                    <Input.Root className="hidden">
                      <Input.Core
                        {...field}
                        id={`upload-image-field-${imageInputId}`}
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
                              setImage(String(result));
                            };
                            reader.readAsDataURL(file);
                            setOpenImage(true);
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
      <Dialog.Root open={openImage}>
        <Dialog.Content className="!w-auto">
          <Dialog.Header>
            <Dialog.Title>Crop your image</Dialog.Title>
          </Dialog.Header>
          <div className="flex items-center justify-center">
            {image ? (
              <AvatarEditor
                ref={editorRef}
                image={image}
                width={dimensions.width}
                height={dimensions.height}
                border={20}
                borderRadius={rounded ? 9999 : 0}
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
