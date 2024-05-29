// UploadExploreTab.tsx
import { Icons, Separator, Tabs, Button, Select, Input, Textarea, Form, Collapsible } from "@instill-ai/design-system";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

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

const CollapsibleSection = ({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) => {
    const [open, setOpen] = React.useState(true);


    return (
        <Collapsible.Root open={open} onOpenChange={setOpen}>
            <Collapsible.Trigger className="mb-2" asChild>
                <button className="flex w-full flex-row items-center gap-x-1 rounded py-1 hover:bg-semantic-bg-secondary">
                    {open ? (
                        <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
                    ) : (
                        <Icons.ChevronRight className="h-4 w-4 stroke-semantic-fg-primary" />
                    )}
                    <p className="text-semantic-fg-primary product-body-text-3-semibold">
                        {title}
                    </p>
                </button>
            </Collapsible.Trigger>
            <Collapsible.Content className="flex flex-col gap-y-4">
                {children}
            </Collapsible.Content>
        </Collapsible.Root>
    );
};

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

    const router = useRouter();

    const ownerID = "ownerID";


    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    Upload & Explore
                </p>
            </div>
            <Separator orientation="horizontal" className="my-4" />
            <div className="w-full h-[150px] relative bg-semantic-accent-bg rounded border  border-dashed border-semantic-secondary-bg flex-col product-body-text-4-regular ">
                <Icons.Upload01 className="w-8 h-8" />
                <div className="text-center w-full">
                    <span className="">
                        Drag-and-drop file, or{" "}
                    </span>
                    <span className="text-semantic-accent-hover underline">
                        browse computer
                    </span>
                    <div className="">
                        Max 15MB each
                    </div>
                    <div className=" ">
                        Support TXT, MARKDOWN, PDF
                    </div>
                    {/* <div className=" ">
                        Support TXT, MARKDOWN, PDF, PNG, JPG (DOCX, DOC, PPTX, PPT, HTML, XML, RTF).
                    </div> */}
                </div>
            </div>
            <div className="w-full px-2 py-1.5  rounded border border-[#E1E6EF] justify-start items-center gap-2 inline-flex">
                <div className="w-5 h-5 relative" />
                <div className=" product-body-text-3-regular">filename.pdf</div>
                <div className="grow shrink basis-0 product-body-text-4-regular text-semantic-fg-disabled">150KB</div>
                <div className="w-4 h-4 relative" />
            </div>
            <div className=" flex-col justify-start items-start gap-1 inline-flex">
                <div className="text-semantic-fg-primary product-body-text-3-semibold">
                    Pipeline in use
                </div>
                <div className="justify-start items-center gap-1 inline-flex">
                    <Icons.Pipeline className="w-4 h-4" />
                    <button
                        type="button"
                        className="hover:!underline text-semantic-accent-hover product-body-text-3-semibold"
                        onClick={() => {
                            router.push(`/${ownerID}`);
                        }}
                    >
                        xiaofei/name-your-pet
                    </button>
                </div>
            </div>

            {/* 
            COMING IN V2 
            */}

            {/* <div className="flex w-full items-center justify-start">
                <Tabs.Root defaultValue="text" className="mb-8 mt-4 w-full">
                    <div className="flex flex-col items-center w-full">
                        <Tabs.List className="w-full h-8 border-b border-slate-200 flex justify-start items-start gap-0.5">
                            <Tabs.Trigger value="text" className="px-4 bg-white rounded-tl-lg rounded-tr-lg border-l border-r border-t border-slate-200 justify-start items-center gap-2 flex">
                                <span className="text-center text-gray-800 text-xs font-semibold font-['IBM Plex Sans'] capitalize leading-3 tracking-tight">Text</span>
                            </Tabs.Trigger>
                            <Tabs.Trigger value="images" className="px-4 bg-slate-50 rounded-tl-lg rounded-tr-lg border border-slate-200 justify-start items-center gap-2 flex">
                                <span className="text-center text-gray-800/opacity-60 text-xs font-semibold font-['IBM Plex Sans'] capitalize leading-3 tracking-tight">Images</span>
                            </Tabs.Trigger>
                        </Tabs.List>
                    </div>
                    <div className="bg-white pt-8 px-8">
                        <div className="flex w-full flex-row space-x-4">
                            <div className="flex w-1/2 flex-col">
                                <Tabs.Content value="text" className="flex w-full">
                                    <Form.Root {...form} onSubmit={form.handleSubmit(onSubmit)}>
                                        <form className="flex flex-col gap-6 w-full">
                                            <CollapsibleSection title="Convert / Transform files">
                                                <div className="flex gap-8">
                                                    <Form.Field
                                                        control={form.control}
                                                        name="convertTransformFiles"
                                                        render={({ field }) => (
                                                            <Form.Item className="w-1/2">
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
                                                            <Form.Item className="w-1/2">
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
                                            </CollapsibleSection>
                                            <CollapsibleSection title="Split text">
                                                <div className="flex gap-8">
                                                    <Form.Field
                                                        control={form.control}
                                                        name="splitTextFiles"
                                                        render={({ field }) => (
                                                            <Form.Item className="w-1/2">
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
                                                            <Form.Item className="w-1/2">
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
                                                            <Form.Item className="w-1/2">
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
                                                            <Form.Item className="w-1/2">
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
                                            </CollapsibleSection>
                                            <CollapsibleSection title="Embed chunks">
                                                <div className="flex gap-8">
                                                    <Form.Field
                                                        control={form.control}
                                                        name="embedChunksFiles"
                                                        render={({ field }) => (
                                                            <Form.Item className="w-1/2">
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
                                                                            <Select.Item value="option2">Option2</Select.Item>
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
                                                            <Form.Item className="w-1/2">
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
                                            </CollapsibleSection>
                                        </form>
                                    </Form.Root>
                                </Tabs.Content>
                                <Tabs.Content value="images">
                                </Tabs.Content>
                            </div>
                            <Separator orientation="vertical" />
                            <div className="flex w-1/2 flex-col pl-8">
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
            </div> */}
        </div>
    );
};