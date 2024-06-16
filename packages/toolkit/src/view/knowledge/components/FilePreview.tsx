import { Icons, Separator, Tabs, Button, Select, Input, Textarea, Form, Collapsible, ScrollArea } from "@instill-ai/design-system";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useUploadKnowledgeBaseFile } from "../../../lib/react-query-service/knowledge";
import { InstillStore, useAuthenticatedUser, useInstillStore, useShallow } from "../../../lib";

const UploadExploreFormSchema = z.object({
    file: z.instanceof(File),
    convertTransformFiles: z.string().min(1, { message: "Convert/Transform files is required" }),
    convertMethod: z.string().min(1, { message: "Convert method is required" }),
    splitTextFiles: z.string().min(1, { message: "Split text files is required" }),
    splitMethod: z.string().min(1, { message: "Split method is required" }),
    maxTokenSize: z.number().min(1, { message: "Max token size is required" }),
    tokenizerModel: z.string().min(1, { message: "Tokenizer model is required" }),
    embedChunksFiles: z.string().min(1, { message: "Embed chunks files is required" }),
    embeddingModel: z.string().min(1, { message: "Embedding model is required" }),
});

type UploadExploreFormData = z.infer<typeof UploadExploreFormSchema>;

const CollapsibleSection = ({ title, children }) => {
    const [open, setOpen] = React.useState(true);

    return (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger className="mb-2" asChild>
                <button className="flex w-full items-center gap-x-1 rounded py-1 hover:bg-semantic-bg-secondary">
                    {open ? (
                        <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
                    ) : (
                        <Icons.ChevronRight className="h-4 w-4 stroke-semantic-fg-primary" />
                    )}
                    <p className="text-semantic-fg-primary product-body-text-3-semibold">{title}</p>
                </button>
            </Collapsible.Trigger>
            <Collapsible.Content className="flex flex-col gap-y-4">{children}</Collapsible.Content>
        </Collapsible.Root>
    );
};

const FilePreview = () => {
    const form = useForm<UploadExploreFormData>({
        resolver: zodResolver(UploadExploreFormSchema),
        defaultValues: {
            convertTransformFiles: "",
            convertMethod: "",
            splitTextFiles: "",
            splitMethod: "",
            maxTokenSize: 256,
            tokenizerModel: "",
            embedChunksFiles: "",
            embeddingModel: "",
        },
    });
    const onSubmit: SubmitHandler<UploadExploreFormData> = async (data) => {
        console.log(data);
    };

    const tabTriggerStyle =
        "rounded-t-sm border border-semantic-bg-line bg-semantic-bg-base-bg px-3 py-1.5 text-[#1D2433] text-opacity-80 product-body-text-3-semibold data-[state=active]:bg-semantic-bg-primary data-[state=active]:text-opacity-100";

    return (
        <div className="flex w-full items-center justify-start  ">
            <Tabs.Root defaultValue="text" className="mt-4 w-full mb-8 ">
                <Tabs.List className="flex w-full items-center ml-4">
                    <Tabs.Trigger value="text" className={tabTriggerStyle}>
                        <span className="text-center product-button-button-3">Text</span>
                    </Tabs.Trigger>
                    <Tabs.Trigger value="images" className={tabTriggerStyle}>
                        <span className="text-center product-button-button-3">Images</span>
                    </Tabs.Trigger>
                </Tabs.List>
                <div className="flex w-full border-semantic-bg-line border rounded pb-8">
                    <div className="flex-col w-1/2">
                        <div className="product-body-text-1-semibold bg-semantic-bg-base-bg py-2 pl-3 rounded">Data</div>
                        <div className="  px-3  pt-8">
                            <Tabs.Content value="text">
                                <Form.Root {...form}>
                                    <form className="flex flex-col gap-6 w-full">
                                        <CollapsibleSection title="Convert / Transform files">
                                            <div className="flex gap-8">
                                                <Form.Field control={form.control} name="convertTransformFiles" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Convert / Transform files
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select.." />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="option1">Option 1</Select.Item>
                                                                    <Select.Item value="option2">Option 2</Select.Item>
                                                                </Select.Content>
                                                            </Select.Root>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                                <Form.Field control={form.control} name="convertMethod" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Convert method
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select.." />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="option1">Option 1</Select.Item>
                                                                    <Select.Item value="option2">Option 2</Select.Item>
                                                                </Select.Content>
                                                            </Select.Root>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                            </div>
                                            <div className="flex gap-2 w-full">
                                                <Button className="flex-1" variant="secondaryGrey">
                                                    Test Pipeline
                                                </Button>
                                                <Button className="flex-1" variant="secondaryGrey">
                                                    Customize Pipeline
                                                </Button>
                                                <Button className="flex-1" variant="primary" type="submit">
                                                    Preview Results
                                                </Button>
                                            </div>
                                        </CollapsibleSection>
                                        <CollapsibleSection title="Split text">
                                            <div className="flex gap-8">
                                                <Form.Field control={form.control} name="splitTextFiles" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Split text files
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select.." />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="option1">Option 1</Select.Item>
                                                                    <Select.Item value="option2">Option 2</Select.Item>
                                                                </Select.Content>
                                                            </Select.Root>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                                <Form.Field control={form.control} name="splitMethod" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Split method
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select.." />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="option1">Option 1</Select.Item>
                                                                    <Select.Item value="option2">Option 2</Select.Item>
                                                                </Select.Content>
                                                            </Select.Root>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                            </div>
                                            <div className="flex gap-8">
                                                <Form.Field control={form.control} name="maxTokenSize" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Max token size
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="range"
                                                                    className="w-full h-2 bg-semantic-bg-line rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                                    {...field}
                                                                />
                                                                <Input.Root>
                                                                    <Input.Core {...field} id={field.name} placeholder="Username" type="text" disabled={true} />
                                                                </Input.Root>
                                                            </div>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                                <Form.Field control={form.control} name="tokenizerModel" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Tokenizer model
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <Select.Root onValueChange

                                                                ={field.onChange} defaultValue={field.value}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select.." />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="option1">Option 1</Select.Item>
                                                                    <Select.Item value="option2">Option 2</Select.Item>
                                                                </Select.Content>
                                                            </Select.Root>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                            </div>
                                            <div className="flex gap-2 w-full">
                                                <Button className="flex-1" variant="secondaryGrey">
                                                    Test Pipeline
                                                </Button>
                                                <Button className="flex-1" variant="secondaryGrey">
                                                    Customize Pipeline
                                                </Button>
                                                <Button className="flex-1" variant="primary" type="submit">
                                                    Preview Results
                                                </Button>
                                            </div>
                                        </CollapsibleSection>
                                        <CollapsibleSection title="Embed chunks">
                                            <div className="flex gap-8">
                                                <Form.Field control={form.control} name="embedChunksFiles" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Embed chunks files
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select.." />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="option1">Option 1</Select.Item>
                                                                    <Select.Item value="option2">Option2</Select.Item>
                                                                </Select.Content>
                                                            </Select.Root>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                                <Form.Field control={form.control} name="embeddingModel" render={({ field }) => (
                                                    <Form.Item className="w-1/2">
                                                        <Form.Label className="product-button-button-1">
                                                            Embedding model
                                                        </Form.Label>
                                                        <Form.Control>
                                                            <Select.Root onValueChange={field.onChange} defaultValue={field.value}>
                                                                <Select.Trigger>
                                                                    <Select.Value placeholder="Select.." />
                                                                </Select.Trigger>
                                                                <Select.Content>
                                                                    <Select.Item value="option1">Option 1</Select.Item>
                                                                    <Select.Item value="option2">Option 2</Select.Item>
                                                                </Select.Content>
                                                            </Select.Root>
                                                        </Form.Control>
                                                        <Form.Message />
                                                    </Form.Item>
                                                )} />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="secondaryGrey" className="grow">
                                                    Test Pipeline
                                                </Button>
                                                <Button variant="secondaryGrey" className="grow">
                                                    Customize Pipeline
                                                </Button>
                                            </div>
                                        </CollapsibleSection>
                                    </form>
                                </Form.Root>
                            </Tabs.Content>
                            <Tabs.Content value="images" />
                        </div>
                    </div>
                    <div className="h-auto self-stretch flex items-center">
                        <Separator orientation="vertical" />
                    </div>
                    <ScrollArea.Root className="flex flex-col w-1/2">
                        <div className="product-body-text-1-semibold bg-semantic-bg-base-bg py-2 pl-3 rounded mb-8">Preview</div>
                        <div className="flex flex-col gap-3 px-8">
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-px flex-grow bg-semantic-bg-line" />
                                <div className="product-body-text-3-medium whitespace-nowrap">Convert Results</div>
                                <div className="h-px flex-grow bg-semantic-bg-line" /> 
                            </div>
                            <div className="flex flex-col">
                                <h3 className="product-button-button-2 pb-2.5">File name 1</h3>
                                <Textarea placeholder="Text preview" rows={3} />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="product-button-button-2 pb-2.5">File name 1</h3>
                                <Textarea placeholder="Text preview" rows={3} />
                            </div>
                            <div className="flex items-center justify-center gap-2">
                                <div className="h-px flex-grow bg-semantic-bg-line" />
                                <div className="product-body-text-3-medium whitespace-nowrap">Split Text Results</div>
                                <div className="h-px flex-grow bg-semantic-bg-line" />
                            </div>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col">
                                    <h3 className="product-button-button-2 pb-2.5">File name 1</h3>
                                    <Textarea placeholder="Text preview" rows={3} />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="product-button-button-2 pb-2.5">File name 2</h3>
                                    <Textarea placeholder="Text preview" rows={3} />
                                </div>
                            </div>
                        </div>
                    </ScrollArea.Root>
                </div>
            </Tabs.Root>
        </div>
    );
};

export default FilePreview;
