"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  Textarea,
} from "@instill-ai/design-system";

import { EntitySelector, LoadingSpin } from "../../../components";
import { resourceIdPrefix } from "../../../constant";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import { useUserNamespaces } from "../../../lib/useUserNamespaces";
import { formatResourceId } from "../../../server";
import { MAX_DESCRIPTION_LENGTH } from "./lib/constant";
import { convertTagsToArray } from "./lib/helpers";

export const CreateCatalogFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().optional(),
  tags: z.string().optional(),
  namespaceId: z.string().min(1, { message: "Namespace is required" }),
});

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  updateNavigationNamespaceAnchor: store.updateNavigationNamespaceAnchor,
});

type CreateCatalogDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof CreateCatalogFormSchema>) => Promise<void>;
};

export const CreateCatalogDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: CreateCatalogDialogProps) => {
  const router = useRouter();
  const [creating, setCreating] = React.useState(false);

  const { navigationNamespaceAnchor, updateNavigationNamespaceAnchor } =
    useInstillStore(useShallow(selector));

  const userNamespaces = useUserNamespaces();

  const form = useForm<z.infer<typeof CreateCatalogFormSchema>>({
    resolver: zodResolver(CreateCatalogFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: "",
      namespaceId: navigationNamespaceAnchor || "",
    },
    mode: "onChange",
  });

  const { formState, watch, setValue } = form;
  const nameValue = watch("name");
  const description = watch("description");

  const formattedName = formatResourceId(nameValue, resourceIdPrefix.catalog);

  React.useEffect(() => {
    if (isOpen) {
      form.reset({
        name: "",
        description: "",
        tags: "",
        namespaceId: navigationNamespaceAnchor || "",
      });
    }
  }, [isOpen, navigationNamespaceAnchor, form]);

  const handleSubmit = async (
    data: z.infer<typeof CreateCatalogFormSchema>,
  ) => {
    if (!formattedName) {
      return;
    }

    setCreating(true);

    try {
      const formattedData = {
        ...data,
        name: formattedName,
        tags: convertTagsToArray(data.tags).join(", "),
      };

      await onSubmit(formattedData);

      // Update the navigation namespace anchor if a different namespace was selected
      if (data.namespaceId !== navigationNamespaceAnchor) {
        updateNavigationNamespaceAnchor(() => data.namespaceId);
      }

      // Redirect to the new catalog page
      router.push(`/${data.namespaceId}/catalog`);
      onClose();
    } catch (error) {
      console.error("Failed to create catalog", error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Content className="!w-[600px] rounded-md">
        <Dialog.Header className="flex justify-between">
          <Dialog.Title className="text-semantic-fg-primary !product-body-text-1-semibold">
            Create new catalog
          </Dialog.Title>
          <Dialog.Close className="!focus:ring-0 !active:ring-0 !focus:outline-none !focus:ring-offset-0 !rounded-none !bg-transparent !shadow-none !ring-0 before:!hidden after:!hidden" />
        </Dialog.Header>

        <Form.Root {...form}>
          <form
            className="flex flex-col space-y-3"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            <div className="flex items-center justify-start gap-4">
              <Form.Field
                control={form.control}
                name="namespaceId"
                render={({ field }) => (
                  <Form.Item className="w-1/2">
                    <Form.Label className="text-semantic-fg-primary product-button-button-2">
                      Owner
                    </Form.Label>
                    <Form.Control>
                      <EntitySelector
                        value={field.value}
                        onChange={(value: string) => {
                          setValue("namespaceId", value, {
                            shouldValidate: true,
                          });
                        }}
                        data={
                          userNamespaces.isSuccess ? userNamespaces.data : []
                        }
                      />
                    </Form.Control>
                    <div className="h-6">
                      <Form.Message className="!mt-0.5 product-body-text-4-regular" />
                    </div>
                  </Form.Item>
                )}
              />
              <Icons.SlashDivider className="h-8 w-8 stroke-semantic-fg-secondary stroke-1" />
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item className="-ml-4 w-1/2">
                    <Form.Label className="text-semantic-fg-primary product-button-button-2">
                      Catalog name
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          id={field.name}
                          placeholder="Catalog name"
                          onChange={(e) => {
                            field.onChange(e);
                          }}
                        />
                      </Input.Root>
                    </Form.Control>
                    <div className="h-6">
                      {nameValue && formattedName !== nameValue && (
                        <p className="!mt-0.5 text-semantic-fg-secondary product-body-text-4-regular">
                          Name will be transformed to: {formattedName}
                        </p>
                      )}
                      <Form.Message className="!mt-0.5 product-body-text-4-regular" />
                    </div>
                  </Form.Item>
                )}
              />
            </div>
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
                      Separate tags with a comma.
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
                disabled={!formState.isValid || creating}
              >
                {creating ? (
                  <LoadingSpin className="!text-semantic-fg-secondary" />
                ) : (
                  "Create"
                )}
              </Button>
            </div>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
