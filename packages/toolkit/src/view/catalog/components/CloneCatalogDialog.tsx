"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Nullable } from "instill-sdk";
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
import {
  InstillStore,
  useAuthenticatedUserSubscription,
  useInstillStore,
  useOrganizationSubscription,
  useShallow,
} from "../../../lib";
import { useListNamespaceCatalogs } from "../../../lib/react-query-service/catalog";
import { useUserNamespaces } from "../../../lib/useUserNamespaces";
import { env } from "../../../server";
import { MAX_DESCRIPTION_LENGTH } from "./lib/constant";
import {
  checkNamespaceType,
  convertTagsToArray,
  formatName,
  getCatalogLimit,
  getSubscriptionInfo,
} from "./lib/helpers";
import { CatalogLimitNotification } from "./notifications";

const CloneCatalogFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z
    .string()
    .max(MAX_DESCRIPTION_LENGTH, {
      message: `Description must be ${MAX_DESCRIPTION_LENGTH} characters or less`,
    })
    .optional(),
  tags: z.string().optional(),
  namespaceId: z.string().min(1, { message: "Namespace is required" }),
});

export type CloneCatalogDialogData = z.infer<typeof CloneCatalogFormSchema>;

type CloneCatalogDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CloneCatalogDialogData) => Promise<void>;
  initialValues: {
    name: string;
    description: string;
    tags: string[];
    namespaceId: string;
  };
};

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
  navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  updateNavigationNamespaceAnchor: store.updateNavigationNamespaceAnchor,
});

export const CloneCatalogDialog = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}: CloneCatalogDialogProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showLimitNotification, setShowLimitNotification] =
    React.useState(false);
  const [hasNamespaceChanged, setHasNamespaceChanged] = React.useState(false);
  const [isCatalogLimitReached, setIsCatalogLimitReached] =
    React.useState(false);

  const {
    accessToken,
    enabledQuery,
    navigationNamespaceAnchor,
    updateNavigationNamespaceAnchor,
  } = useInstillStore(useShallow(selector));
  const userNamespaces = useUserNamespaces();

  const form = useForm<CloneCatalogDialogData>({
    resolver: zodResolver(CloneCatalogFormSchema),
    defaultValues: {
      ...initialValues,
      tags: initialValues.tags.join(", "),
      namespaceId: navigationNamespaceAnchor || "",
    },
    mode: "onChange",
  });

  const { formState, reset, watch, setValue } = form;
  const nameValue = watch("name");
  const description = watch("description");
  const selectedNamespace = watch("namespaceId");
  const [namespaceType, setNamespaceType] =
    React.useState<Nullable<"user" | "organization">>(null);

  const formattedName = formatName(nameValue);

  React.useEffect(() => {
    const getNamespaceType = async () => {
      if (selectedNamespace && accessToken) {
        const type = await checkNamespaceType(selectedNamespace, accessToken);
        setNamespaceType(type);
      } else {
        setNamespaceType(null);
      }
    };

    getNamespaceType();
  }, [selectedNamespace, accessToken]);

  const catalogs = useListNamespaceCatalogs({
    accessToken,
    namespaceId: selectedNamespace,
    enabled: enabledQuery && !!selectedNamespace,
  });

  const userSub = useAuthenticatedUserSubscription({
    enabled: enabledQuery && env("NEXT_PUBLIC_APP_ENV") === "CLOUD",
    accessToken,
  });

  const orgSub = useOrganizationSubscription({
    organizationId: selectedNamespace ? selectedNamespace : null,
    accessToken,
    enabled: enabledQuery && namespaceType === "organization",
  });

  const subscriptionInfo = React.useMemo(() => {
    return getSubscriptionInfo(
      namespaceType,
      userSub.data || null,
      orgSub.data || null,
    );
  }, [userSub.data, orgSub.data, namespaceType]);

  const catalogLimit = React.useMemo(
    () => getCatalogLimit(subscriptionInfo.plan),
    [subscriptionInfo.plan],
  );

  React.useEffect(() => {
    if (isOpen) {
      reset({
        ...initialValues,
        tags: initialValues.tags.join(", "),
        namespaceId: navigationNamespaceAnchor || "",
      });
      setShowLimitNotification(false);
      setHasNamespaceChanged(false);
      setIsCatalogLimitReached(false);
    }
  }, [isOpen, initialValues, navigationNamespaceAnchor, reset]);

  React.useEffect(() => {
    if (hasNamespaceChanged && catalogs.data && catalogLimit) {
      const limitReached = catalogs.data.length >= catalogLimit;
      setIsCatalogLimitReached(limitReached);
      if (limitReached) {
        setShowLimitNotification(true);
      }
    }
  }, [catalogs.data, catalogLimit, hasNamespaceChanged]);

  const handleSubmit = async (data: CloneCatalogDialogData) => {
    if (showLimitNotification) {
      return;
    }

    setIsSubmitting(true);
    try {
      const formattedData = {
        ...data,
        name: formatName(data.name),
        tags: convertTagsToArray(data.tags),
      };

      await onSubmit({
        name: formattedData.name,
        namespaceId: formattedData.namespaceId,
        description: formattedData.description,
        tags: formattedData.tags.join(","),
      });

      if (formattedData.namespaceId !== navigationNamespaceAnchor) {
        updateNavigationNamespaceAnchor(() => formattedData.namespaceId);
      }

      router.push(`/${formattedData.namespaceId}/catalog`);
      setIsSubmitting(false);
      onClose();
    } catch (error) {
      console.error("Error cloning catalog:", error);
      setIsSubmitting(false);
    }
  };

  const handleNamespaceChange = (value: string) => {
    setValue("namespaceId", value, { shouldValidate: true });
    setHasNamespaceChanged(true);
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Content className="!w-[600px] rounded-md">
          <Dialog.Header className="flex justify-between">
            <Dialog.Title className="text-semantic-fg-primary !product-body-text-1-semibold">
              Clone catalog
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
                          onChange={handleNamespaceChange}
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
                  disabled={
                    !formState.isValid || isSubmitting || isCatalogLimitReached
                  }
                >
                  {isSubmitting ? (
                    <LoadingSpin className="!text-semantic-fg-secondary" />
                  ) : (
                    "Clone"
                  )}
                </Button>
              </div>
            </form>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Root>
      <CatalogLimitNotification
        isOpen={showLimitNotification}
        setIsOpen={() => setShowLimitNotification(false)}
      />
    </>
  );
};
