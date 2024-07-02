"use client";

import * as React from "react";
import cn from "clsx";
import AvatarEditor from "react-avatar-editor";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  Nullable,
} from "@instill-ai/design-system";

import { stringToHash32Bit } from "../lib";
import { FormLabel } from "../view/settings/FormLabel";
import { ImageWithFallback } from "./ImageWithFallback";

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
  isDeletable,
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
  isDeletable?: boolean;
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [image, setImage] = React.useState<Nullable<string | File>>(null);
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

  const onUpdate = (field: ControllerRenderProps, file?: File) => {
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
  };

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
                <label
                  htmlFor={`upload-image-field-${imageInputId}`}
                  className={cn(
                    "cursor-pointer flex w-full flex-col items-center justify-center py-4 rounded-sm border border-semantic-bg-line [&>*]:pointer-events-none",
                    isHovered
                      ? "border-semantic-accent-hover outline outline-1 outline-semantic-accent-hover"
                      : "[&_label]:!pointer-events-auto",
                  )}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={async (event) => {
                    event.preventDefault();

                    onUpdate(field, event.dataTransfer.files?.[0]);
                    setIsHovered(false);
                  }}
                  onDragEnter={() => setIsHovered(true)}
                  onDragLeave={() => setIsHovered(false)}
                >
                  <ImageWithFallback
                    src={image ? String(image) : field.value}
                    alt={title}
                    className={cn(
                      "h-[150px] object-contain",
                      rounded ? "rounded-full" : null,
                    )}
                    width={150}
                    height={150}
                    fallbackImg={
                      placeholder || (
                        <div className="py-6 gap-y-4 flex flex-col items-center pointer-events-none">
                          <Icons.Upload01 className="h-8 w-8 [&>path]:stroke-[1.5] stroke-semantic-fg-secondary" />
                          <p className="text-xs text-semantic-fg-primary">
                            Drag-and-drop a file, or{" "}
                            <span className="text-semantic-accent-default">
                              browse computer
                            </span>
                          </p>
                        </div>
                      )
                    }
                  />
                  <Input.Root className="hidden">
                    <Input.Core
                      {...field}
                      id={`upload-image-field-${imageInputId}`}
                      type="file"
                      accept="images/*"
                      value={undefined}
                      onChange={async (e) => {
                        onUpdate(field, e.target.files?.[0]);

                        // reset the input value so selecting the same file can trigger onChange
                        e.target.value = "";
                      }}
                    />
                  </Input.Root>
                </label>
              </Form.Control>
              {(isDeletable && field.value) || image ? (
                <div className="flex w-full flex-row rounded border border-semantic-bg-line px-2 py-1.5">
                  <Icons.File05 className="mr-2 h-5 w-5 stroke-semantic-fg-secondary" />
                  <p className="w-[180px] truncate text-semantic-fg-primary product-body-text-3-regular">
                    {image && typeof image !== "string"
                      ? image.name
                      : stringToHash32Bit(image || field.value)}
                  </p>
                  <button
                    onClick={() => {
                      field.onChange("");
                      setImage(null);
                    }}
                    className="ml-auto rounded p-1 hover:bg-semantic-bg-secondary"
                    type="button"
                  >
                    <Icons.X className="h-4 w-4 stroke-semantic-fg-secondary" />
                  </button>
                </div>
              ) : null}
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
