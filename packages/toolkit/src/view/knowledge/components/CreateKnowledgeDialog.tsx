import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, Form, Icons, Input, Textarea } from "@instill-ai/design-system";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { EntitySelector } from "../../../components";
import { useUserNamespaces } from "../../../lib/useUserNamespaces";
import { InstillStore, useInstillStore, useShallow, useRouteInfo } from "../../../lib";
import { getInstillArtifactAPIClient } from "../../../lib/vdp-sdk";

const CreateKnowledgeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tags: z.array(z.string()).optional(),
  namespaceId: z.string().min(1, { message: "Owner is required" }),
});

export const CreateKnowledgeDialog: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  accessToken: string | null;
}> = ({ isOpen, onClose, accessToken }) => {
  const { navigationNamespaceAnchor } = useInstillStore(
    useShallow((store: InstillStore) => ({
      navigationNamespaceAnchor: store.navigationNamespaceAnchor,
    }))
  );

  const routeInfo = useRouteInfo();
  const userNamespaces = useUserNamespaces();
  const queryClient = useQueryClient();

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


  const createKnowledgeBaseMutation = useMutation({
    mutationFn: async (data: z.infer<typeof CreateKnowledgeFormSchema>) => {
      if (!accessToken) {
        throw new Error("Not authenticated");
      }
      const client = getInstillArtifactAPIClient({ accessToken });
      return client.artifact.createKnowledgeBase({
        ownerId: data.namespaceId,
        payload: {
          name: data.name,
          description: data.description,
          tags: data.tags ?? [],
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['knowledgeBases']);
      onClose();
    },
  });

  const handleSubmit = (data: z.infer<typeof CreateKnowledgeFormSchema>) => {
    createKnowledgeBaseMutation.mutate(data);
  };

  React.useEffect(() => {
    if (isOpen) {
      const initialNamespaceId =
        navigationNamespaceAnchor || routeInfo?.data?.namespaceId || "";
      form.reset({
        name: "",
        description: "",
        tags: [],
        namespaceId: initialNamespaceId,
      });
    }
  }, [isOpen, navigationNamespaceAnchor, routeInfo?.data?.namespaceId]);

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
            Create new knowledge base
          </Dialog.Title>
          <Dialog.Close className="!focus:ring-0 !active:ring-0 !focus:outline-none !focus:ring-offset-0 !rounded-none !bg-transparent !shadow-none !ring-0 before:!hidden after:!hidden" />
        </Dialog.Header>

        <Form.Root {...form}>
          <form
            className="flex flex-col space-y-3"
            onSubmit={form.handleSubmit(handleSubmit)}
          >
            {/* Form fields */}
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
            <div className="mt-8 flex justify-end gap-x-3">
              <Button variant="secondaryGrey" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                className="text-semantic-fg-on-default"
                disabled={!form.formState.isValid || createKnowledgeBaseMutation.isLoading}
              >
                {createKnowledgeBaseMutation.isLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </form>
        </Form.Root>
      </Dialog.Content>
    </Dialog.Root>
  );
};