import { Icons, Separator, Tabs, Button, Select, Input, Textarea, Form, Collapsible } from "@instill-ai/design-system";
import * as React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { KnowledgeBase } from "../../../lib/vdp-sdk/knowledge/types";
import { useUploadKnowledgeBaseFile } from "../../../lib/react-query-service/knowledge";
import { InstillStore, useAuthenticatedUser, useInstillStore, useShallow } from "../../../lib";
import FilePreview from "./FilePreview";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB


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




type UploadExploreTabProps = {
    knowledgeBase: KnowledgeBase;
};

export const UploadExploreTab = ({ knowledgeBase }: UploadExploreTabProps) => {
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

    const selector = (store: InstillStore) => ({
        accessToken: store.accessToken,
        enabledQuery: store.enabledQuery,
    });

    const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

    const uploadKnowledgeBaseFile = useUploadKnowledgeBaseFile();

    const getFileType = (file: File) => {
        const extension = file.name.split(".").pop()?.toLowerCase();
        switch (extension) {
            case "txt":
                return "FILE_TYPE_TEXT";
            case "md":
                return "FILE_TYPE_MARKDOWN";
            case "pdf":
                return "FILE_TYPE_PDF";
            default:
                return "FILE_TYPE_UNSPECIFIED";
        }
    };

    const handleFileUpload = async (file: File) => {
        if (file.size > MAX_FILE_SIZE) {
            alert("File size exceeds the maximum limit of 15MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const content = btoa(event.target?.result as string);

            uploadKnowledgeBaseFile.mutate(
                {
                    ownerId: ownerID,
                    knowledgeBaseId: knowledgeBase.id,
                    payload: {
                        name: file.name,
                        type: getFileType(file),
                        content,
                    },
                    accessToken,
                },
                {
                    onSuccess: () => {
                        alert("File uploaded successfully!");
                    },
                    onError: (error) => {
                        console.error("Error uploading file:", error);
                        alert("An error occurred while uploading the file.");
                    },
                }
            );
        };
        reader.readAsBinaryString(file);
    };

    const router = useRouter();

    const me = useAuthenticatedUser({
        enabled: enabledQuery,
        accessToken,
    });

    const ownerID = me.isSuccess ? me.data.id : null;

    const [isDragging, setIsDragging] = React.useState(false);

    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            form.setValue("file", file);
            await handleFileUpload(file);
        }
    };

    const handleRemoveFile = () => {
        form.setValue("file", undefined);
    };

    return (
        <div className="flex flex-col mb-32">
            <div className="flex items-center justify-between mb-5">
                <p className="text-2xl font-bold text-semantic-fg-primary product-headings-heading-1">
                    {knowledgeBase.name}
                </p>
            </div>
            <Separator orientation="horizontal" className="mb-6" />
            <Form.Root {...form}>
                <form className="space-y-4 mb-6">
                    <Form.Field
                        control={form.control}
                        name="file"
                        render={({ field }) => (
                            <Form.Item className="w-full">
                                <Form.Control>
                                    <div
                                        className={`flex h-[150px] w-full cursor-pointer flex-col items-center justify-center rounded border border-dashed ${isDragging ? "border-semantic-accent-default" : "border-semantic-bg-line"
                                            } bg-semantic-bg-base-bg text-semantic-fg-secondary product-body-text-4-regular hover:border-semantic-accent-default`}
                                        onDragEnter={handleDragEnter}
                                        onDragLeave={handleDragLeave}
                                        onDragOver={handleDragOver}
                                        onDrop={handleDrop}
                                    >
                                        <Form.Label htmlFor="upload-file-field" className="cursor-pointer">
                                            <div className="flex flex-col items-center justify-center space-y-2">
                                                <Icons.Upload01 className="w-8 h-8 p-1 stroke-semantic-fg-secondary mb-4" />
                                                <div className="text-center w-full">
                                                    <span>Drag-and-drop file, or </span>
                                                    <span className="text-semantic-accent-hover underline">
                                                        browse computer
                                                    </span>
                                                    <div>Support TXT, MARKDOWN, PDF</div>
                                                    <div>Max 15MB each</div>
                                                </div>
                                            </div>
                                        </Form.Label>
                                        <Input.Root className="hidden">
                                            <Input.Core
                                                {...field}
                                                id="upload-file-field"
                                                type="file"
                                                accept=".txt,.md,.pdf"
                                                value={undefined}
                                                onChange={async (e) => {
                                                    const file = e.target.files?.[0];
                                                    if (file) {
                                                        field.onChange(file);
                                                        await handleFileUpload(file);
                                                    }
                                                }}
                                            />
                                        </Input.Root>
                                    </div>
                                </Form.Control>
                                <Form.Message />
                            </Form.Item>
                        )}
                    />
                </form>
            </Form.Root>
            {form.watch("file") && (
                <div className="flex justify-center items-center gap-1 mb-6">
                    <div className="flex items-center justify-between w-full h-8 px-2 py-1.5 rounded border border-semantic-bg-line">
                        <div className="flex items-center gap-2">
                            <Icons.File05 className="w-5 h-5 stroke-semantic-fg-secondary" />
                            <div className="product-body-text-3-regular">{form.watch("file").name}</div>
                            <div className="flex-grow product-body-text-4-regular text-semantic-fg-disabled">
                                {Math.round(form.watch("file").size / 1024)}KB
                            </div>
                        </div>
                        <Icons.X className="w-4 h-4 stroke-semantic-fg-secondary cursor-pointer" onClick={handleRemoveFile} />
                    </div>
                </div>
            )}
            {/* <div className=" flex-col justify-start items-start gap-1 inline-flex">
                <div className="text-semantic-fg-primary product-body-text-3-semibold">
                    Pipeline in use
                </div>
                <div className="justify-start items-center gap-1 inline-flex">
                    <Icons.Pipeline className="w-4 h-4 stroke-semantic-accent-hover" />
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
            </div> */}
            {/* <FilePreview /> */}
            <div className="flex justify-end">
                <Button variant="primary" size="lg" disabled={!form.watch("file")}>
                    Process File
                </Button>
            </div>
        </div>
    );
};