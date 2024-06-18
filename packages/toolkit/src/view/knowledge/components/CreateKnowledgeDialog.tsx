// CreateKnowledgeDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  Form,
  Input,
  Select,
  Tag,
  Textarea,
} from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
  useUserMemberships,
} from "../../../lib";
import * as React from "react";

const CreateKnowledgeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tags: z.array(z.string()).optional(),
  namespaceId: z.string(),
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
  const form = useForm<z.infer<typeof CreateKnowledgeFormSchema>>({
    resolver: zodResolver(CreateKnowledgeFormSchema),
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      namespaceId: "",
    },
    mode: "onChange",
  });

  const { formState, watch } = form;
  const nameValue = watch("name");

  const formatName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
  };

  const isNameValid = /^[a-zA-Z0-9-_]+$/.test(nameValue);
  const formattedName = formatName(nameValue);

  const selector = (store: InstillStore) => ({
    accessToken: store.accessToken,
    enabledQuery: store.enabledQuery,
  });

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery && isOpen,
    accessToken,
  });

  const organizations = useUserMemberships({
    enabled: enabledQuery && me.isSuccess && isOpen,
    userID: me.isSuccess ? me.data.id : null,
    accessToken,
  });

  const organizationsAndUserList = React.useMemo(() => {
    const orgsAndUserList = [];
    if (organizations.isSuccess && organizations.data) {
      organizations.data.forEach((org) => {
        orgsAndUserList.push(org.organization);
      });
    }
    if (me.isSuccess && me.data) {
      orgsAndUserList.push(me.data);
    }
    return orgsAndUserList;
  }, [organizations.isSuccess, organizations.data, me.isSuccess, me.data]);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Content className="!w-[600px] rounded-md">
        <Dialog.Header className="flex justify-between">
          <Dialog.Title className="text-semantic-fg-primary product-body-text-1-semibold">
            Create new knowledge base
          </Dialog.Title>
          <Dialog.Close className="" />
        </Dialog.Header>

        <Form.Root {...form}>
          <form
            className="flex flex-col space-y-5"
            onSubmit={form.handleSubmit((data) =>
              onSubmit({
                ...data,
                name: formatName(data.name),
              })
            )}
          >
            <div className="flex sp">
              <Form.Field
                control={form.control}
                name="namespaceId"
                render={({ field }) => (
                  <Form.Item className="w-1/3">
                    <Form.Label className="product-body-text-3-semibold">
                      Owner
                    </Form.Label>
                    <Form.Control>
                      <Select.Root
                        value={field.value || ""}
                        onValueChange={(e) => {
                          field.onChange(e);
                          if (form.getValues("id")) {
                            form.trigger("id");
                          }
                        }}
                      >
                        <Select.Trigger className="w-full pl-[14px]">
                          <Select.Value placeholder="Select Account Name">
                            <div className="flex flex-row gap-x-2">
                              <span className="my-auto">
                                {field.value?.length >= 10
                                  ? field.value?.slice(0, 10) + "..."
                                  : field.value}
                              </span>
                              <span className="my-auto">
                                {organizationsAndUserList?.length &&
                                  organizationsAndUserList.find(
                                    (namespace) => namespace.id === field.value
                                  )?.name.includes("organizations") ? (
                                  <Tag
                                    variant="lightBlue"
                                    size="sm"
                                    className="!py-0"
                                  >
                                    organization
                                  </Tag>
                                ) : (
                                  <Tag
                                    size="sm"
                                    className="!py-0"
                                    variant="lightNeutral"
                                  >
                                    user
                                  </Tag>
                                )}
                              </span>
                            </div>
                          </Select.Value>
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Group>
                            {organizationsAndUserList.length &&
                              organizationsAndUserList.map((namespace) => (
                                <Select.Item
                                  value={namespace.id}
                                  key={namespace.id}
                                >
                                  <Select.ItemText>
                                    <div className="flex flex-row gap-x-2">
                                      <span className="my-auto">
                                        {namespace.id}
                                      </span>
                                      <span className="my-auto">
                                        {namespace.name.includes(
                                          "organizations"
                                        ) ? (
                                          <Tag
                                            variant="lightBlue"
                                            size="sm"
                                            className="!py-0"
                                          >
                                            organization
                                          </Tag>
                                        ) : (
                                          <Tag
                                            size="sm"
                                            className="!py-0"
                                            variant="lightNeutral"
                                          >
                                            user
                                          </Tag>
                                        )}
                                      </span>
                                    </div>
                                  </Select.ItemText>
                                </Select.Item>
                              ))}
                          </Select.Group>
                        </Select.Content>
                      </Select.Root>
                    </Form.Control>

                    <Form.Message />
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item className="w-2/3">
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
                    {nameValue && !isNameValid && (
                      <p className="mt-1 text-semantic-fg-secondary product-body-text-4-regular">
                        Name will be transformed to: {formattedName}
                      </p>
                    )}
                    <Form.Message />
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
                    <Textarea {...field} id={field.name} placeholder="Content" />
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