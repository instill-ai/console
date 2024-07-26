import React from "react";
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

const EditKnowledgeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  tags: z.array(z.string()).optional(),
});

type EditKnowledgeDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: z.infer<typeof EditKnowledgeFormSchema>) => Promise<void>;
  initialValues: {
    name: string;
    description: string;
    tags: string[];
  };
};

export const EditKnowledgeDialog: React.FC<EditKnowledgeDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialValues,
}) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<z.infer<typeof EditKnowledgeFormSchema>>({
    resolver: zodResolver(EditKnowledgeFormSchema),
    defaultValues: initialValues,
    mode: "onChange",
  });

  const { formState, watch, reset } = form;
  const nameValue = watch("name");

  const formatName = (name: string) => {
    return name.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");
  };

  const isNameValid = /^[a-zA-Z0-9-_]+$/.test(nameValue);
  const formattedName = formatName(nameValue);

  const handleSubmit = async (
    data: z.infer<typeof EditKnowledgeFormSchema>,
  ) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      setTimeout(() => {
        onClose();
        reset(initialValues);
      }, 1000);
    } catch (error) {
      console.error("Error updating knowledge base:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog.Root open={isOpen} onOpenChange={onClose}>
        <Dialog.Content className="!w-[600px] rounded-md">
          <Dialog.Header className="flex justify-between">
            <Dialog.Title className="text-semantic-fg-primary product-body-text-1-semibold">
              Edit knowledge base
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
                      Name
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
                  disabled={!formState.isValid || isSubmitting}
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form.Root>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};
