// CreateKnowledgeDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  Form,
  Icons,
  Input,
  // Select,
  // Tag,
  Textarea,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import {
//   InstillStore,
//   useAuthenticatedUser,
//   useInstillStore,
//   useShallow,
// } from "../../../lib";
// import * as React from "react";
import { EntitySelector } from "../../../components";
import { useUserNamespaces } from "../../../lib/useUserNamespaces";
import {
  InstillStore,
  useInstillStore,
  useShallow,
  useRouteInfo,
} from "../../../lib";
import * as React from "react";

const CreateKnowledgeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tags: z.array(z.string()).optional(),
  namespaceId: z.string().min(1, { message: "Owner is required" }),
});

type CreateKnowledgeFormProps = {
  onSubmit: (data: z.infer<typeof CreateKnowledgeFormSchema>) => void;
};

export const CreateKnowledgeDialog = ({
  isOpen,
  onClose,
  onSubmit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: CreateKnowledgeFormProps["onSubmit"];
}) => {
  const selector = (store: InstillStore) => ({
    navigationNamespaceAnchor: store.navigationNamespaceAnchor,
  });

  const { navigationNamespaceAnchor } = useInstillStore(useShallow(selector));

  const routeInfo = useRouteInfo();

  const form = useForm<z.infer<typeof CreateKnowledgeFormSchema>>({
    resolver: zodResolver(CreateKnowledgeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      namespaceId: navigationNamespaceAnchor
        ? navigationNamespaceAnchor
        : routeInfo?.data?.namespaceId || "",
    },
    mode: "onChange",
  });

  const userNamespaces = useUserNamespaces();

  const { formState, watch } = form;
  const nameValue = watch("name");
  // const namespaceIdValue = watch("namespaceId");

  const formatName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
  };

  const isNameValid = /^[a-zA-Z0-9-_]+$/.test(nameValue);
  const formattedName = formatName(nameValue);

  const resetForm = () => {
    form.reset({
      name: "",
      description: "",
      tags: [],
      namespaceId: navigationNamespaceAnchor
        ? navigationNamespaceAnchor
        : routeInfo?.data?.namespaceId || "",
    });
  };
  React.useEffect(() => {
    const initialNamespaceId =
      navigationNamespaceAnchor || routeInfo?.data?.namespaceId || "";
    form.setValue("namespaceId", initialNamespaceId);
  }, [navigationNamespaceAnchor, routeInfo?.data?.namespaceId, form]);

  React.useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  // const selector = (store: InstillStore) => ({
  //   accessToken: store.accessToken,
  //   enabledQuery: store.enabledQuery,
  // });

  // const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  // const me = useAuthenticatedUser({
  //   enabled: enabledQuery && isOpen,
  //   accessToken,
  // });

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          resetForm();
        } else {
          onClose();
        }
      }}
    >
      <Dialog.Content className="!w-[600px] rounded-md">
        <Dialog.Header className="flex justify-between">
          <Dialog.Title className="text-semantic-fg-primary !product-body-text-1-semibold">
            Create new knowledge base
          </Dialog.Title>
          <Dialog.Close className="" />
        </Dialog.Header>

        <Form.Root {...form}>
          <form
            className="flex flex-col space-y-3"
            onSubmit={form.handleSubmit((data) => {
              onSubmit({
                ...data,
                name: formatName(data.name),
              });
              resetForm();
            })}
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
                          form.setValue("namespaceId", value, {
                            shouldValidate: true,
                          });
                        }}
                        data={userNamespaces}
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
                      Knowledge base name
                    </Form.Label>
                    <Form.Control>
                      <Input.Root>
                        <Input.Core
                          {...field}
                          id={field.name}
                          placeholder="Knowledge base name"
                        />
                      </Input.Root>
                    </Form.Control>
                    <div className="h-6">
                      {nameValue && !isNameValid && (
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
                  <Form.Label className="mb-1 text-semantic-fg-primary product-button-button-2">
                    Description
                  </Form.Label>
                  <Form.Control>
                    <Textarea
                      {...field}
                      id={field.name}
                      placeholder="Content"
                    />
                  </Form.Control>
                  <p className="text-semantic-fg-secondary product-body-text-4-regular">
                    Fill with a short description
                  </p>
                  <Form.Message />
                </Form.Item>
              )}
            />
            {/* <Form.Field
              control={form.control}
              name="tags"
              render={({ field }) => (
                <Form.Item>
                  <div className="flex items-center justify-between">
                    <Form.Label className="text-semantic-fg-primary product-button-button-2">
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
                        id={field.name}
                        placeholder="Add tag"
                      />
                    </Input.Root>
                  </Form.Control>
                  <Form.Message />
                </Form.Item>
              )}
            /> */}
            <div className="mt-8 flex justify-end gap-x-3">
              <Button variant="secondaryGrey" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="text-semantic-fg-on-default"
                disabled={!formState.isValid}
              >
                Create
              </Button>
            </div>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};
