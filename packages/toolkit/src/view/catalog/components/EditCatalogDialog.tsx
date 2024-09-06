"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Dialog,
  Form,
  Input,
  Textarea,
} from "@instill-ai/design-system";

import { LoadingSpin } from "../../../components";
import { MAX_DESCRIPTION_LENGTH } from "./lib/constant";

const EditCatalogFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`,
    })
    .optional(),
  tags: z.string().optional(),
});

export type EditCatalogDialogData = z.infer<typeof EditCatalogFormSchema>;

type EditCatalogDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: EditCatalogDialogData) => Promise<void>;
  initialValues: {
    name: string;
    description: string;
    tags: string[];
  };
};

export const EditCatalogDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: EditCatalogDialogProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<EditCatalogDialogData>({
    resolver: zodResolver(EditCatalogFormSchema),
    defaultValues: {
      ...initialValues,
      tags: initialValues.tags.join(", "),
    },
    mode: "onChange",
  });

  const { formState, reset, watch } = form;
  const description = watch("description");

  React.useEffect(() => {
    if (isOpen) {
      reset({
        ...initialValues,
        tags: initialValues.tags.join(", "),
      });
    }
  }, [isOpen, initialValues, reset]);

  const handleSubmit = async (data: EditCatalogDialogData) => {
    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        tags: data.tags
          ? Array.isArray(data.tags)
            ? data.tags.join(", ")
            : data.tags
          : undefined,
      };
      await onSubmit(formattedData);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Error updating catalog:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="!w-[600px] rounded-md">
        <Dialog.Header className="flex justify-between">
          <Dialog.Title className="text-semantic-fg-primary !product-body-text-1-semibold">
            Edit catalog
          </Dialog.Title>
          <Dialog.Close className="!focus:ring-0 !active:ring-0 !focus:outline-none !focus:ring-offset-0 !rounded-none !bg-transparent !shadow-none !ring-0 before:!hidden after:!hidden" />
        </Dialog.Header>

        <Form.Root {...form}>
          <form
            className="flex flex-col space-y-5"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.Item>
                  <Form.Label className="text-semantic-fg-primary product-button-button-2">
                    Catalog Name
                  </Form.Label>
                  <Form.Control>
                    <Input.Root>
                      <Input.Core
                        {...field}
                        id={field.name}
                        placeholder="Catalog name"
                        disabled={true}
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.Item className="!space-y-1">
                  <div className="flex items-center justify-between">
                    <Form.Label className="mb-1 text-semantic-fg-primary product-button-button-2">
                      Description
                    </Form.Label>
                    <p className="my-auto text-semantic-fg-secondary product-body-text-4-regular">
                      Optional
                    </p>
                  </div>
                  <Form.Control>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Fill with a short description"
                      className="min-h-[100px] whitespace-pre-wrap"
                      maxLength={MAX_DESCRIPTION_LENGTH}
                    />
                  </Form.Control>
                  <Form.Message />
                  <div className="text-right text-semantic-fg-secondary product-body-text-4-regular">
                    {description?.length || 0}/{MAX_DESCRIPTION_LENGTH}
                  </div>
                </Form.Item>
              )}
            />
            <Form.Field
              control={form.control}
              name="tags"
              render={({ field }) => {
                return (
                  <Form.Item className="flex flex-col gap-y-1">
                    <div className="flex items-center justify-between">
                      <Form.Label className="product-body-text-3-semibold">
                        Tags
                      </Form.Label>
                      <p className="my-auto text-semantic-fg-secondary product-body-text-4-regular">
                        Optional
                      </p>
                    </div>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          className="!product-body-text-2-regular"
                          type="text"
                          placeholder="Add a tag"
                          required={false}
                        />
                      </Input.Root>
                    </Form.Control>
                    <Form.Message />
                    <p className="text-xs text-semantic-fg-secondary">
                      {`Separate tags with a comma.`}
                    </p>
                  </Form.Item>
                );
              }}
            />
            <div className="mt-8 flex justify-end gap-x-3">
              <Button variant="secondaryGrey" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="text-semantic-fg-on-default"
                disabled={!formState.isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpin className="!text-semantic-fg-secondary" />
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
