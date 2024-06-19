// CreateKnowledgeDialog.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  Form,
  Icons,
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
            <div className="flex justify-start items-end gap-1">
              <Form.Field
                control={form.control}
                name="namespaceId"
                render={({ field }) => (
                  <Form.Item className="flex-1">
                    <Form.Label className="flex justify-start items-center pb-1 product-button-button-2">
                      Owner
                    </Form.Label>
                    <Form.Control>
                      <Select.Root
                        value={field.value || ""}
                        onValueChange={(e) => {
                          field.onChange(e);
                          if (form.getValues("namespaceId")) {
                            form.trigger("namespaceId");
                          }
                        }}
                      >
                        <Select.Trigger className="flex justify-start items-center gap-2 px-[9px] py-2  w-full">
                          <Select.Value placeholder="Select Account">
                            <div className="flex items-center gap-1">
                              {field.value ? (
                                <>
                                  <div className="flex justify-center items-center gap-1 px-[5px] py-1 bg-slate-100 rounded-[100px]">
                                    <img
                                      className="w-4 h-4 rounded-[100px]"
                                      src="https://via.placeholder.com/16x16"
                                      alt=""
                                    />
                                    <span className="text-semantic-fg-primary text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                      {organizationsAndUserList?.find(
                                        (namespace) => namespace.id === field.value
                                      )?.name}
                                    </span>
                                  </div>
                                </>
                              ) : null}
                            </div>
                          </Select.Value>
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Group>
                            {organizationsAndUserList?.map((namespace) => (
                              <Select.Item value={namespace.id} key={namespace.id}>
                                <Select.ItemText>
                                  <div className="flex items-center gap-2">
                                    <span>{namespace.id}</span>
                                    <span>
                                      {namespace.name.includes("organizations") ? (
                                        <Tag variant="lightBlue" size="sm" className="!py-0">
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
              <Icons.SlashDivider className="w-8 h-8 stroke-semantic-fg-secondary ml-1 stroke-1" />
              <Form.Field
                control={form.control}
                name="name"
                render={({ field }) => (
                  <Form.Item className="flex-1 !-ml-4">
                    <Form.Label className="flex justify-start items-center mb-1 product-button-button-2">
                      Knowledge base name
                    </Form.Label>
                    <Form.Control>
                      <Input.Root className="flex justify-start items-center gap-2 px-[9px] py-2  rounded-lg border  w-full">
                        <Input.Core
                          {...field}
                          id={field.name}
                          placeholder="KB-cool-name"
                          className="text-semantic-fg-primary text-base font-normal font-['IBM Plex Sans'] leading-normal w-full"
                        />
                      </Input.Root>
                    </Form.Control>
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