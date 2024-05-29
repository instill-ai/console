// UploadExploreTab.tsx
import { Icons, Separator, Tabs, Button, Select, Input, Textarea, Form } from "@instill-ai/design-system";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const UploadExploreFormSchema = z.object({
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

export const UploadExploreTab = () => {
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

    const onSubmit: SubmitHandler<UploadExploreFormData> = (data) => {
        console.log(data);
    };

    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    Upload & Explore
                </p>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="w-full h-[150px] relative bg-blue-50 rounded border border-slate-300">
                <Icons.Upload01 className="w-8 h-8 left-[41px] top-[41px] absolute" />
                <div className="w-[1024px] left-[68px] top-[91px] absolute text-center">
                    <span className="text-gray-800 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                        Drag-and-drop file, or{" "}
                    </span>
                    <span className="text-blue-600 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                        browse computer
                    </span>
                </div>
                <div className="left-[537px] top-[125.83px] absolute text-center text-gray-800 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                    Max 15MB each
                </div>
                <div className="w-[1078px] h-[16.38px] left-[41px] top-[108.23px] absolute text-center text-gray-800 text-xs font-normal font-['IBM Plex Sans'] leading-none">
                    Support TXT, MARKDOWN, PDF, PNG, JPG (DOCX, DOC, PPTX, PPT, HTML, XML, RTF).
                    <br />
                    <br />
                </div>
            </div>
            <div className="flex w-full items-center justify-start">
                <Tabs.Root defaultValue="text" className="mb-8 mt-4 w-full">
                    <div className="flex flex-col items-center">
                        <Tabs.List className="flex justify-start gap-6">
                            <Tabs.Trigger value="text">
                                <span className="text-lg">Text</span>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="images">
                                <span className="text-lg">Images</span>
                            </Tabs.Trigger>
                        </Tabs.List>
                        <Separator orientation="horizontal" />
                    </div>
                    <div className="bg-semantic-bg-base-bg pt-8">
                        <div className="xl:px-30 flex w-full flex-row space-x-4 sm:px-5 md:px-10 lg:px-20">
                            <div className="flex w-full flex-col">
                                <Tabs.Content value="text">
                                    <Form.Root {...form} onSubmit={form.handleSubmit(onSubmit)}>
                                        <form className="flex flex-col gap-6">
                                            <div className="flex gap-8">
                                                <Form.Field
                                                    control={form.control}
                                                    name="convertTransformFiles"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                                                Convert / Transform files
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <Select.Root
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
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
                                                    )}
                                                />
                                                <Form.Field
                                                    control={form.control}
                                                    name="convertMethod"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                                                Convert method
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <Select.Root
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
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
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="secondaryGrey" className="grow" type="button">
                                                    Test Pipeline
                                                </Button>
                                                <Button variant="secondaryGrey" className="grow" type="button">
                                                    Customize Pipeline
                                                </Button>
                                                <Button variant="primary" className="grow bg-blue-50 text-blue-700" type="submit">
                                                    Preview Results
                                                </Button>
                                            </div>
                                            <div className="flex gap-8">
                                                <Form.Field
                                                    control={form.control}
                                                    name="splitTextFiles"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                                                Split text files
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <Select.Root
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
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
                                                    )}
                                                />
                                                <Form.Field
                                                    control={form.control}
                                                    name="splitMethod"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                                                Split method
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <Select.Root
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
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
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-8">
                                                <Form.Field
                                                    control={form.control}
                                                    name="maxTokenSize"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-base font-semibold font-['IBM Plex Sans'] capitalize leading-none tracking-tight">
                                                                Max token size
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <div className="flex items-center gap-2">
                                                                    <input
                                                                        type="range"
                                                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                                        {...field}
                                                                    />
                                                                    <Input.Root>
                                                                        <Input.Core
                                                                            {...field}
                                                                            id={field.name}
                                                                            placeholder="Username"
                                                                            type="text"
                                                                            disabled={true}
                                                                        />
                                                                    </Input.Root>
                                                                </div>
                                                            </Form.Control>
                                                            <Form.Message />
                                                        </Form.Item>
                                                    )}
                                                />
                                                <Form.Field
                                                    control={form.control}
                                                    name="tokenizerModel"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                                                Tokenizer model
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <Select.Root
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
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
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="secondaryGrey" className="grow" type="button">
                                                    Test Pipeline
                                                </Button>
                                                <Button variant="secondaryGrey" className="grow" type="button">
                                                    Customize Pipeline
                                                </Button>
                                                <Button variant="primary" className="grow bg-blue-50 text-blue-700" type="submit">
                                                    Preview Results
                                                </Button>
                                            </div>
                                            <div className="flex gap-8">
                                                <Form.Field
                                                    control={form.control}
                                                    name="embedChunksFiles"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                                                Embed chunks files
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <Select.Root
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
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
                                                    )}
                                                />
                                                <Form.Field
                                                    control={form.control}
                                                    name="embeddingModel"
                                                    render={({ field }) => (
                                                        <Form.Item>
                                                            <Form.Label className="text-gray-800 text-sm font-semibold font-['IBM Plex Sans'] capitalize leading-[14px] tracking-tight">
                                                                Embedding model
                                                            </Form.Label>
                                                            <Form.Control>
                                                                <Select.Root
                                                                    onValueChange={field.onChange}
                                                                    defaultValue={field.value}
                                                                >
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
                                                    )}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="secondaryGrey" className="grow" type="button">
                                                    Test Pipeline
                                                </Button>
                                                <Button variant="secondaryGrey" className="grow" type="button">
                                                    Customize Pipeline
                                                </Button>
                                            </div>
                                        </form>
                                    </Form.Root>
                                </Tabs.Content>
                                <Tabs.Content value="images">
                                    {/* Add content for the Images tab */}
                                </Tabs.Content>
                            </div>
                            <div className="flex w-full flex-col">
                                <div className="text-lg font-semibold mb-6">Preview</div>
                                <div className="flex flex-col gap-3">
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="grow h-px bg-slate-200" />
                                        <div className="text-sm font-medium text-gray-800/80">Convert Results</div>
                                        <div className="grow h-px bg-slate-200" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold mb-2">File name 1</div>
                                            <Textarea placeholder="Text preview" rows={3} />
                                        </div>
                                    </div>
                                    <div className="flex justify-center items-center gap-2">
                                        <div className="grow h-px bg-slate-200" />
                                        <div className="text-sm font-medium text-gray-800/80">Split Text Results</div>
                                        <div className="grow h-px bg-slate-200" />
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold mb-2">File name 1</div>
                                            <Textarea placeholder="Text preview" rows={3} />
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="text-sm font-semibold mb-2">File name 2</div>
                                            <Textarea placeholder="Text preview" rows={3} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Tabs.Root>
            </div>
        </div>
    );
};