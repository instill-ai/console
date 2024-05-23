// CreateKnowledgeDialog.tsx
import {
    Button,
    Dialog,
    Form,
    Icons,
    Input,
    Label,
    Textarea,
} from "@instill-ai/design-system";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CreateKnowledgeFormSchema = z.object({
    title: z.string().min(1, { message: "Title is required" }),
    description: z.string().min(1, { message: "Description is required" }),
    tags: z.string().optional(),
});

type CreateKnowledgeFormProps = {
    onSubmit: (data: z.infer<typeof CreateKnowledgeFormSchema>) => void;
};

export const CreateKnowledgeDialog = ({
    isOpen,
    onClose,
    onSubmit,
    title = "Create new knowledge base",
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: CreateKnowledgeFormProps["onSubmit"];
    title?: string;
}) => {
    const form = useForm<z.infer<typeof CreateKnowledgeFormSchema>>({
        resolver: zodResolver(CreateKnowledgeFormSchema),
        defaultValues: {
            title: "",
            description: "",
            tags: "",
        },
    });

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Content className="!w-[600px] rounded-md">
                <Dialog.Header className="flex justify-between">
                    <Dialog.Title className="text-semantic-fg-primary product-body-text-1-semibold">Create new knowledge base</Dialog.Title>
                    <Dialog.Close className="" />
                </Dialog.Header>

                <Form.Root
                    {...form}
                >
                    <form
                        className="flex flex-col space-y-5"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <Form.Field
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <Form.Item>
                                    <Form.Label className="product-button-button-2 text-semantic-fg-primary">
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
                                    <Form.Message />
                                </Form.Item>
                            )}
                        />
                        <Form.Field
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <Form.Item>
                                    <Form.Label className="product-button-button-2 text-semantic-fg-primary">
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
                        <Form.Field
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <Form.Item>
                                    <div className="flex items-center justify-between">
                                        <Form.Label className="product-button-button-2 text-semantic-fg-primary">
                                            Tags
                                        </Form.Label>
                                        <p className="my-auto text-semantic-fg-secondary product-body-text-4-regular">
                                            Optional
                                        </p>
                                    </div>
                                    <Form.Control>
                                        <Input.Root>
                                            <Input.Core {...field} id={field.name} placeholder="Add tag" />
                                        </Input.Root>
                                    </Form.Control>
                                    <Form.Message />
                                </Form.Item>
                            )}
                        />
                        <div className="flex justify-end mt-8 gap-x-3">
                            <Button
                                variant="secondaryGrey"
                                onClick={onClose}
                            // className="text-semantic-fg-primary"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="text-semantic-fg-on-default"
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